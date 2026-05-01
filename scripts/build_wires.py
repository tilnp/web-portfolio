#!/usr/bin/env python3
"""Precompute wire->component bindings for the PCB SVG.

Walks public/board.svg, finds every direct child of the components layer,
computes its bounding box in SVG coordinates, then for each .trace path
reads its first and last point and hit-tests them against component bboxes
(smallest containing wins, with an 8-SVG-unit slop margin). Output:

    public/board.wires.json -> { "hash": <sha256>, "wires": [{i, a, b, fromB}] }

The hash matches what the client computes (SHA-256 of the SVG text after
stripping the <?xml ...?> prolog). When the client fetches this JSON it
verifies the hash against the freshly-fetched SVG; if they match, the
client uses the prebuilt mapping and skips the entire runtime hit-test.
On mismatch the client falls back to the runtime path, so this script
is advisory -- never load-breaking.

Re-run after editing public/board.svg:
    python scripts/build_wires.py
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

try:
    from svgelements import SVG, Group, Path as SVGPath, Shape
except ImportError:
    sys.exit("svgelements not installed. Run: pip install svgelements")


# svgelements stores namespaced attributes in Clark notation (i.e. with the
# full namespace URI in braces), NOT with the source-document prefix. The
# client SVG uses xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
# so `inkscape:label` round-trips through this Clark form.
INKSCAPE_LABEL = "{http://www.inkscape.org/namespaces/inkscape}label"


def inkscape_label(el):
    if not hasattr(el, "values"):
        return None
    return el.values.get(INKSCAPE_LABEL) or el.values.get("inkscape:label")


ROOT = Path(__file__).resolve().parent.parent
SVG_PATH = ROOT / "public" / "board.svg"
SCRIPT_PATH = ROOT / "public" / "script.js"
OUT_PATH = ROOT / "public" / "board.wires.json"

# SVG-unit slop. Mirrors the 8-screen-pixel margin in script.js's
# findComponentAtPoint -- close enough at the typical render scale, since
# the SVG viewBox width (~892) renders at roughly 600-1200px in practice.
MARGIN = 8


def parse_reveal_chunks(script_text: str) -> list[list[str]]:
    """Extract REVEAL_CHUNKS from script.js so the reveal order stays single-sourced.

    The array is a flat array of arrays of single-quoted strings -- no nested
    brackets, no template literals, no comments inside the inner arrays --
    which makes a regex extraction safe for the foreseeable shape of this
    constant.
    """
    m = re.search(
        r"const\s+REVEAL_CHUNKS\s*=\s*\[(.*?)\n\];",
        script_text,
        re.DOTALL,
    )
    if not m:
        sys.exit("Could not find `const REVEAL_CHUNKS = [...]` in script.js")
    body = m.group(1)
    chunks: list[list[str]] = []
    for arr in re.finditer(r"\[([^\[\]]*)\]", body):
        items = re.findall(r"'([^']*)'", arr.group(1))
        chunks.append(items)
    if not chunks:
        sys.exit("REVEAL_CHUNKS parsed as empty -- check the regex against script.js")
    return chunks


def strip_xml_prolog(svg_text: str) -> str:
    """Match the JS regex /^\\s*<\\?xml[^?]*\\?>\\s*/ exactly."""
    return re.sub(r"^\s*<\?xml[^?]*\?>\s*", "", svg_text)


def has_class(el, cls: str) -> bool:
    raw = el.values.get("class") if hasattr(el, "values") else None
    if not raw:
        return False
    return cls in raw.split()


def element_key(el, fallback_idx: int) -> tuple[str, bool]:
    """Mirror the client's key resolution: inkscape:label -> id -> __comp_N."""
    label = inkscape_label(el)
    if label:
        return label, True
    if el.id:
        return el.id, True
    return f"__comp_{fallback_idx}", False


def bbox_or_warn(el, label: str):
    try:
        bb = el.bbox()
    except Exception as e:
        print(f"  WARNING: bbox() raised for {label!r}: {e}", file=sys.stderr)
        return None
    if bb is None:
        print(f"  WARNING: no bbox for component {label!r} (skipping)", file=sys.stderr)
        return None
    return bb


