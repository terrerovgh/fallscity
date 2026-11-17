from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
geometry_path = root / 'src/config/brand-geometry.json'
geometry = json.loads(geometry_path.read_text())

def outline(text, font_path):
    font = TTFont(font_path)
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font['hmtx']
    x = 0
    paths = []
    bounds = BoundsPen(glyphs)
    for char in text:
        name = cmap[ord(char)]
        pen = SVGPathPen(glyphs)
        glyphs[name].draw(TransformPen(pen, (1, 0, 0, 1, x, 0)))
        glyphs[name].draw(TransformPen(bounds, (1, 0, 0, 1, x, 0)))
        paths.append(pen.getCommands())
        x += hmtx[name][0] - 12
    x_min, y_min, _, y_max = bounds.bounds
    return {
        'viewBox': f'0 0 {x:.2f} {y_max - y_min:.2f}',
        'path': ' '.join(paths),
        'transform': f'translate({-x_min:.2f} {y_max:.2f}) scale(1 -1)',
        'width': round(x, 2),
        'height': round(y_max - y_min, 2)
    }

regular = root / 'assets/fonts/InstrumentSerif-Regular.ttf'
italic = root / 'assets/fonts/InstrumentSerif-Italic.ttf'
geometry['social'] = {
    'en': [outline('A website worthy', regular), outline('of your work.', italic)],
    'es': [outline('Una web a la altura', regular), outline('de su trabajo.', italic)]
}
geometry_path.write_text(json.dumps(geometry, indent=2) + '\n')
print('Added EN/ES social headline outlines')
