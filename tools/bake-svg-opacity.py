#!/usr/bin/env python3
"""Bake a global alpha multiplier into board.svg by multiplying every
fill-opacity / stroke-opacity (in style="" or as standalone attrs) by ALPHA.
Idempotent: aborts if the sentinel comment is already present.

Why: the page used to render the SVG with CSS opacity:.45 on the <svg> root,
which forces the entire 668 KB SVG into a single offscreen buffer that the
GPU re-rasterises on every frame anything inside repaints. Baking alpha into
each fill/stroke removes the buffer.

Usage: python tools/bake-svg-opacity.py [path/to/file.svg]
       (defaults to public/board.svg)
"""

import re
import sys
from pathlib import Path

ALPHA = 0.45
SENTINEL = f'<!-- baked-alpha-{ALPHA} -->'


def multiply_in_style(style: str) -> str:
    style = re.sub(
        r'fill-opacity:([0-9.]+)',
        lambda m: f'fill-opacity:{float(m.group(1)) * ALPHA:.4f}',
        style,
    )
    style = re.sub(
        r'stroke-opacity:([0-9.]+)',
        lambda m: f'stroke-opacity:{float(m.group(1)) * ALPHA:.4f}',
        style,
    )
    if re.search(r'(?:^|;)\s*fill:\s*(?!none)[^;]+', style) and 'fill-opacity:' not in style:
        style = style.rstrip(';') + f';fill-opacity:{ALPHA:.4f}'
    if re.search(r'(?:^|;)\s*stroke:\s*(?!none)[^;]+', style) and 'stroke-opacity:' not in style:
        style = style.rstrip(';') + f';stroke-opacity:{ALPHA:.4f}'
    return style


def main() -> int:
    default = Path(__file__).resolve().parent.parent / 'public' / 'board.svg'
    svg = Path(sys.argv[1]) if len(sys.argv) > 1 else default
    if not svg.exists():
        print(f'[err] not found: {svg}', file=sys.stderr)
        return 1

    text = svg.read_text(encoding='utf-8')
    if SENTINEL in text:
        print(f'[skip] {svg} already baked at alpha={ALPHA}')
        return 0

    text = re.sub(
        r'style="([^"]*)"',
        lambda m: f'style="{multiply_in_style(m.group(1))}"',
        text,
    )
    text = re.sub(
        r'fill-opacity="([0-9.]+)"',
        lambda m: f'fill-opacity="{float(m.group(1)) * ALPHA:.4f}"',
        text,
    )
    text = re.sub(
        r'stroke-opacity="([0-9.]+)"',
        lambda m: f'stroke-opacity="{float(m.group(1)) * ALPHA:.4f}"',
        text,
    )
    text = re.sub(r'(<svg\b[^>]*>)', r'\1\n' + SENTINEL, text, count=1)

    svg.write_text(text, encoding='utf-8')
    print(f'[ok] baked alpha={ALPHA} into {svg}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
