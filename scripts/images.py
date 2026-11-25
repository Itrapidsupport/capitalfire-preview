# Build public assets: AI scene photos (../gen/cand/<id>.png) -> public/img/<id>-<w>.{webp,avif} + src/data/images.json,
# portfolio renderings from capitalfireandsecurity.ca (../harvest/media) -> public/projects/*.webp + src/data/projects.json,
# membership logos -> public/brand.
import json, os, re, sys, glob
from PIL import Image

APP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
ROOT = os.path.join(APP, '..')
GEN = os.path.join(ROOT, 'gen', 'cand')
MEDIA = os.path.join(ROOT, 'harvest', 'media')
OUT = os.path.join(APP, 'public', 'img')
os.makedirs(OUT, exist_ok=True)

IDS = ['hero-tower', 'cctv', 'access', 'fire', 'intercom', 'smart', 'integrated', 'doors', 'service', 'construction', 'careers', 'lobby', 'elevator']
# 9K masters (../masters-9k/photos/<id>-9000.jpg: generated scenes, no text/logos -> Real-ESRGAN x4 + Lanczos to 9000px).
# Served: WebP + AVIF at 640..5120w (no width above the master). Fallback to the 1920 source if a master is missing.
M9 = os.path.join(ROOT, 'masters-9k', 'photos')
WS = [640, 1024, 1600, 2400, 3200, 5120]
Image.MAX_IMAGE_PIXELS = None
man = {}
only = set(sys.argv[1:])
old = json.load(open(os.path.join(APP, 'src', 'data', 'images.json'))) if only else {}
for k in IDS:
    if only and k not in only:
        man[k] = old[k]; continue
    src = os.path.join(M9, k + '-9000.jpg')
    if not os.path.exists(src):
        src = os.path.join(GEN, k + '.png'); print('no 9K master yet for', k)
    im = Image.open(src).convert('RGB')
    ws = [w for w in WS if w <= im.width]
    for f in glob.glob(os.path.join(OUT, f'{k}-*.*')): os.remove(f)
    for w in ws:
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(os.path.join(OUT, f'{k}-{w}.webp'), 'WEBP', quality=80 if w <= 2400 else 74, method=5)
        r.save(os.path.join(OUT, f'{k}-{w}.avif'), 'AVIF', quality=56 if w <= 2400 else 50, speed=8)
    man[k] = {'w': ws[-1], 'h': round(im.height * ws[-1] / im.width), 'ws': ws}
    print('img', k, ws[-1], flush=True)
json.dump(man, open(os.path.join(APP, 'src', 'data', 'images.json'), 'w'), indent=1)


# portfolio (their own page; obvious typos fixed, flagged in AUDIT.md)
P = json.load(open(os.path.join(ROOT, 'harvest', 'projects.json')))
FIX = {'Oragami Lofts': 'Origami Lofts', 'Regent Park Blcok 22 & 24': 'Regent Park Block 22 & 24', 'One Fores tHill': 'One Forest Hill', 'North Drvie (Project of the Year)': 'North Drive Developments', '4The Kingsway': '4 The Kingsway'}
PO = os.path.join(APP, 'public', 'projects'); os.makedirs(PO, exist_ok=True)
out = []
for name in P['portfolio']:
    url = P['images'][name]
    fn = url.split('/uploads/')[-1].replace('/', '_')
    proj, dev = [x.strip() for x in name.split(' - ', 1)]
    proj, dev = FIX.get(proj, proj), FIX.get(dev, dev)
    im = Image.open(os.path.join(MEDIA, fn)).convert('RGBA')
    bg = Image.new('RGBA', im.size, (15, 33, 54, 255)); bg.alpha_composite(im); im = bg.convert('RGB')
    if im.width > 720: im = im.resize((720, round(im.height * 720 / im.width)), Image.LANCZOS)
    slug = re.sub(r'[^a-z0-9]+', '-', proj.lower()).strip('-')
    im.save(os.path.join(PO, slug + '.webp'), 'WEBP', quality=80, method=6)
    out.append({'name': proj, 'dev': dev, 'img': slug + '.webp', 'w': im.width, 'h': im.height})
json.dump(out, open(os.path.join(APP, 'src', 'data', 'projects.json'), 'w'), indent=1)

B = os.path.join(APP, 'public', 'brand')
for src, dst in [('2022_08_ulc-symbol-1.png', 'ulc.png'), ('2022_03_canasa.png', 'canasa.png'), ('2022_03_esa.png', 'esa.png'), ('2022_03_cfaa.jpg', 'cfaa.png')]:
    Image.open(os.path.join(MEDIA, src)).convert('RGBA').save(os.path.join(B, dst), optimize=True)
print(len(man), 'photos,', len(out), 'projects')
