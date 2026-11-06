"""Draw the Louisville riverfront as clean SVG geometry, without lettering.

Coordinates follow src/assets/brand/louisville-state-of-kentucky-in-colorful-abstract.webp.
Usage: python3 scripts/louisville-skyline.py src/assets/brand/louisville-skyline.svg
"""
import sys

C = {
    'navy': '#16226e', 'ink': '#0d1927', 'royal': '#2453d6', 'blue': '#1e90f0',
    'sky': '#4fc3f7', 'ice': '#c4ecf5', 'mist': '#e8f7fb', 'cyan': '#0096b8',
    'teal': '#16857f', 'aqua': '#3fc1c9', 'green': '#35c27a', 'lime': '#d9e44a',
    'yellow': '#f6c544', 'gold': '#f5a63a', 'orange': '#f07a2a', 'red': '#e8433f',
    'coral': '#ef6f5e', 'copper': '#a44424', 'magenta': '#c2357a', 'rose': '#e8638f',
    'pink': '#f6a9c3', 'blush': '#fbd9e4', 'plum': '#7e2f57', 'purple': '#8a3fe6',
    'violet': '#5a2a8e', 'orchid': '#c64fdc', 'cream': '#fbf3dc', 'slate': '#8fa9a6',
    'steel': '#4a78b0', 'water': '#0aa0d8', 'water2': '#078cc0', 'foam': '#9fdcf0',
}

layers = []
cur = []


def group(cls=None):
    global cur
    cur = []
    layers.append((cls, cur))


def f(n):
    return ('%.2f' % n).rstrip('0').rstrip('.')


def R(x, y, w, h, c):
    cur.append(('rect', C.get(c, c), f'M{f(x)} {f(y)}h{f(w)}v{f(h)}h{f(-w)}z'))


def P(d, c):
    cur.append(('path', C.get(c, c), d))


def raw(s):
    cur.append(('raw', None, s))


def windows(x0, y0, x1, y1, c, dx, dy, ww, wh):
    y = y0
    while y + wh <= y1 + 0.01:
        x = x0
        while x + ww <= x1 + 0.01:
            R(x, y, ww, wh, c)
            x += dx
        y += dy


def hlines(x0, x1, y0, y1, c, step, th):
    y = y0
    while y + th <= y1 + 0.01:
        R(x0, y, x1 - x0, th, c)
        y += step


def vlines(x0, x1, y0, y1, c, step, th):
    x = x0
    while x + th <= x1 + 0.01:
        R(x, y0, th, y1 - y0, c)
        x += step


# Sky
group('sky-cloud sky-cloud--a')
P('M163 41c.4-2.6 2.4-3.9 4.4-3.4.8-2.6 2.8-4.2 5-4.2 2.6 0 4.5 1.9 5 4.5 1.8.2 3.1 1.5 3.4 3.1z', 'sky')
P('M164 40.2h16.5c-.8.6-2 .9-3.6.9h-11.8c-.5 0-.9-.3-1.1-.9z', 'aqua')

group('sky-cloud sky-cloud--b')
P('M457 40.5c.4-2.4 2.2-3.6 4.1-3.2.9-2.9 3.1-4.6 5.6-4.6 2.8 0 4.9 2.1 5.4 4.9 1.9.2 3.3 1.5 3.6 2.9z', 'sky')
P('M458 39.8h17.2c-.8.6-2 .8-3.6.8h-12.3c-.5 0-.9-.3-1.3-.8z', 'aqua')

group('sky-cloud sky-cloud--c')
P('M70 50c.3-1.7 1.6-2.6 3-2.3.6-1.9 2.1-3 3.7-3 1.9 0 3.3 1.4 3.6 3.2 1.3.1 2.2 1 2.5 2.1z', 'ice')

group('sky-cloud sky-cloud--d')
P('M538 54c.3-1.7 1.6-2.6 3-2.3.6-1.9 2.1-3 3.7-3 1.9 0 3.3 1.4 3.6 3.2 1.3.1 2.2 1 2.5 2.1z', 'ice')

