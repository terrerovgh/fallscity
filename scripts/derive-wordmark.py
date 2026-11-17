from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.varLib import instancer
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
font = TTFont(root / 'assets/fonts/HankenGrotesk-Variable.ttf')
font = instancer.instantiateVariableFont(font, {'wght': 650})
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
hmtx = font['hmtx']
x = 0
paths = []
for char in 'Falls City':
    name = cmap[ord(char)]
    pen = SVGPathPen(glyphs)
    glyphs[name].draw(TransformPen(pen, (1, 0, 0, 1, x, 0)))
    paths.append(pen.getCommands())
    x += hmtx[name][0] - 28
bounds = BoundsPen(glyphs)
x = 0
for char in 'Falls City':
    name = cmap[ord(char)]
    glyphs[name].draw(TransformPen(bounds, (1, 0, 0, 1, x, 0)))
    x += hmtx[name][0] - 28
x_min, y_min, x_max, y_max = bounds.bounds
width = x_max - x_min
height = y_max - y_min
geometry = {
    'symbol': {
        'viewBox': '0 0 40 40',
        'paths': [
            'M2 2h20v8H10v7h12v8H10v13H2V2Z',
            'M38 2H20v36h18v-8H28V10h10V2Z'
        ]
    },
    'wordmark': {
        'viewBox': f'0 0 {width:.2f} {height:.2f}',
        'path': ' '.join(paths),
        'transform': f'translate({-x_min:.2f} {y_max:.2f}) scale(1 -1)',
        'width': round(width, 2),
        'height': round(height, 2)
    }
}
out = root / 'src/config/brand-geometry.json'
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(geometry, indent=2) + '\n')
print(f'Wrote {out}; wordmark {width:.2f} × {height:.2f} font units')