def main() -> int:
    svg_text_raw = SVG_PATH.read_text(encoding="utf-8")
    svg_text = strip_xml_prolog(svg_text_raw)
    svg_hash = hashlib.sha256(svg_text.encode("utf-8")).hexdigest()

    script_text = SCRIPT_PATH.read_text(encoding="utf-8")
    reveal_chunks = parse_reveal_chunks(script_text)

    svg = SVG.parse(SVG_PATH)

    # Locate the components layer. Mirror the client's preference order:
    # inkscape:label="components" first, then id="components".
    components_layer = None
    for el in svg.elements():
        if not isinstance(el, Group):
            continue
        if (
            inkscape_label(el) == "components"
            or el.id == "components"
        ):
            components_layer = el
            break
    if components_layer is None:
        sys.exit("Could not find components layer "
                 "(inkscape:label='components' or id='components')")

    # Discover direct children of the components layer in document order.
    discovered: list[tuple[str, object, tuple[float, float, float, float]]] = []
    auto_idx = 0
    for child in list(components_layer):
        if not isinstance(child, (Group, Shape)):
            continue
        key, had_real_key = element_key(child, auto_idx)
        if not had_real_key:
            auto_idx += 1
        bb = bbox_or_warn(child, key)
        if bb is None:
            continue
        discovered.append((key, child, bb))

    # Build merged chunk list: curated chunks first, then any discovered key
    # not in the curation appended to the last chunk.
    curated_keys = {k for chunk in reveal_chunks for k in chunk}
    discovered_keys_in_order = [k for (k, _, _) in discovered]
    leftovers = [k for k in discovered_keys_in_order if k not in curated_keys]
    chunks = [list(c) for c in reveal_chunks]
    if leftovers:
        chunks[-1].extend(leftovers)

    # Resolve components in chunk order, dedup. Build the (label, bbox) list
    # in the same order the client would. Fall back to a svg-wide id /
    # inkscape:label lookup for keys that weren't found among direct children.
    bbox_by_key = {k: bb for (k, _, bb) in discovered}
    components_in_order: list[tuple[str, tuple[float, float, float, float]]] = []
    seen: set[str] = set()
    for chunk in chunks:
        for key in chunk:
            if key in seen:
                continue
            if key in bbox_by_key:
                components_in_order.append((key, bbox_by_key[key]))
                seen.add(key)
                continue
            # Fallback: search the whole SVG.
            fallback = None
            for el in svg.elements():
                if not isinstance(el, (Group, Shape)):
                    continue
                if el.id == key or inkscape_label(el) == key:
                    fallback = el
                    break
            if fallback is None:
                print(f"  WARNING: missing component {key!r}", file=sys.stderr)
                continue
            bb = bbox_or_warn(fallback, key)
            if bb is None:
                continue
            components_in_order.append((key, bb))
            seen.add(key)

    label_to_idx = {label: i for i, (label, _) in enumerate(components_in_order)}

    def find_component_at_point(x: float, y: float) -> str | None:
        best: str | None = None
        best_area = float("inf")
        for label, (xmin, ymin, xmax, ymax) in components_in_order:
            w, h = xmax - xmin, ymax - ymin
            if w <= 0 or h <= 0:
                continue
            if (xmin - MARGIN <= x <= xmax + MARGIN
                    and ymin - MARGIN <= y <= ymax + MARGIN):
                area = w * h
                if area < best_area:
                    best_area = area
                    best = label
        return best

    # Iterate .trace paths in document order. The client's
    # `svg.querySelectorAll('.trace')` also returns document order, so the
    # `i` index in the JSON lines up with `traceEls[i]` on the client.
    traces: list[SVGPath] = []
    for el in svg.elements():
        if isinstance(el, SVGPath) and has_class(el, "trace"):
            traces.append(el)

    wires: list[dict] = []
    both_count = 0       # both endpoints landed in a component
    one_count = 0        # exactly one endpoint resolved
    none_count = 0       # neither endpoint resolved (skipped)
    point_failed = 0     # path.point() raised (skipped)
    for i, t in enumerate(traces):
        try:
            p0 = t.point(0)
            p1 = t.point(1)
        except Exception as e:
            point_failed += 1
            print(f"  WARNING: trace #{i}: point() failed ({e})", file=sys.stderr)
            continue
        a = find_component_at_point(p0.x, p0.y)
        b = find_component_at_point(p1.x, p1.y)
        if not a and not b:
            none_count += 1
            print(
                f"  WARNING: trace #{i} has no resolvable endpoints — "
                f"start=({p0.x:.1f},{p0.y:.1f}) end=({p1.x:.1f},{p1.y:.1f})",
                file=sys.stderr,
            )
            continue
        if a and b:
            both_count += 1
            wires.append({"i": i, "a": a, "b": b})
        else:
            one_count += 1
            single = a or b
            wires.append({"i": i, "a": single, "b": single})

    # Direction of progressive draw: if endpoint b appears EARLIER in reveal
    # order than a, the wire should originate from b (the already-visible
    # endpoint). Mirrors the client's from-b classlist logic.
    for w in wires:
        ai = label_to_idx.get(w["a"])
        bi = label_to_idx.get(w["b"])
        w["fromB"] = ai is not None and bi is not None and bi < ai

    out = {"hash": svg_hash, "wires": wires}
    OUT_PATH.write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")

    # Summary — makes it obvious if an SVG edit broke references without
    # having to dig through the browser console.
    rel = OUT_PATH.relative_to(ROOT)
    total_traces = len(traces)
    print()
    print(f"  Wrote {rel}")
    print(f"  Hash:           {svg_hash[:16]}...")
    print(f"  Components:     {len(components_in_order)}")
    print(f"  Traces in SVG:  {total_traces}")
    print(f"    both endpoints bound: {both_count}")
    print(f"    one endpoint bound:   {one_count}")
    print(f"    no endpoints bound:   {none_count}  (skipped -- won't render)")
    if point_failed:
        print(f"    point() failed:       {point_failed}  (skipped)")
    print(f"  Wires written:  {len(wires)}")

    # Anything other than "all both" is worth flagging in the exit status so
    # CI / pre-commit hooks can pick it up. Stay zero-exit on success though,
    # since one-endpoint wires still render (they just look odd).
    if none_count or point_failed:
        print()
        print("  NOTE: some traces could not be bound. The client will still "
              "render the rest, but those wires will be missing.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
