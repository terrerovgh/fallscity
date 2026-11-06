"""Vectorize the supplied Louisville artwork without embedding raster data.

Requires Pillow, NumPy and the reference WEBP in public/brand. Horizontal pixel
runs are merged into SVG paths, retaining the source composition and fine detail.
Usage: python3 scripts/louisville-skyline.py src/assets/brand/louisville-skyline.svg
"""
from pathlib import Path
import sys

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'public/brand/louisville-state-of-kentucky-in-colorful-abstract.webp'
WIDTH, HEIGHT = 612, 153
VIEW_Y, VIEW_HEIGHT = 12, 118
COLORS = 96

TEXT_REGIONS = (
    (260, 12, 350, 30),
    (214, 131, 394, 145),
)

MOVING_REGIONS = (
    ('sky-cloud sky-cloud--a', (160, 32, 183, 46)),
    ('sky-cloud sky-cloud--b', (454, 31, 478, 45)),
    ('sky-cloud sky-cloud--c', (66, 42, 84, 55)),
    ('sky-cloud sky-cloud--d', (534, 45, 551, 59)),
    ('sky-balloon sky-balloon--a', (233, 14, 247, 32)),
    ('sky-balloon sky-balloon--b', (246, 25, 259, 40)),
)

source = Image.open(SOURCE).convert('RGB')
if source.size != (WIDTH, HEIGHT):
    raise ValueError(f'Expected a {WIDTH}x{HEIGHT} reference, got {source.size}')

quantized = source.quantize(colors=COLORS, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
pixels = np.array(quantized)
palette = quantized.getpalette()
base_mask = np.zeros((HEIGHT, WIDTH), dtype=bool)
base_mask[VIEW_Y:VIEW_Y + VIEW_HEIGHT] = True
for _, (x0, y0, x1, y1) in MOVING_REGIONS:
    base_mask[y0:y1, x0:x1] = False
for x0, y0, x1, y1 in TEXT_REGIONS:
    base_mask[y0:y1, x0:x1] = False


def color_for(index):
    return '#' + ''.join(f'{channel:02x}' for channel in palette[index * 3:index * 3 + 3])


def paths_for_mask(mask, include_white=True):
    paths = []
    for raw_index in np.unique(pixels[mask]):
        index = int(raw_index)
        color = color_for(index)
        if not include_white and min(palette[index * 3:index * 3 + 3]) > 242:
            continue
        runs = []
        for y, row in enumerate(pixels):
            xs = np.flatnonzero((row == index) & mask[y])
            if not len(xs):
                continue
            splits = np.flatnonzero(np.diff(xs) > 1) + 1
            for run in np.split(xs, splits):
                x = int(run[0])
                width = int(run[-1] - run[0] + 1)
                runs.append(f'M{x} {y}h{width}v1h{-width}z')
        if runs:
            paths.append(f'<path fill="{color}" d="{"".join(runs)}"/>')
    return ''.join(paths)


layers = [f'<g class="skyline-static">{paths_for_mask(base_mask)}</g>']
for class_name, (x0, y0, x1, y1) in MOVING_REGIONS:
    mask = np.zeros((HEIGHT, WIDTH), dtype=bool)
    mask[y0:y1, x0:x1] = True
    layers.append(f'<g class="{class_name}">{paths_for_mask(mask, include_white=False)}</g>')

art = ''.join(layers)
output = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'src/assets/brand/louisville-skyline.svg'
output.write_text(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {VIEW_Y} {WIDTH} {VIEW_HEIGHT}" '
    f'aria-hidden="true" focusable="false" shape-rendering="auto">'
    f'<rect y="{VIEW_Y}" width="{WIDTH}" height="{VIEW_HEIGHT}" fill="#ffffff"/>{art}</svg>\n'
)
