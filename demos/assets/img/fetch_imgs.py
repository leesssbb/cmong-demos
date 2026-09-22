"""Higgsfield 결과 PNG를 받아 각 데모 폴더 img/ 에 웹용 JPG로 저장 (긴 변 2000px, 품질 84)."""
import io, os, re, urllib.request
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__))
demos = os.path.abspath(os.path.join(here, '..', '..'))
jobs = {}
for line in open(os.path.join(here, 'jobs.tsv'), encoding='utf-8'):
    if line.strip():
        jid, dest, _ = line.rstrip('\n').split('\t')
        jobs[jid] = dest
done = 0
for url in open(os.path.join(here, 'urls.txt'), encoding='utf-8'):
    url = url.strip()
    m = re.search(r'_([0-9a-f-]{36})\.png$', url)
    if not m or m.group(1) not in jobs:
        continue
    site, name = jobs[m.group(1)].split('/')
    out = os.path.join(demos, site, 'img', name)
    if os.path.exists(out):
        continue
    os.makedirs(os.path.dirname(out), exist_ok=True)
    data = urllib.request.urlopen(url, timeout=60).read()
    im = Image.open(io.BytesIO(data)).convert('RGB')
    im.thumbnail((2000, 2000))
    im.save(out, 'JPEG', quality=84, optimize=True, progressive=True)
    done += 1
    print(f'{site}/{name} {im.size[0]}x{im.size[1]} {os.path.getsize(out)//1024}KB')
print('saved', done)