group('sky-balloon sky-balloon--a')
P('M239.5 17.5c-2.6 0-4.3 2-4.3 4.4 0 2.6 2.3 4.2 3.3 5.6h2c1-1.4 3.3-3 3.3-5.6 0-2.4-1.7-4.4-4.3-4.4z', 'sky')
P('M239.5 17.5c-1 0-1.6 2-1.6 4.4 0 2.6.9 4.2 1.1 5.6h1c.2-1.4 1.1-3 1.1-5.6 0-2.4-.6-4.4-1.6-4.4z', 'ice')
raw(f'<path d="M238.7 27.2v1.2m1.6-1.2v1.2" fill="none" stroke="{C["copper"]}" stroke-width=".35"/>')
R(238.6, 28.2, 1.8, 1.6, 'copper')

group('sky-balloon sky-balloon--b')
P('M251.5 27.6c-2.2 0-3.6 1.6-3.6 3.6 0 2.1 1.9 3.4 2.7 4.6h1.8c.8-1.2 2.7-2.5 2.7-4.6 0-2-1.4-3.6-3.6-3.6z', 'rose')
P('M247.9 31.2h7.2c-.1.6-.3 1.1-.6 1.6h-6c-.3-.5-.5-1-.6-1.6z', 'pink')
raw(f'<path d="M250.9 35.4v1.1m1.2-1.1v1.1" fill="none" stroke="{C["copper"]}" stroke-width=".3"/>')
R(250.7, 36.3, 1.6, 1.4, 'copper')

# Buildings behind the bridge
group('city-left')
R(45, 69.5, 10, 30, 'sky')
R(45, 69.5, 10, 2, 'aqua')
R(50, 72, 5, 27.5, 'cyan')
R(78, 85.5, 12, 14, 'coral')
R(78, 85.5, 12, 1.4, 'red')
R(96, 80, 7, 20, 'orange')
R(103, 80, 4.5, 20, 'purple')
R(64, 90, 10, 9.5, 'gold')
R(132, 88, 9, 11.5, 'rose')

# Domed blocks at the end of the bridge
R(149, 83.5, 10, 18, 'teal')
R(155, 83.5, 4, 18, 'aqua')
P('M141 101V89.5c0-3.2 2.2-5.6 4.8-5.6s4.8 2.4 4.8 5.6V101z', 'royal')
P('M145.8 83.9c2.6 0 4.8 2.4 4.8 5.6V101h-4.8z', 'blue')
vlines(151, 158, 86, 99, 'navy', 2.4, .6)

# Stepped green tower and a narrow orange high-rise behind the arena
P('M157 101V69h2.5v-5h3v-5h7v5h3v5h2.5v32z', 'teal')
P('M159.5 69h3v-5h7v5h3v32h-13z', 'green')
R(162.5, 59, 7, 2, 'lime')
R(161.5, 64, 9, 1.4, 'lime')
vlines(161.5, 171, 72, 99, 'lime', 2.4, .65)
hlines(160, 172, 75, 98, '#2ea866', 4.2, .6)
R(185, 68, 14, 20, 'gold')
R(187, 68, 10, 20, 'orange')
R(186, 66.5, 12, 1.5, 'red')
hlines(188, 196, 71, 85, 'yellow', 3, .75)
vlines(189, 196, 70, 85, 'copper', 3.4, .45)

# Waterfront arena
group('city-arena')
P('M171.5 107V89c0-3.6 2.6-6 6-6H209v24z', 'ice')
P('M177.5 83H263v2h-85.5c-2.4 0-4 1-4.6 2.4l-1.9-.4c.8-2.4 3.3-4 6.5-4z', 'aqua')
R(208.5, 85, 54.5, 22, 'blue')
R(246, 85, 17, 22, 'sky')
R(208.5, 85, 14, 3.4, 'royal')
R(175, 89.6, 29, 11.4, 'plum')
hlines(175, 204, 90.4, 101, 'rose', 2.6, 1.2)
R(175, 101.6, 29, 1.4, 'sky')
R(211, 90.5, 8, 10, 'royal')
R(212.5, 92, 5, 7, 'navy')
R(219.5, 91.5, 14, 8, 'yellow')
hlines(220.5, 232.5, 93, 99, 'navy', 2, .7)
vlines(236, 245, 88, 105, 'ice', 3, .5)
R(208.5, 104.8, 54.5, 1.2, 'navy')

