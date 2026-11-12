import os, json, shutil, re
from pathlib import Path
from PIL import Image

ROOT = Path('/Volumes/USB/Website_IAPI')
INBOX = ROOT/'photos-inbox'
ORIG = ROOT/'photos-originals'/'inbox-2026-11-11'
LIB = ROOT/'assets'/'images'/'library'
LIB.mkdir(parents=True, exist_ok=True)
ORIG.mkdir(parents=True, exist_ok=True)

# 1) ensure originals backup complete (copy missing)
for src in INBOX.rglob('*'):
    if not src.is_file(): continue
    rel = src.relative_to(INBOX)
    dst = ORIG/rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    if not dst.exists():
        try:
            shutil.copy2(src, dst)
        except Exception:
            pass

exts = {'.jpg','.jpeg','.png','.webp','.heic','.JPG','.JPEG','.PNG','.WEBP','.HEIC'}
files = [p for p in INBOX.rglob('*') if p.is_file() and p.suffix in exts and not p.name.startswith('._')]
files.sort()

def slug(s):
    s = s.lower()
    s = re.sub(r'[^a-z0-9]+','-', s)
    s = re.sub(r'-+','-', s).strip('-')
    return s or 'img'

def category_for(p):
    parts = [x.lower() for x in p.parts]
    name = p.name.lower()
    joined = ' '.join(parts)
    if 'baptism' in name or 'bautis' in name: return 'baptism'
    if 'damas' in joined or 'mujer' in joined: return 'women'
    if 'anivers' in joined: return 'events'
    if 'joven' in joined or 'youth' in joined: return 'youth'
    if 'nino' in joined or 'niño' in joined or 'kids' in joined: return 'kids'
    if 'alaban' in joined or 'worship' in joined or 'music' in joined: return 'worship'
    if 'pastor' in joined: return 'pastor'
    return 'events'

manifest = []
counts = {}
total_in = 0
total_out = 0
sizes_out = [480,800,1200,1600]

for idx, src in enumerate(files, 1):
    cat = category_for(src.relative_to(INBOX))
    out_dir = LIB/cat
    out_dir.mkdir(parents=True, exist_ok=True)
    base_name = slug(src.stem)
    folder_hint = slug(src.parent.name) if src.parent != INBOX else ''
    fname = f"{cat}-{idx:03d}-{base_name[:30]}"
    fname = slug(fname)
    try:
        img = Image.open(src)
        img = img.convert('RGB')
        w,h = img.size
        total_in += src.stat().st_size
        variants = {}
        for s in sizes_out:
            if w >= s:
                im = img.copy()
                im.thumbnail((s, int(s*h/w)), Image.LANCZOS)
                outp = out_dir/f"{fname}-{s}.webp"
                im.save(outp, 'WEBP', quality=78, method=6)
                variants[str(s)] = str(outp.relative_to(ROOT))
                total_out += outp.stat().st_size
        default_s = 1200 if w >= 1200 else max([s for s in sizes_out if s <= w] or [w])
        im = img.copy()
        im.thumbnail((default_s, int(default_s*h/w)), Image.LANCZOS)
        out_default = out_dir/f"{fname}.webp"
        im.save(out_default, 'WEBP', quality=78, method=6)
        out_jpg = out_dir/f"{fname}.jpg"
        im.save(out_jpg, 'JPEG', quality=82, optimize=True, progressive=True)
        total_out += out_default.stat().st_size + out_jpg.stat().st_size
        alt_es = {
            'baptism': 'Bautismo en la iglesia IAPI',
            'women': 'Hermanas de la iglesia en un evento de damas',
            'events': 'Evento y congregación de la iglesia IAPI',
            'youth': 'Jóvenes de la iglesia IAPI',
            'kids': 'Niños en actividad de la iglesia IAPI',
            'worship': 'Tiempo de alabanza en la iglesia IAPI',
            'pastor': 'Pastor y congregación en IAPI'
        }.get(cat, 'Foto de la iglesia IAPI')
        alt_en = {
            'baptism': 'Baptism at IAPI church',
            'women': 'Women from the church at a women’s event',
            'events': 'Church event and congregation at IAPI',
            'youth': 'Youth at IAPI church',
            'kids': 'Children at an IAPI church activity',
            'worship': 'Worship time at IAPI church',
            'pastor': 'Pastor and congregation at IAPI'
        }.get(cat, 'Photo from IAPI church')
        manifest.append({
            'id': fname, 'category': cat, 'source': str(src.relative_to(ROOT)),
            'optimized': str(out_default.relative_to(ROOT)), 'fallbackJpg': str(out_jpg.relative_to(ROOT)),
            'variants': variants, 'width': w, 'height': h,
            'alt_es': alt_es, 'alt_en': alt_en, 'approved': True, 'published': False
        })
        counts[cat] = counts.get(cat,0)+1
    except Exception as e:
        manifest.append({'id': fname, 'category': cat, 'source': str(src.relative_to(ROOT)), 'error': str(e), 'approved': True, 'published': False})

(ROOT/'content').mkdir(exist_ok=True)
with open(ROOT/'content'/'photos.json','w',encoding='utf-8') as f:
    json.dump({'generated':'2026-11-11','approvedAllByUser':True,'counts':counts,'total':len(manifest),'photos':manifest}, f, ensure_ascii=False, indent=2)

print(json.dumps({'total_photos':len(manifest),'counts':counts,'input_bytes':total_in,'output_bytes':total_out,'library':str(LIB)}, ensure_ascii=False))
