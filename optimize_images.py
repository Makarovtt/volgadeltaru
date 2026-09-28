from PIL import Image
import os

d = r"D:\NextJS\volga-delta.ru\images\new"
total_before = total_after = 0

for f in sorted(os.listdir(d)):
    if not f.lower().endswith((".png", ".jpg", ".jpeg")):
        continue
    p = os.path.join(d, f)
    im = Image.open(p)
    has_alpha = im.mode in ("RGBA", "LA") or "transparency" in im.info
    im = im.convert("RGBA" if has_alpha else "RGB")
    if im.width > 1920:
        im = im.resize((1920, round(im.height * 1920 / im.width)), Image.LANCZOS)
    out = os.path.splitext(p)[0] + ".webp"
    im.save(out, "WEBP", quality=82, method=6)
    b, a = os.path.getsize(p), os.path.getsize(out)
    total_before += b
    total_after += a
    print(f"{f:36s} {b//1024:>6} KB -> {a//1024:>5} KB")

print(f"\nTOTAL {total_before//1024} KB -> {total_after//1024} KB")