# Pointed blue tower
P('M242.5 91V73H246V63.2l5-6.4 5 6.4V73h3.5v18z', 'royal')
P('M251 56.8l5 6.4V73h3.5v18H251z', 'blue')
P('M246 63.2l5-6.4 5 6.4z', 'cyan')
vlines(247.2, 255.5, 64.5, 90, 'navy', 2.1, .5)
R(250.65, 54.5, .7, 3, 'royal')

# Cream tower and rose hotel block
group('city-center')
R(271.5, 55.5, 17.5, 46, 'cream')
windows(272.8, 58, 288, 100, 'steel', 2.4, 2.6, 1.5, 1.4)
P('M271.5 56c1.4-2.6 4.4-4.1 8.75-4.1S287.6 53.4 289 56z', 'coral')
R(280, 46, .6, 6, 'coral')
R(271.5, 55.5, 17.5, .8, 'gold')
R(287, 76.5, 25, 27.5, 'red')
R(287, 76.5, 25, 1.6, 'pink')
windows(288.4, 79.4, 311, 103, 'blush', 2.3, 2.4, 1.2, 1.4)
P('M290 76.5c0-2.6 1.3-4.8 3.2-5.3V69h.7v2.2c1.9.5 3.2 2.7 3.2 5.3z', 'violet')

# Pale glass block and green rear tower
R(306, 53, 17.5, 16, 'slate')
windows(307.2, 55, 322.5, 68, 'teal', 2.2, 2.4, 1.2, 1.3)
P('M306 53.4c1.5-2 4.4-3.3 8.75-3.3s7.2 1.3 8.75 3.3z', 'coral')
R(314.4, 46.5, .6, 4, 'coral')
R(300, 67.5, 27, 32, 'ice')
windows(301.4, 69.5, 326, 98, 'steel', 2.4, 2.6, 1.6, 1.6)
R(323.5, 75, 5.5, 5, 'gold')
R(326, 60.5, 15.5, 39, 'green')
R(326, 60.5, 4, 39, '#2ea866')
vlines(331.5, 340, 63, 98, '#7fe0a8', 2.6, .5)

# Domed magenta tower
group('city-landmarks')
R(366, 58.5, 12.5, 41, 'teal')
hlines(368, 378.5, 60.5, 98, 'aqua', 2.2, .6)
P('M352.6 38.6c0-5.6 3.4-10 7.9-10s7.9 4.4 7.9 10z', 'gold')
P('M360.5 28.6c2.8 0 5.2 2.8 6.5 6.4-1.6-1.6-3.8-2.4-6.5-2.4s-4.9.8-6.5 2.4c1.3-3.6 3.7-6.4 6.5-6.4z', 'yellow')
R(360.2, 25.4, .6, 3.4, 'gold')
R(351.5, 38.4, 18, 10.2, 'rose')
vlines(354.5, 367, 40.8, 46.6, 'blush', 2.2, 1.1)
R(350, 48.4, 21, 52, 'magenta')
hlines(351.5, 369.5, 50.5, 62, 'rose', 2.4, .7)
R(352, 62.8, 17, 2.8, 'pink')
R(354.5, 66, 12, 33, 'navy')
R(358.7, 66, 1.1, 33, 'ice')
R(361.8, 66, 1.1, 33, 'ice')

