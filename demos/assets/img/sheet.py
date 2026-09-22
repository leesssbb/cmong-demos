"""데모 이미지 모아보기 JPG 생성 (Read 도구로 확인용)."""
import glob, os, sys
from PIL import Image, ImageDraw
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
files = sorted(glob.glob(os.path.join(root, '*', 'img', '*.jpg')))
cols, cw, ch = 7, 300, 240
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * cw, rows * ch), '#222')
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f); im.thumbnail((cw - 4, ch - 4))
    x, y = (i % cols) * cw, (i // cols) * ch
    sheet.paste(im, (x + 2, y + 2))
    d.rectangle([x, y, x + 150, y + 14], fill='black')
    d.text((x + 3, y + 1), os.path.relpath(f, root).replace(os.sep, '/').replace('/img/', '/'), fill='yellow')
out = os.path.join(os.path.dirname(__file__), 'sheet.jpg')
sheet.save(out, quality=80); print(out, len(files))
