"""
Đồng bộ ảnh món ăn về một phong cách: "nắng chiều sân quê".

Mỗi ảnh được kéo về cùng một điểm neo (độ sáng, độ tương phản, độ bão hoà,
cân bằng trắng ấm) rồi phủ chung một lớp grade. Chuẩn hoá là MỘT PHẦN
(hệ số blend < 1) để ảnh vẫn giữ cá tính riêng, không bị bệt thành một màu.
"""
import numpy as np, glob, os, sys
from PIL import Image

# ---- Điểm neo chung của cả bộ ----
T_LUM   = 0.400   # độ sáng trung bình mục tiêu
T_STD   = 0.258   # độ tương phản mục tiêu
T_SAT   = 0.560   # độ bão hoà mục tiêu
T_RATIO = np.array([1.055, 1.000, 0.905])  # tỉ lệ R:G:B của một xám "ấm"

A_WB    = 0.80   # mức kéo cân bằng trắng
A_EXP   = 0.75   # mức kéo độ sáng
A_CON   = 0.70   # mức kéo tương phản
A_SAT   = 0.70   # mức kéo bão hoà

LUMW = np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)

def lum(a):
    return a @ LUMW

def analyse(a):
    l = lum(a)
    mx, mn = a.max(2), a.min(2)
    sat = np.where(mx > 1e-6, (mx - mn) / np.maximum(mx, 1e-6), 0.0)
    return float(l.mean()), float(l.std()), float(sat.mean())

def grade(a):
    # --- 1. Cân bằng trắng: kéo tỉ lệ kênh về một xám ấm chung ---
    m = a.reshape(-1, 3).mean(0)
    overall = m.mean()
    cur = m / max(overall, 1e-6)
    gain = (T_RATIO / np.maximum(cur, 1e-6)) ** A_WB
    a = np.clip(a * gain, 0, 1)

    # --- 2. Độ sáng + tương phản: phép affine trên từng kênh (levels) ---
    L, S, _ = analyse(a)
    k = 1.0 + A_CON * (T_STD / max(S, 1e-6) - 1.0)
    k = float(np.clip(k, 0.80, 1.30))
    t = L + A_EXP * (T_LUM - L)
    a = np.clip((a - L) * k + t, 0, 1)

    # --- 3. Bão hoà: kéo về mức chung, giữ nguyên sắc độ ---
    _, _, sat = analyse(a)
    f = 1.0 + A_SAT * (T_SAT / max(sat, 1e-6) - 1.0)
    f = float(np.clip(f, 0.75, 1.30))
    g = lum(a)[..., None]
    a = np.clip(g + (a - g) * f, 0, 1)

    # --- 4. Lớp grade chung: đường cong chữ S nhẹ + ám ấm vùng tối,
    #        vùng sáng ngả kem — cùng tông giấy dó của mặt bài ---
    a = np.clip(a + 0.21 * (a - 0.5) * (1.0 - np.abs(2.0 * a - 1.0)), 0, 1)
    sh = np.clip(1.0 - a, 0, 1) ** 3          # trọng số vùng tối (gọn hơn)
    hi = np.clip(a, 0, 1) ** 2                 # trọng số vùng sáng
    a += sh * np.array([0.026, 0.008, -0.016], dtype=np.float32)
    a += hi * np.array([0.014, 0.007, -0.011], dtype=np.float32)
    # Ghì lại điểm đen: ám ấm vùng tối làm ảnh hơi mờ sương nếu để nguyên
    a = np.clip((a - 0.012) / (1.0 - 0.012), 0, 1)
    return np.clip(a, 0, 1)

def load(p):
    return np.asarray(Image.open(p).convert('RGB'), dtype=np.float32) / 255.0

def save(a, p, q=82):
    Image.fromarray((a * 255.0 + 0.5).astype(np.uint8)).save(p, 'WEBP', quality=q, method=6)

if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    os.makedirs(dst, exist_ok=True)
    rows = []
    for f in sorted(glob.glob(os.path.join(src, '*.webp'))):
        a = load(f)
        b = grade(a)
        save(b, os.path.join(dst, os.path.basename(f)))
        rows.append((os.path.basename(f),) + analyse(a) + analyse(b))
    A = np.array([[r[1], r[2], r[3]] for r in rows])
    B = np.array([[r[4], r[5], r[6]] for r in rows])
    print(f'{len(rows)} ảnh')
    for i, name in enumerate(['sáng', 'tương phản', 'bão hoà']):
        print(f'{name:11s} trước: sd={A[:,i].std():.4f} [{A[:,i].min():.3f}–{A[:,i].max():.3f}]'
              f'   sau: sd={B[:,i].std():.4f} [{B[:,i].min():.3f}–{B[:,i].max():.3f}]')