# Tall plum tower and its neighbors
R(387, 77, 7, 23, 'green')
R(396.3, 18.5, .65, 6.5, 'coral')
R(405.2, 17, .65, 8, 'coral')
R(396.15, 17.9, .95, .7, 'gold')
R(405.05, 16.4, .95, .7, 'gold')
R(393, 25, 16.5, 72, 'plum')
windows(394.4, 32.4, 408.5, 73, 'rose', 2.4, 2.1, 1.6, .9)
windows(394.4, 80, 408.5, 95, 'rose', 2.4, 2.1, 1.6, .9)
vlines(395.2, 408, 26, 95, '#9a4776', 3.2, .45)
R(391.8, 24.2, 18.9, 1.2, 'pink')
R(393, 25, 16.5, 6, 'royal')
R(393, 73.6, 16.5, 5, 'royal')
R(389.5, 95.5, 23.5, 5, 'magenta')
R(390.5, 95.5, 21.5, .8, 'pink')
R(414.5, 58, 9, 41, 'aqua')
R(414.5, 58, 3, 41, 'cyan')

# Orange tower
group('city-orange')
R(422.5, 39.5, 29, 61, 'yellow')
R(425, 44.5, 24, 54, 'orange')
hlines(426, 448, 63.5, 88, 'gold', 2.2, .8)
R(427.5, 46, 19, 6.6, 'navy')
vlines(429, 446, 46, 52.6, 'gold', 2.1, .9)
R(426.5, 54.6, 21, 7.6, 'teal')
P('M426.5 54.6h21c0 2.1-1.7 3.8-3.8 3.8h-13.4c-2.1 0-3.8-1.7-3.8-3.8z', 'aqua')
R(433.5, 62, 7, 37, 'navy')
hlines(434.3, 439.7, 64, 97, 'royal', 2.4, 1)
windows(425.6, 88.6, 432.5, 98, 'red', 2.3, 2.6, 1.6, 1.8)
windows(441.6, 88.6, 448.5, 98, 'red', 2.3, 2.6, 1.6, 1.8)
R(450, 81, 10, 19, 'ice')

# Right-hand low-rise buildings
group('city-right')
R(451, 87.5, 19, 13, 'teal')
P('M451 92.5c2-2.4 5-3.6 8-3.6s6 1.2 8 3.6z', 'aqua')
R(451, 95, 13, 7, 'royal')
R(469, 88.5, 13, 13, 'gold')
R(481, 91, 7, 10.5, 'red')
R(487.5, 84.5, 12.5, 17, 'gold')
R(487.5, 84.5, 12.5, 1.6, 'yellow')
R(499.5, 96, 12.5, 8, 'green')
R(508, 89.5, 12, 14, 'aqua')
R(508, 89.5, 12, 1.4, 'ice')
vlines(509.5, 519, 92, 102, 'cyan', 2.4, .6)
R(520, 98.5, 12, 5.5, 'yellow')
R(527, 96.5, 5.5, 7.5, 'teal')
R(532, 89, 20.5, 12.5, 'royal')
R(542, 91, 10.5, 10.5, 'sky')
R(532, 89, 20.5, 1.8, 'navy')
R(537, 90.8, 5.5, 10.7, 'purple')
R(537, 98, 5.5, 3.5, 'orange')
R(552, 101.5, 23.5, 5.5, 'slate')
R(552, 101.5, 23.5, 1.2, 'ice')
hlines(554, 574, 103.6, 106, 'ink', 2, .5)

