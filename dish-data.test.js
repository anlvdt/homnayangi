/**
 * Kiểm tra tính toàn vẹn của dữ liệu món ăn.
 *
 * Trước đây tên món, ảnh, vùng miền và món ăn kèm nằm ở bốn mảng riêng và
 * ghép với nhau bằng chỉ số — sửa lệch một chỗ là "Bò kho" hiện ảnh cá kho tộ.
 * Giờ tất cả nằm chung một bản ghi, và bộ test này khoá lại điều đó.
 */

const fs = require('fs');
const path = require('path');
const {
  DISH_DB, SUITS, VALUES, DISH_META, REGION_NAMES, TOTAL_DISHES, DECK_SIZE,
  CITY_DISHES, SIDE_DISHES, DISH_FAMILIES, drawBalanced
} = require('./app.js');

const MEAL_KEYS = ['sang', 'trua', 'chieu', 'toi', 'khuya'];
const allDishes = SUITS.flatMap(suit => DISH_DB[suit]);

describe('Kho món', () => {
  test('mỗi nhóm đủ ít nhất 13 món để chia trọn một chất', () => {
    for (const suit of SUITS) {
      expect(DISH_DB[suit].length).toBeGreaterThanOrEqual(VALUES.length);
    }
  });

  test('kho lớn hơn số lá mỗi ván, nên chia lại là ra bộ khác', () => {
    expect(TOTAL_DISHES).toBeGreaterThan(DECK_SIZE);
    expect(allDishes).toHaveLength(TOTAL_DISHES);
  });

  test('tên món không trùng nhau', () => {
    const names = allDishes.map(d => d.name);
    expect(new Set(names).size).toBe(names.length);
  });

  test('mọi danh sách thành phố chỉ tham chiếu món có trong kho', () => {
    const names = new Set(allDishes.map(d => d.name));
    for (const [city, dishes] of Object.entries(CITY_DISHES)) {
      expect(dishes.size).toBeGreaterThanOrEqual(6);
      for (const dish of dishes) {
        expect(names.has(dish)).toBe(true);
      }
    }
  });

  test('vai trò món phụ và họ món chỉ tham chiếu món có trong kho', () => {
    const names = new Set(allDishes.map(d => d.name));
    for (const dish of SIDE_DISHES) expect(names.has(dish)).toBe(true);
    for (const dish of Object.keys(DISH_FAMILIES)) expect(names.has(dish)).toBe(true);
  });

  test('service worker chỉ dọn cache thuộc namespace ứng dụng', () => {
    const source = fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8');
    expect(source).toContain("name.startsWith('homnayangi-') && name !== CACHE_NAME");
    expect(source).not.toMatch(/filter\(name\s*=>\s*name\s*!==\s*CACHE_NAME\)/);
  });

  test('mỗi ảnh chỉ dùng cho một món và ảnh đó có thật', () => {
    const seen = new Set();
    for (const dish of allDishes.filter(d => d.img)) {
      expect(fs.existsSync(path.join(__dirname, 'images', dish.img))).toBe(true);
      expect(seen.has(dish.img)).toBe(false);
      seen.add(dish.img);
    }
  });

  test('mọi ảnh Wikimedia bổ sung đều có bản ghi nguồn và giấy phép', () => {
    const manifest = JSON.parse(fs.readFileSync(
      path.join(__dirname, 'images', 'commons-food-sources.json'),
      'utf8'
    ));
    const byFile = new Map(manifest.map(item => [item.file, item]));

    for (const dish of allDishes.filter(d => d.img?.startsWith('photo_'))) {
      const source = byFile.get(dish.img);
      expect(source).toMatchObject({ dish: dish.name, file: dish.img });
      expect(source.source).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(source.author.trim()).not.toBe('');
      expect(source.license.trim()).not.toBe('');
    }
  });

  test('món chưa có ảnh đúng không bị gán ảnh món khác hoặc ảnh đồ họa', () => {
    expect(allDishes).toHaveLength(153);
    expect(allDishes.filter(d => !d.hasPhoto)).toHaveLength(21);
    for (const dish of allDishes) {
      expect(dish.hasPhoto).toBe(Boolean(dish.img));
      expect(dish.imageUrl).toBeTruthy();
    }
  });

  test('ảnh sai được cách ly và ba món địa phương mới có nguồn đúng', () => {
    for (const name of ['Xôi lạc', 'Phở cuốn', 'Cơm âm phủ', 'Chân gà sả tắc', 'Miến lươn', 'Cơm cháy Ninh Bình']) {
      expect(DISH_META[name].imageStatus).toBe('illustrated');
    }
    for (const name of ['Bánh bao bánh vạc', 'Bột chiên', 'Bánh tráng cuốn thịt heo']) {
      expect(DISH_META[name].imageStatus).toBe('sourced');
    }
  });

  test('tên tệp ảnh khớp với tên món', () => {
    // Ảnh "bun_mam_...webp" từng bị gán cho "Cao lầu"; so khớp lỏng theo
    // từ đầu tiên của tên món để bắt lại kiểu lệch đó.
    const slug = name => name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/gi, 'd')
      .toLowerCase()
      .split(/\s+/);

    for (const dish of allDishes.filter(d => d.img)) {
      const words = slug(dish.name);
      const file = dish.img.toLowerCase();
      const hits = words.filter(w => file.includes(w)).length;
      const requiredHits = Math.min(2, words.length);
      // Thông điệp lỗi kèm tên món để biết ngay chỗ nào lệch
      expect(`${dish.name} → ${dish.img} (khớp ${hits} từ)`).toBe(
        hits >= requiredHits ? `${dish.name} → ${dish.img} (khớp ${hits} từ)` : 'ảnh không khớp tên món'
      );
    }
  });

  test('vùng miền là một mã hợp lệ', () => {
    for (const dish of allDishes) {
      expect(Object.keys(REGION_NAMES)).toContain(dish.region);
    }
  });

  test('mỗi món có ít nhất một buổi ăn hợp lệ', () => {
    for (const dish of allDishes) {
      expect(dish.meals.length).toBeGreaterThan(0);
      for (const meal of dish.meals) {
        expect(MEAL_KEYS).toContain(meal);
      }
    }
  });

  test('khoảng giá là cặp số tăng dần, hợp lý', () => {
    for (const dish of allDishes) {
      const [lo, hi] = dish.price;
      expect(Number.isFinite(lo)).toBe(true);
      expect(hi).toBeGreaterThanOrEqual(lo);
      expect(lo).toBeGreaterThan(0);
      expect(hi).toBeLessThanOrEqual(500);
    }
  });

  test('gợi ý ăn kèm không rỗng và không lặp lại chính tên món', () => {
    for (const dish of allDishes) {
      expect(dish.pair.trim().length).toBeGreaterThan(0);
      expect(dish.pair.toLowerCase()).not.toContain(dish.name.toLowerCase());
    }
  });

  test('cả ba miền đều có mặt trong mỗi nhóm món', () => {
    for (const suit of SUITS) {
      const regions = new Set(DISH_DB[suit].map(d => d.region));
      for (const r of ['B', 'T', 'N']) {
        expect(regions).toContain(r);
      }
    }
  });

  test('DISH_META tra cứu được mọi món', () => {
    for (const dish of allDishes) {
      expect(DISH_META[dish.name]).toMatchObject({ region: dish.region });
    }
  });
});

