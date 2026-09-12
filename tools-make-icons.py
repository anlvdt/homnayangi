"""
Dựng bộ icon PWA từ logo trong app (tô cơm + đũa + hơi bốc, nền gạch nung).

Icon cũ là một logo hoàn toàn khác: nền gradient TÍM, lá bài trắng, dao và
nĩa bắt chéo, trái tim đỏ — không trùng màu nào của app và dùng bộ đồ ăn
phương Tây. Ngoài ra cả hai tệp 192/512 thực ra là cùng một ảnh 1024px.

    python3 tools-make-icons.py
"""
from PIL import Image, ImageDraw

EARTH_1 = (200, 98, 58)    # gạch nung sáng  (#c8623a)
EARTH_2 = (143, 63, 34)    # gạch nung đậm   (#8f3f22)
CREAM   = (247, 236, 213)  # giấy dó         (#f7ecd5)
CREAM_2 = (255, 246, 230)
GOLD    = (242, 193, 78)   # vàng nghệ       (#f2c14e)
FOOT    = (234, 221, 191)


def draw_logo(size, inset=0.0, rounded=True):
    """inset: chừa mép an toàn cho icon maskable (0.10 = thu nội dung còn 80%)."""
    S = size * 4  # vẽ lớn rồi thu nhỏ để khử răng cưa
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    # nền gạch nung, chuyển màu chéo
    bg = Image.new('RGB', (S, S), EARTH_1)
    bd = ImageDraw.Draw(bg)
    for i in range(S):
        t = i / max(S - 1, 1)
        bd.line([(0, i), (S, i)],
                fill=tuple(round(EARTH_1[c] + (EARTH_2[c] - EARTH_1[c]) * t) for c in range(3)))
    mask = Image.new('L', (S, S), 0)
    md = ImageDraw.Draw(mask)
    if rounded:
        md.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.22), fill=255)
    else:
        md.rectangle([0, 0, S - 1, S - 1], fill=255)
    im.paste(bg, (0, 0), mask)

    # hệ toạ độ nội dung: 48x48 như logo SVG trong header
    pad = S * inset
    span = S - 2 * pad
    u = lambda v: pad + span * (v / 48.0)
    w = lambda v: span * (v / 48.0)

    # Hai làn hơi song song cùng uốn theo chữ S. Nếu lật ngược một làn như
    # bản trước, cả cặp ghép lại vẫn đọc thành hai dấu ngoặc đối nhau.
    import math
    for x0 in (20, 27):
        pts = []
        for k in range(33):
            t = k / 32
            y = 12.5 - 8.5 * t
            x = x0 - 1.7 * math.sin(t * 2 * math.pi)
            pts.append((u(x), u(y)))
        d.line(pts, fill=CREAM + (215,), width=max(2, int(w(1.7))), joint='curve')

    # đôi đũa gác chéo miệng tô
    for a, b in (((33, 10), (21, 26)), ((37, 13), (25, 27))):
        d.line([(u(a[0]), u(a[1])), (u(b[0]), u(b[1]))],
               fill=GOLD, width=max(2, int(w(2.4))))

    # thân tô (nửa dưới hình tròn)
    d.pieslice([u(11), u(11), u(37), u(37)], 0, 180, fill=CREAM)
    # miệng tô
    d.ellipse([u(11), u(21.4), u(37), u(26.6)], fill=CREAM_2)
    # chân đế
    d.polygon([(u(20), u(37)), (u(28), u(37)), (u(26.6), u(40)), (u(21.4), u(40))], fill=FOOT)

    return im.resize((size, size), Image.LANCZOS)


if __name__ == '__main__':
    import os
    os.makedirs('icons', exist_ok=True)
    for n in (192, 512):
        draw_logo(n).save(f'icons/icon-{n}.png', optimize=True)
        print(f'icons/icon-{n}.png  {n}x{n}')
    # bản maskable: nền tràn viền, nội dung nằm gọn trong 80% giữa
    for n in (192, 512):
        draw_logo(n, inset=0.11, rounded=False).save(f'icons/icon-maskable-{n}.png', optimize=True)
        print(f'icons/icon-maskable-{n}.png  {n}x{n}')