# Riverbank and promenade
group('riverbank')
R(-1200, 99.5, 3000, 8.5, 'mist')
R(14, 99.5, 160, 8.5, 'cream')
R(45, 100.5, 15, 6, 'sky')
R(62, 101.5, 10, 5, 'yellow')
R(73, 102.5, 4, 4, 'green')
R(86, 102.5, 4, 4, 'green')
R(96, 101.5, 14, 5, 'gold')
R(140, 98.5, 22, 7.5, 'yellow')
R(162, 100.5, 10, 6, 'orange')
R(173, 104, 135, 3.4, 'ice')
R(208.5, 103, 54.5, 4.4, 'royal')
R(255, 93, 12, 14, 'gold')
R(266, 91.5, 21, 15.5, 'coral')
windows(268, 94, 286, 105, 'blush', 2.4, 2.6, 1.3, 1.4)
R(300, 98, 26, 7, 'yellow')
hlines(302, 324, 100, 104.5, 'ink', 2.2, .5)
R(326, 98, 24, 6.4, 'royal')
vlines(327.5, 349, 99.4, 103.4, 'ice', 2.2, .7)
R(350, 99.5, 40, 6.5, 'yellow')
R(372, 101.5, 10, 4.5, 'gold')
R(380, 100.5, 71, 7.5, 'royal')
windows(382, 102, 450, 106.4, 'sky', 3.2, 2.4, 2, 1.2)
R(-1200, 106.6, 3000, 2.2, 'orange')
R(-1200, 108.8, 3000, 3.8, 'magenta')
windows(16, 109.6, 450, 111.8, 'rose', 6, 4, 3.6, 1.4)
R(-1200, 112.6, 3000, 2.6, 'pink')
R(451, 101, 125, 6, 'mist')
R(451, 106.5, 146, 8.6, 'navy')
R(451, 109.8, 146, 1.2, 'royal')
for x in (452, 469.5, 487, 504.5, 522, 539.5, 557, 574.5, 592):
    R(x - 2.2, 105.4, 4.4, 2.2, 'green')
    R(x - 1.5, 107.4, 3, 7.6, 'lime')
R(-1200, 115.1, 3000, 1.6, 'navy')

# Geometric trees and promenade lights
for x, y, s, color in [
    (155, 98.5, .8, 'green'), (181, 101, .7, 'lime'),
    (201, 100.5, .75, 'green'), (291, 99, .8, 'lime'),
    (318, 98.5, .85, 'green'), (343, 98, .9, 'lime'),
    (382, 99.5, .75, 'green'), (416, 99, .85, 'lime'),
    (464, 100, .75, 'green'), (483, 100, .7, 'lime'),
    (526, 100, .75, 'green'), (548, 100.5, .65, 'lime'),
]:
    R(x - .35 * s, y + 1.8 * s, .7 * s, 4.2 * s, 'copper')
    P(
        f'M{f(x)} {f(y - 2.4 * s)}L{f(x + 2.5 * s)} {f(y)}'
        f'L{f(x + 1.8 * s)} {f(y + 2.8 * s)}H{f(x - 1.8 * s)}'
        f'L{f(x - 2.5 * s)} {f(y)}z',
        color,
    )
    P(
        f'M{f(x)} {f(y - 2.4 * s)}L{f(x + 2.5 * s)} {f(y)}'
        f'L{f(x + 1.8 * s)} {f(y + 2.8 * s)}H{f(x)}z',
        'green' if color == 'lime' else 'lime',
    )
for x in (176, 235, 296, 376, 445, 497):
    raw(
        f'<path d="M{x} 101v6m-1.2-6h2.4" fill="none" stroke="{C["ink"]}" stroke-width=".4"/>'
        f'<circle cx="{x}" cy="100.6" r=".75" fill="{C["yellow"]}"/>'
    )

# Truss bridge
group('bridge')
top = [
    (14.5, 85), (22, 80), (30, 76.4), (37.5, 74.4), (45, 76.2),
    (53, 81.5), (60, 87.2), (106, 87.2), (112, 84), (119.5, 81.6),
    (127, 84), (134, 90), (140.5, 96.5),
]


def top_y(x):
    for (xa, ya), (xb, yb) in zip(top, top[1:]):
        if xa <= x <= xb:
            return ya + (yb - ya) * (x - xa) / (xb - xa)
    return 96.5


deck = 96.5
truss = []
xs = [14.5 + i * 4.2 for i in range(31)]
xs = [x for x in xs if x <= 140.5]
for a, b in zip(xs, xs[1:]):
    ya, yb = top_y(a), top_y(b)
    truss.append(f'M{f(a)} {f(ya)}L{f(b)} {f(deck)}M{f(a)} {f(deck)}L{f(b)} {f(yb)}')
    truss.append(f'M{f(b)} {f(yb)}V{f(deck)}')