describe('bestDeckFit — xếp bài lấp vừa khung', () => {
  const { bestDeckFit } = require('./app.js');
  const AR = 5 / 7;

  const fits = (n, W, H, gap, r) => {
    const rows = Math.ceil(n / r.cols);
    const w = r.cols * r.cardW + (r.cols - 1) * gap;
    const h = rows * (r.cardW / AR) + (rows - 1) * gap;
    return { w, h };
  };

  test('52 lá lấp vừa khung rộng mà không tràn', () => {
    const r = bestDeckFit(52, 1000, 700, 10, 44, 150);
    const { w, h } = fits(52, 1000, 700, 10, r);
    expect(w).toBeLessThanOrEqual(1000 + 0.5);
    expect(h).toBeLessThanOrEqual(700 + 0.5);
    expect(r.cardW).toBeGreaterThan(44);
  });

  test('khung rất dẹt vẫn không vượt chiều cao', () => {
    const r = bestDeckFit(52, 1600, 260, 8, 30, 150);
    const { h } = fits(52, 1600, 260, 8, r);
    expect(h).toBeLessThanOrEqual(260 + 0.5);
  });

  test('khung quá nhỏ thì rơi về cỡ tối thiểu và chỉ tràn theo chiều dọc', () => {
    const W = 360, gap = 6, min = 40;
    const r = bestDeckFit(52, W, 300, gap, min, 150);
    expect(r.cardW).toBeGreaterThanOrEqual(min);
    expect(r.cols * r.cardW + (r.cols - 1) * gap).toBeLessThanOrEqual(W + 0.5);
  });

  test('không bao giờ vượt trần cỡ lá bài', () => {
    const r = bestDeckFit(4, 4000, 3000, 10, 44, 150);
    expect(r.cardW).toBeLessThanOrEqual(150);
  });

  test('một lá duy nhất vẫn hợp lệ', () => {
    const r = bestDeckFit(1, 800, 600, 10, 44, 150);
    expect(r.cols).toBe(1);
    expect(r.cardW).toBeGreaterThan(0);
  });
});

describe('drawBalanced — chia bài cân giữa các nhóm', () => {
  const pool = n => Array.from({ length: n }, (_, i) => i);

  test('lấy đúng số lá yêu cầu khi kho dư dả', () => {
    expect(drawBalanced([pool(30), pool(30), pool(30), pool(30)], 52)).toHaveLength(52);
  });

  test('chênh lệch giữa các nhóm không quá một lá', () => {
    const pools = [pool(30).map(i => 'a' + i), pool(30).map(i => 'b' + i),
                   pool(30).map(i => 'c' + i), pool(30).map(i => 'd' + i)];
    const picked = drawBalanced(pools, 52);
    const counts = ['a', 'b', 'c', 'd'].map(p => picked.filter(x => x.startsWith(p)).length);
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
  });

  test('kho cạn thì trả về tất cả những gì có, không lặp lại', () => {
    const picked = drawBalanced([pool(3), pool(2)], 52);
    expect(picked).toHaveLength(5);
  });

  test('nhóm rỗng không làm kẹt vòng lặp', () => {
    expect(drawBalanced([[], []], 10)).toEqual([]);
  });
});