chord = 'M' + 'L'.join(f'{f(x)} {f(y)}' for x, y in top)
raw(f'<path fill="none" stroke="{C["rose"]}" stroke-width=".55" d="{"".join(truss)}"/>')
raw(f'<path fill="none" stroke="{C["red"]}" stroke-width="1.5" stroke-linejoin="round" d="{chord}"/>')
raw(f'<path fill="none" stroke="{C["red"]}" stroke-width=".9" d="M14.5 85V96.5M60 87.2V96.5M106 87.2V96.5"/>')
raw(f'<path fill="none" stroke="{C["pink"]}" stroke-width=".4" d="M15 93.8H139.5"/>')
raw(
    f'<g fill="{C["blush"]}">'
    + ''.join(f'<circle cx="{f(x)}" cy="{f(y)}" r=".48"/>' for x, y in top)
    + ''.join(f'<circle cx="{f(x)}" cy="97.2" r=".38"/>' for x in xs)
    + '</g>'
)
R(13.5, 96, 128, 2.6, 'red')
R(13.5, 98.6, 128, 1.1, 'copper')
P('M29.5 99.7h14.5l2.6 15.4h-19.7z', 'purple')
P('M31.5 99.7h3l-1 15.4h-4z', 'orchid')
P('M114.8 99.7h11.4l2 15.4h-15.4z', 'orchid')
P('M116.5 99.7h2.4l-.8 15.4h-3.2z', '#e07ae8')

# Ohio River
group('river')
R(-1200, 116.7, 3000, 12.3, 'water')
R(-1200, 116.7, 3000, 1.1, 'water2')
R(-1200, 126.4, 3000, 2.6, 'water2')
for x, w, color in [
    (177, 27, 'plum'), (213, 46, 'royal'), (273, 14, 'gold'),
    (302, 23, 'steel'), (352, 17, 'magenta'), (394, 15, 'plum'),
    (426, 22, 'orange'),
]:
    raw(
        f'<path fill="{C[color]}" opacity=".14" d="M{x} 117.8h{w}v2.4'
        f'h-{f(w * .18)}v2.2h-{f(w * .5)}v2.8h-{f(w * .32)}z"/>'
    )


def ripple_layer(cls, period, marks, color, height):
    group(cls)
    k0 = VIEW_X - period
    while k0 < VIEW_X + VIEW_W + period:
        for dx, y, w in marks:
            raw(
                f'<rect x="{f(k0 + dx)}" y="{f(y)}" width="{f(w)}" height="{f(height)}" '
                f'rx="{f(height / 2)}" fill="{color}"/>'
            )
        k0 += period


VIEW_X, VIEW_W = 14, 583
ripple_layer('river-flow river-flow--a', 96, [(6, 120.2, 18), (44, 123.6, 26), (76, 121.4, 10)], C['foam'], .9)
ripple_layer('river-flow river-flow--b', 64, [(18, 125.2, 12), (50, 119.2, 7)], '#ffffff', .6)
group('river-glints')
for x, y in [(60, 122.4), (172, 120.8), (268, 124.6), (352, 121.6), (446, 125), (528, 122)]:
    raw(f'<rect x="{f(x)}" y="{f(y)}" width="3" height=".7" rx=".35" fill="#ffffff"/>')

out = [
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VIEW_X} 14 {VIEW_W} 115" '
    'aria-hidden="true" focusable="false" shape-rendering="geometricPrecision">'
]
for cls, items in layers:
    body, run_c, run_d = [], None, []

    def flush():
        if run_d:
            body.append(f'<path fill="{run_c}" d="{"".join(run_d)}"/>')

    for kind, color, d in items:
        if kind == 'raw':
            flush()
            run_c, run_d = None, []
            body.append(d)
            continue
        if color != run_c:
            flush()
            run_c, run_d = color, []
        run_d.append(d)
    flush()
    if cls:
        out.append(f'<g class="{cls}">' + ''.join(body) + '</g>')
    else:
        out.append(''.join(body))
out.append('</svg>')
open(sys.argv[1], 'w').write('\n'.join(out) + '\n')
