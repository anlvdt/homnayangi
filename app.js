// Homnayangi - Food Card Game
// With dramatic suspense effects and sounds

// ========================================
// DATA
// ========================================
const SUITS = ['♥', '♦', '♣', '♠'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const EMOJIS = { '♥': '', '♦': '', '♣': '', '♠': '' };

const DISHES = {
  '♥': ['Phở bò', 'Phở gà', 'Bún bò Huế', 'Bún chả', 'Bún riêu', 'Bún đậu', 'Bún thịt nướng', 'Hủ tiếu', 'Mì Quảng', 'Bún cá', 'Cao lầu', 'Miến gà', 'Phở xào'],
  '♦': ['Cơm tấm', 'Cơm sườn', 'Cơm gà', 'Cơm rang', 'Cơm chiên', 'Cơm cá kho', 'Cơm thịt kho', 'Cơm trứng', 'Cơm canh', 'Cơm hến', 'Cơm niêu', 'Cơm lam', 'Cơm cháy'],
  '♣': ['Bánh mì', 'Bánh cuốn', 'Bánh xèo', 'Bánh canh', 'Xôi xéo', 'Bánh bèo', 'Bánh khọt', 'Bánh bột lọc', 'Bánh giò', 'Xôi gà', 'Bánh tráng', 'Bánh ướt', 'Xôi mặn'],
  '♠': ['Gỏi cuốn', 'Chả giò', 'Nem nướng', 'Bò lá lốt', 'Lẩu thái', 'Cháo', 'Gà nướng', 'Hải sản', 'BBQ', 'Ốc', 'Lẩu gà', 'Vịt quay', 'Bò kho']
};

// Region data: B = Bắc, T = Trung, N = Nam, A = All (phổ biến cả nước)
const REGIONS = {
  '♥': ['B', 'B', 'T', 'B', 'B', 'B', 'N', 'N', 'T', 'T', 'T', 'B', 'A'],
  '♦': ['N', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'T', 'N', 'T', 'B'],
  '♣': ['A', 'B', 'N', 'T', 'B', 'T', 'N', 'T', 'B', 'A', 'N', 'T', 'B'],
  '♠': ['N', 'N', 'T', 'N', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'B', 'A']
};

const REGION_NAMES = {
  'A': 'Cả nước',
  'B': 'Miền Bắc',
  'T': 'Miền Trung', 
  'N': 'Miền Nam'
};

// Side dish / pairing suggestions
const PAIRINGS = {
  '♥': ['Quẩy, giá đỗ', 'Hành lá, tiêu', 'Rau sống, mắm ruốc', 'Bún, rau thơm', 'Rau muống, đậu phụ', 'Mắm tôm, rau kinh giới', 'Nước mắm, đồ chua', 'Giá, hẹ', 'Bánh tráng, đậu phộng', 'Rau sống, bún', 'Rau sống, bánh đa', 'Hành phi, tiêu', 'Rau cải, giá'],
  '♦': ['Bì, chả, trứng', 'Dưa chua, canh', 'Rau luộc, nước mắm', 'Dưa leo, cà chua', 'Xá xíu, trứng', 'Canh chua, rau', 'Trứng kho, dưa góp', 'Canh, rau xào', 'Rau luộc, đậu', 'Rau thơm, nước mắm', 'Thịt kho, trứng', 'Thịt gà, muối', 'Tóp mỡ, hành'],
  '♣': ['Chả lụa, pate', 'Nước mắm, hành phi', 'Rau sống, nước mắm', 'Chả cá, tiêu', 'Hành phi, đậu xanh', 'Nước mắm, hành', 'Nước mắm ớt', 'Nước mắm, tôm khô', 'Nước mắm, hành', 'Muối tiêu, rau răm', 'Mỡ hành, đậu', 'Chả lụa, dưa leo', 'Ruốc, hành phi'],
  '♠': ['Nước mắm, tỏi ớt', 'Nước mắm, rau thơm', 'Nước chấm đặc biệt', 'Mỡ hành, đậu', 'Rau sống, bún', 'Hành, gừng, quẩy', 'Muối ớt, rau răm', 'Mù tạt, chanh', 'Nước sốt, rau', 'Me, sả, ớt', 'Mì, rau sống', 'Bánh hỏi, mắm', 'Bánh mì, rau']
};

// Local image file paths
const IMAGES = {
  '♥': [
    'images/pho_bo_1769851159194.webp',
    'images/pho_ga.webp',
    'images/bun_bo_hue_1769851174568.webp',
    'images/bun_cha_1769851878488.webp',
    'images/bun_rieu_1769851188904.webp',
    'images/bun_dau_mam_tom_1769851860469.webp',
    'images/bun_thit_nuong.webp',
    'images/hu_tieu_1769851204224.webp',
    'images/mi_quang_1769851314324.webp',
    'images/bun_ca_1769851333627.webp',
    'images/bun_mam_1769851373054.webp',
    'images/mien_ga_1769851220414.webp',
    'images/mi_xao.webp'
  ],
  '♦': [
    'images/com_tam_1769851390923.webp',
    'images/com_suon_1769851423572.webp',
    'images/com_ga_1769851406663.webp',
    'images/com_rang_dua_bo.webp',
    'images/com_chien_1769851438643.webp',
    'images/com_ca_kho_1769851495798.webp',
    'images/com_thit_kho_1769851603858.webp',
    'images/com_trung_chien.webp',
    'images/canh_chua.webp',
    'images/com_vit_1769851588657.webp',
    'images/com_nieu_1769851480399.webp',
    'images/com_ga_luoc.webp',
    'images/com_chay_1769851545278.webp'
  ],
  '♣': [
    'images/banh_mi_1769851625130.webp',
    'images/banh_cuon_1769851655972.webp',
    'images/banh_xeo.webp',
    'images/banh_canh_1769851264800.webp',
    'images/xoi_xeo.webp',
    'images/banh_beo_1769851730342.webp',
    'images/banh_khot_1769851670592.webp',
    'images/banh_bot_loc_1769851828366.webp',
    'images/banh_gio.webp',
    'images/xoi_ga.webp',
    'images/banh_trang_nuong_1769851778904.webp',
    'images/banh_uot_1769851715272.webp',
    'images/xoi_man.webp'
  ],
  '♠': [
    'images/goi_cuon_1769851929695.webp',
    'images/cha_gio_1769851944525.webp',
    'images/nem_nuong_1769851901613.webp',
    'images/nem_ran.webp',
    'images/lau_thai_1769851977079.webp',
    'images/chao_ga.webp',
    'images/ga_nuong_1769852050721.webp',
    'images/hai_san_1769852083065.webp',
    'images/bbq_nuong_1769852036308.webp',
    'images/oc_cac_loai_1769851960829.webp',
    'images/lau_bo_1769851992471.webp',
    'images/vit_quay_1769852066805.webp',
    'images/ca_kho_to.webp'
  ]
};

// ========================================
// FAMILY MEALS — mâm cơm gia đình theo vùng miền
// Traditional Vietnamese meal structure: canh + món mặn + rau + tráng miệng
// ========================================
const FAMILY_MEALS = {
  B: {
    name: 'Miền Bắc',
    soup: ['Canh cua rau đay', 'Canh mướp nhồi thịt', 'Canh bí nấu tôm', 'Canh mọc nấm', 'Canh cải nấu thịt băm', 'Canh bóng thả', 'Canh cá rô đồng', 'Canh riêu cua'],
    main: ['Thịt lợn luộc chấm mắm tôm', 'Thịt kho trứng', 'Gà luộc chấm muối tiêu', 'Cá kho tộ', 'Sườn xào chua ngọt', 'Nem rán', 'Đậu rán sốt cà chua', 'Thịt ba chỉ rang cháy cạnh', 'Cá rán sốt cà', 'Giả cầy'],
    veg: ['Rau muống luộc chấm mắm', 'Rau muống xào tỏi', 'Bông cải xào', 'Đậu que xào tỏi', 'Rau củ luộc kho quẹt', 'Cải thìa xào nấm', 'Su su xào trứng'],
    dessert: ['Trái cây theo mùa', 'Chè đậu xanh', 'Hoa quả dầm', 'Bánh flan', 'Chè khoai dẻo']
  },
  T: {
    name: 'Miền Trung',
    soup: ['Canh chua cá', 'Canh bí đao hầm', 'Canh rau tần ô', 'Canh khổ qua', 'Canh hến nấu chua', 'Canh bắp cải tôm khô'],
    main: ['Cá kho nghệ', 'Thịt heo quay', 'Mực nhồi thịt chiên', 'Tôm rim mặn ngọt', 'Cá nục kho thơm', 'Thịt kho mắm ruốc', 'Gà rang muối', 'Trứng chiên thịt', 'Cá thu chiên nước mắm'],
    veg: ['Rau muống xào tỏi', 'Rau sống chấm mắm nêm', 'Bí xanh xào tỏi', 'Cà tím kho', 'Đậu đũa xào tép', 'Rau lang luộc'],
    dessert: ['Mè xửng Huế', 'Trái cây', 'Bánh đậu xanh', 'Chè bắp']
  },
  N: {
    name: 'Miền Nam',
    soup: ['Canh chua cá lóc', 'Canh khổ qua nhồi thịt', 'Canh bí đỏ hầm', 'Canh rau ngót nấu thịt', 'Canh chua tôm', 'Canh cải bẹ xanh'],
    main: ['Thịt kho tàu', 'Cá lóc kho tộ', 'Sườn ram mặn', 'Cá điêu hồng chiên xù', 'Gà kho sả ớt', 'Bò lúc lắc', 'Tép kho tộ', 'Thịt ba chỉ kho nước dừa', 'Cá basa kho sả'],
    veg: ['Rau muống xào tỏi', 'Rau củ luộc kho quẹt', 'Đậu đũa xào', 'Cải xanh xào nấm', 'Bầu xào tôm', 'Rau muống luộc chấm mắm kho'],
    dessert: ['Chè thái', 'Trái cây nhiệt đới', 'Sương sáo', 'Chè ba màu', 'Bánh flan']
  }
};

// ========================================
// STATE
// ========================================
let deck = [];
let flippedCards = [];
let isMultiPlayer = false;
let currentPlayer = 1;
let totalPlayers = 2;
let playerNames = ['Người chơi 1', 'Người chơi 2'];
let isAnimating = false;
let audioContext = null;
let gameResults = []; // Track {player, dish, imageUrl} for multiplayer

// Favorites and Excludes
let favorites = []; // Array of dish names
let excludes = []; // Array of dish names

// Settings with localStorage persistence
let settings = {
  darkMode: false,
  soundEnabled: true,
  animSpeed: 'normal', // slow, normal, fast
  timeFilterEnabled: false
};

// Time-based filter
function getTimePeriod() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 15) return 'noon';
  if (hour >= 15 && hour < 22) return 'evening';
  return 'night';
}

function getTimeLabel(period) {
  const labels = {
    morning: 'Sáng',
    noon: 'Trưa',
    evening: 'Tối',
    night: 'Đêm'
  };
  return labels[period];
}

function getTimeSuits(period) {
  // Return suits to filter by time period
  return {
    morning: ['♥', '♣'], // Bún/Phở, Bánh/Xôi
    noon: ['♥', '♦', '♣', '♠'], // All
    evening: ['♦', '♠'], // Cơm, Món khác
    night: ['♣', '♠'] // Bánh nhẹ, Món khác
  }[period];
}

// Escape user-controlled strings before injecting into innerHTML
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

// Read persisted JSON safely — corrupted values fall back to null
// instead of throwing during init.
function loadStored(key, validate) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    const value = JSON.parse(raw);
    return validate && !validate(value) ? null : value;
  } catch {
    return null;
  }
}

function loadSettings() {
  const saved = loadStored('homnayangi_settings', v => v && typeof v === 'object' && !Array.isArray(v));
  if (saved) {
    settings = {
      darkMode: saved.darkMode === true,
      soundEnabled: saved.soundEnabled !== false,
      animSpeed: ['slow', 'normal', 'fast'].includes(saved.animSpeed) ? saved.animSpeed : 'normal',
      timeFilterEnabled: saved.timeFilterEnabled === true
    };
  }
  applySettings();
}

// Persist safely — storage can be full or blocked; surface it instead of crashing
let storageWarned = false;

function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    if (!storageWarned) {
      storageWarned = true;
      showToast('Không thể lưu dữ liệu. Lựa chọn chỉ giữ trong phiên này.');
    }
  }
}

function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.className = 'app-toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

function saveSettings() {
  persist('homnayangi_settings', settings);
}

function applySettings() {
  // Dark mode
  document.body.classList.toggle('dark-mode', settings.darkMode);
  document.getElementById('darkModeToggle').checked = settings.darkMode;

  // Sound
  document.getElementById('soundToggle').checked = settings.soundEnabled;

  // Time filter
  const timeFilterToggle = document.getElementById('timeFilterToggle');
  if (timeFilterToggle) {
    timeFilterToggle.checked = settings.timeFilterEnabled;
  }

  // Animation speed
  document.getElementById('animSpeedSelect').value = settings.animSpeed;
  document.documentElement.style.setProperty('--anim-speed',
    settings.animSpeed === 'slow' ? '1.5' : settings.animSpeed === 'fast' ? '0.6' : '1'
  );
}

// ========================================
// CUSTOM DISHES - User-defined dishes
// ========================================
let customDishes = [];

const MAX_CUSTOM_DISHES = 50;
const MAX_DISH_NAME = 60;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_RE = /[\x00-\x1f\x7f]/g;

function sanitizeDishName(name) {
  return String(name || '')
    .replace(CONTROL_CHARS_RE, '')
    .trim()
    .normalize('NFC')
    .slice(0, MAX_DISH_NAME);
}

function loadCustomDishes() {
  const saved = loadStored('homnayangi_custom_dishes', Array.isArray);
  if (saved) {
    const seen = new Set();
    customDishes = saved
      .filter(d => d && typeof d === 'object' && SUITS.includes(d.category))
      .map(d => ({ ...d, name: sanitizeDishName(d.name) }))
      .filter(d => {
        const key = d.name.toLowerCase();
        if (!d.name || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, MAX_CUSTOM_DISHES);
  }
}

function saveCustomDishes() {
  persist('homnayangi_custom_dishes', customDishes);
}

// ========================================
// FAVORITES & EXCLUDES
// ========================================
function loadFavorites() {
  const saved = loadStored('homnayangi_favorites', Array.isArray);
  if (saved) favorites = saved.filter(d => typeof d === 'string');
}

function saveFavorites() {
  persist('homnayangi_favorites', favorites);
}

function toggleFavorite(dishName) {
  if (favorites.includes(dishName)) {
    favorites = favorites.filter(d => d !== dishName);
  } else {
    favorites.push(dishName);
  }
  saveFavorites();
}

function isFavorite(dishName) {
  return favorites.includes(dishName);
}

function loadExcludes() {
  const saved = loadStored('homnayangi_excludes', Array.isArray);
  if (saved) excludes = saved.filter(d => typeof d === 'string');
}

function saveExcludes() {
  persist('homnayangi_excludes', excludes);
}

function toggleExclude(dishName) {
  if (excludes.includes(dishName)) {
    excludes = excludes.filter(d => d !== dishName);
  } else {
    excludes.push(dishName);
    // Remove from favorites if excluded
    if (favorites.includes(dishName)) {
      favorites = favorites.filter(d => d !== dishName);
      saveFavorites();
    }
  }
  saveExcludes();
}

function isExcluded(dishName) {
  return excludes.includes(dishName);
}

function openExcludesModal() {
  renderExcludesList();
  document.getElementById('excludesModal').classList.add('show');
}

function closeExcludesModal() {
  document.getElementById('excludesModal').classList.remove('show');
  // Refresh deck after changes
  createDeck();
  renderDeck(true);
}

function renderExcludesList() {
  const container = document.getElementById('excludesList');
  const allDishes = [];
  
  // Get all dishes
  for (const suit of SUITS) {
    DISHES[suit].forEach(dish => allDishes.push(dish));
  }
  
  container.innerHTML = allDishes.map(dish => `
    <div class="exclude-item ${isExcluded(dish) ? 'excluded' : ''}" data-dish="${dish}">
      <div class="exclude-checkbox">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <span class="exclude-name">${dish}</span>
    </div>
  `).join('');
  
  // Add click handlers
  container.querySelectorAll('.exclude-item').forEach(item => {
    item.addEventListener('click', () => {
      const dish = item.dataset.dish;
      toggleExclude(dish);
      item.classList.toggle('excluded', isExcluded(dish));
    });
  });
}

function addCustomDish(dish) {
  if (customDishes.length >= MAX_CUSTOM_DISHES) {
    showToast(`Tối đa ${MAX_CUSTOM_DISHES} món tự thêm. Hãy xóa bớt món cũ.`);
    return;
  }
  customDishes.push({
    id: Date.now(),
    name: sanitizeDishName(dish.name),
    pairing: dish.pairing,
    category: dish.category,
    imageUrl: dish.imageUrl || 'icons/icon-192.png'
  });
  saveCustomDishes();
  renderCustomDishesList();
}

function deleteCustomDish(id) {
  customDishes = customDishes.filter(d => d.id !== id);
  saveCustomDishes();
  renderCustomDishesList();
  // Refresh deck to remove deleted dish
  createDeck();
  renderDeck(true);
}

function renderCustomDishesList() {
  const container = document.getElementById('customDishesContent');
  if (!container) return;

  if (customDishes.length === 0) {
    container.innerHTML = '<p class="no-results">Chưa có món tùy chỉnh</p>';
    return;
  }

  container.innerHTML = customDishes.map(d => `
    <div class="custom-dish-item">
      <span class="dish-name">${escapeHtml(d.name)}</span>
      <button class="delete-btn" onclick="deleteCustomDish(${d.id})">Xóa</button>
    </div>
  `).join('');
}

// Food Challenge - Track unique dishes tried
function getUniqueDishCount() {
  const uniqueDishes = new Set(history.map(h => h.dish));
  return uniqueDishes.size;
}

function getChallengeLevel(count) {
  if (count >= 52) return 'platinum';
  if (count >= 40) return 'gold';
  if (count >= 25) return 'silver';
  if (count >= 10) return 'bronze';
  return '';
}

function updateChallengeBadge() {
  const count = getUniqueDishCount();
  const badge = document.getElementById('challengeBadge');
  const countEl = document.getElementById('triedCount');

  if (countEl) {
    countEl.textContent = count;
  }

  if (badge) {
    // Remove old level classes
    badge.classList.remove('level-bronze', 'level-silver', 'level-gold', 'level-platinum');

    const level = getChallengeLevel(count);
    if (level) {
      badge.classList.add('level-' + level);
    }
  }
}

function openCustomDishModal() {
  document.getElementById('customDishModal').classList.add('show');
  renderCustomDishesList();
}

function closeCustomDishModal() {
  document.getElementById('customDishModal').classList.remove('show');
  // Clear form
  document.getElementById('customDishName').value = '';
  document.getElementById('customDishPairing').value = '';
  document.getElementById('customDishImage').value = '';
}

function saveCustomDishFromForm() {
  const name = document.getElementById('customDishName').value.trim();
  const pairing = document.getElementById('customDishPairing').value.trim();
  const category = document.getElementById('customDishCategory').value;
  const imageUrl = document.getElementById('customDishImage').value.trim();

  if (!name) {
    alert('Vui lòng nhập tên món!');
    return;
  }

  addCustomDish({ name, pairing: pairing || 'Tùy thích', category, imageUrl });

  // Refresh deck to include new dish
  createDeck();
  renderDeck(true);

  closeCustomDishModal();
}

// ========================================
// WEEKLY PLANNER
// ========================================
const DAY_NAMES = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
let weekPlan = ['', '', '', '', '', '', ''];

function loadWeekPlan() {
  const saved = loadStored('homnayangi_week_plan', v => Array.isArray(v) && v.length === 7);
  if (saved) {
    weekPlan = saved.map(d => typeof d === 'string' ? d : '');
  }
}

function saveWeekPlan() {
  persist('homnayangi_week_plan', weekPlan);
}

function getAllDishes() {
  // Get all dishes from data
  const allDishes = [];
  for (const suit of SUITS) {
    DISHES[suit].forEach(dish => allDishes.push(dish));
  }
  customDishes.forEach(d => allDishes.push(d.name));
  return allDishes;
}

function renderWeekGrid() {
  const grid = document.getElementById('weekGrid');
  if (!grid) return;

  grid.innerHTML = DAY_NAMES.map((day, i) => `
    <div class="day-card">
      <span class="day-name">${day}</span>
      <span class="day-dish ${weekPlan[i] ? '' : 'empty'}">${escapeHtml(weekPlan[i]) || 'Chưa chọn'}</span>
      <div class="day-actions">
        <button class="day-btn random-btn" onclick="randomDayDish(${i})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="8" cy="8" r="1.5"/>
            <circle cx="16" cy="8" r="1.5"/>
            <circle cx="16" cy="16" r="1.5"/>
            <circle cx="8" cy="16" r="1.5"/>
          </svg>
        </button>
        <button class="day-btn clear-btn" onclick="clearDayDish(${i})">✕</button>
      </div>
    </div>
  `).join('');
}

function randomDayDish(dayIndex) {
  const allDishes = getAllDishes();
  // Avoid dishes already in plan
  const usedDishes = weekPlan.filter(d => d);
  const available = allDishes.filter(d => !usedDishes.includes(d));

  if (available.length > 0) {
    weekPlan[dayIndex] = available[Math.floor(Math.random() * available.length)];
  } else {
    weekPlan[dayIndex] = allDishes[Math.floor(Math.random() * allDishes.length)];
  }

  saveWeekPlan();
  renderWeekGrid();
}

function clearDayDish(dayIndex) {
  weekPlan[dayIndex] = '';
  saveWeekPlan();
  renderWeekGrid();
}

function autoFillWeek() {
  const allDishes = getAllDishes();
  const shuffled = [...allDishes].sort(() => Math.random() - 0.5);

  weekPlan = weekPlan.map((current, i) => {
    if (!current) {
      return shuffled[i % shuffled.length];
    }
    return current;
  });

  saveWeekPlan();
  renderWeekGrid();
}

function clearWeekPlan() {
  weekPlan = ['', '', '', '', '', '', ''];
  saveWeekPlan();
  renderWeekGrid();
}

function openPlanner() {
  loadWeekPlan();
  renderWeekGrid();
  document.getElementById('plannerModal').classList.add('show');
}

function closePlanner() {
  document.getElementById('plannerModal').classList.remove('show');
}

// ========================================
// HISTORY - Track dish selections
// ========================================
let history = [];

// Local counters — cumulative, never truncated like the 100-item history.
// Honest labeling like truanayangi: "on this browser", not a global total.
let totalSpins = 0;
let visitCount = 0;

function loadCounters() {
  const spins = loadStored('homnayangi_spins', v => Number.isSafeInteger(v) && v >= 0);
  const visits = loadStored('homnayangi_visits', v => Number.isSafeInteger(v) && v >= 0);
  totalSpins = spins || 0;
  visitCount = visits || 0;
}

function recordSpin() {
  totalSpins = Math.min(Number.MAX_SAFE_INTEGER, totalSpins + 1);
  persist('homnayangi_spins', totalSpins);
  updateSessionInfo();
}

function recordVisit() {
  visitCount = Math.min(Number.MAX_SAFE_INTEGER, visitCount + 1);
  persist('homnayangi_visits', visitCount);
}

function loadHistory() {
  const saved = loadStored('homnayangi_history', Array.isArray);
  if (saved) {
    history = saved.filter(h => h && typeof h.dish === 'string');
  }
}

function saveHistory() {
  // Keep only last 100 items
  if (history.length > 100) {
    history = history.slice(-100);
  }
  persist('homnayangi_history', history);
}

function addToHistory(card) {
  history.push({
    dish: card.dish,
    pairing: card.pairing,
    imageUrl: card.imageUrl,
    date: new Date().toISOString()
  });
  saveHistory();
  recordSpin();
  updateHistoryPanel();
  updateChallengeBadge();
  updateSessionInfo();
}

function getStats() {
  const dishCount = {};
  history.forEach(h => {
    dishCount[h.dish] = (dishCount[h.dish] || 0) + 1;
  });

  return Object.entries(dishCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([dish, count]) => ({ dish, count }));
}

function updateHistoryPanel() {
  const list = document.getElementById('historyList');
  if (!list) return;

  if (history.length === 0) {
    list.innerHTML = '<p class="no-results">Chưa có lịch sử</p>';
    return;
  }

  // Show last 10 items, newest first
  const recent = [...history].reverse().slice(0, 10);
  list.innerHTML = recent.map(h => {
    const date = new Date(h.date);
    const timeStr = date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' });
    return `
      <div class="history-item">
        <img src="${escapeHtml(h.imageUrl)}" alt="${escapeHtml(h.dish)}" class="history-thumb" loading="lazy" decoding="async" onerror="this.style.display='none'">
        <div class="history-info">
          <span class="history-dish">${escapeHtml(h.dish)}</span>
          <span class="history-date">${timeStr}</span>
        </div>
      </div>
    `;
  }).join('');
}

function updateStatsPanel() {
  const statsEl = document.getElementById('statsContent');
  if (!statsEl) return;

  const stats = getStats();
  if (stats.length === 0) {
    statsEl.innerHTML = '<p class="no-results">Chưa có thống kê</p>';
    return;
  }

  statsEl.innerHTML = stats.map((s, i) => `
    <div class="stat-item">
      <span class="stat-rank">#${i + 1}</span>
      <span class="stat-dish">${escapeHtml(s.dish)}</span>
      <span class="stat-count">${s.count} lần</span>
    </div>
  `).join('');
}

// ========================================
// AUDIO - Web Audio API for suspense sounds
// ========================================
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

// Short synthesized tick — played when a reel tile crosses the pointer
function playTick() {
  if (!settings.soundEnabled) return;
  if (!audioContext) initAudio();
  if (audioContext.state !== 'running') return;

  const t = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(2200, t);

  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0.08, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start(t);
  osc.stop(t + 0.03);
}

function playDrumroll(duration = 1500) {
  if (!settings.soundEnabled) return;
  if (!audioContext) initAudio();

  const startTime = audioContext.currentTime;
  const endTime = startTime + duration / 1000;

  // Create noise for drumroll texture
  const bufferSize = audioContext.sampleRate * (duration / 1000);
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  // Generate rhythmic drumroll pattern
  for (let i = 0; i < bufferSize; i++) {
    const t = i / audioContext.sampleRate;
    const frequency = 8 + (t / (duration / 1000)) * 20; // Increasing tempo
    const amplitude = 0.3 + (t / (duration / 1000)) * 0.4; // Increasing volume
    data[i] = Math.sin(t * frequency * Math.PI * 2) * (Math.random() * 0.5 + 0.5) * amplitude;
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;

  // Low-pass filter for warmer sound
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;

  // Gain for volume control
  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.4, startTime);
  gainNode.gain.linearRampToValueAtTime(0.8, endTime - 0.1);
  gainNode.gain.linearRampToValueAtTime(0, endTime);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);
  source.start(startTime);
  source.stop(endTime);
}

function playRevealSound() {
  if (!settings.soundEnabled) return;
  if (!audioContext) initAudio();

  const startTime = audioContext.currentTime;

  // Cymbal crash / shimmer
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(220, startTime + 0.3);

  // Second harmonic
  const oscillator2 = audioContext.createOscillator();
  oscillator2.type = 'triangle';
  oscillator2.frequency.setValueAtTime(1320, startTime);
  oscillator2.frequency.exponentialRampToValueAtTime(440, startTime + 0.2);

  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.5, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

  oscillator.connect(gainNode);
  oscillator2.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(startTime);
  oscillator2.start(startTime);
  oscillator.stop(startTime + 0.4);
  oscillator2.stop(startTime + 0.4);
}

function playHeartbeat(count = 3) {
  if (!settings.soundEnabled) return;
  if (!audioContext) initAudio();

  for (let i = 0; i < count; i++) {
    const delay = i * 600; // 600ms between beats - slower, more suspenseful
    setTimeout(() => {
      const startTime = audioContext.currentTime;

      // Low thump
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(60, startTime);
      oscillator.frequency.exponentialRampToValueAtTime(30, startTime + 0.15);

      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.6, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.2);
    }, delay);
  }
}

// ========================================
// INIT
// ========================================
function init() {
  loadSettings();
  loadHistory();
  loadCounters();
  recordVisit();
  loadCustomDishes();
  loadFavorites();
  loadExcludes();
  createDeck();
  renderDeck(true);
  setupEvents();
  updateHistoryPanel();
  updateChallengeBadge();
  renderDishOfDay();
  updateSessionInfo();
  
  // Handle PWA shortcuts
  handleUrlParams();
  
  // Show onboarding for first-time users
  if (!localStorage.getItem('homnayangi_onboarded')) {
    showOnboarding();
  }
}

function handleUrlParams() {
  const params = new URLSearchParams(window.location.search);
  
  // Random card action
  if (params.get('action') === 'random') {
    setTimeout(quickPick, 500);
  }
  
  // Multiplayer mode
  if (params.get('mode') === 'multi') {
    setTimeout(() => setMode(true), 300);
  }
  
  // Clear params after handling
  if (params.toString()) {
    window.history.replaceState({}, '', window.location.pathname);
  }
}

// ========================================
// ONBOARDING
// ========================================
let currentSlide = 1;
const totalSlides = 5;

function showOnboarding() {
  document.getElementById('onboardingModal').classList.add('show');
}

function hideOnboarding() {
  document.getElementById('onboardingModal').classList.remove('show');
  localStorage.setItem('homnayangi_onboarded', 'true');
}

function goToSlide(slideNum) {
  currentSlide = slideNum;
  
  // Update slides
  document.querySelectorAll('.onboarding-slide').forEach(slide => {
    slide.classList.toggle('active', parseInt(slide.dataset.slide) === slideNum);
  });
  
  // Update dots
  document.querySelectorAll('.onboarding-dots .dot').forEach(dot => {
    dot.classList.toggle('active', parseInt(dot.dataset.dot) === slideNum);
  });
  
  // Update button text
  const nextBtn = document.getElementById('nextOnboarding');
  nextBtn.textContent = slideNum === totalSlides ? 'Bắt đầu' : 'Tiếp theo';
}

function nextSlide() {
  if (currentSlide < totalSlides) {
    goToSlide(currentSlide + 1);
  } else {
    hideOnboarding();
  }
}

function createDeck() {
  deck = [];
  flippedCards = [];
  let cardIndex = 0;

  const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
  const regionFilter = document.getElementById('regionFilter')?.value || 'all';
  const favFilter = document.getElementById('favFilter')?.value || 'all';
  let suitsToUse = categoryFilter === 'all' ? SUITS : [categoryFilter];

  // Build deck with all suits based on filter
  for (const suit of suitsToUse) {
    for (let i = 0; i < VALUES.length; i++) {
      const region = REGIONS[suit][i];
      const dishName = DISHES[suit][i];
      
      // Skip excluded dishes
      if (isExcluded(dishName)) continue;
      
      // Filter by favorites
      if (favFilter === 'fav' && !isFavorite(dishName)) continue;
      
      // Filter by region: include if matches or is 'A' (all regions) or filter is 'all'
      if (regionFilter === 'all' || region === 'A' || region === regionFilter) {
        deck.push({
          id: cardIndex++,
          value: VALUES[i],
          suit: suit,
          dish: dishName,
          pairing: PAIRINGS[suit][i],
          emoji: EMOJIS[suit],
          imageUrl: IMAGES[suit][i],
          isRed: suit === '♥' || suit === '♦',
          region: region
        });
      }
    }
  }

  // Add custom dishes
  const customToAdd = categoryFilter === 'all'
    ? customDishes
    : customDishes.filter(d => d.category === categoryFilter);

  const customValues = ['J', 'Q', 'K', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  customToAdd.forEach((d, i) => {
    // Skip excluded custom dishes
    if (isExcluded(d.name)) return;
    // Filter by favorites
    if (favFilter === 'fav' && !isFavorite(d.name)) return;
    
    deck.push({
      id: cardIndex++,
      value: customValues[i % customValues.length],
      suit: d.category,
      dish: d.name,
      pairing: d.pairing,
      emoji: EMOJIS[d.category],
      imageUrl: d.imageUrl,
      isRed: d.category === '♥' || d.category === '♦',
      isCustom: true,
      region: 'A'
    });
  });

  // Apply time-based sorting if enabled (prioritize, not filter)
  if (settings.timeFilterEnabled && categoryFilter === 'all') {
    const timeSuits = getTimeSuits(getTimePeriod());
    // Sort: time-appropriate suits first, then others
    deck.sort((a, b) => {
      const aMatch = timeSuits.includes(a.suit) ? 0 : 1;
      const bMatch = timeSuits.includes(b.suit) ? 0 : 1;
      return aMatch - bMatch;
    });
  }

  // Shuffle within groups or entire deck
  if (settings.timeFilterEnabled && categoryFilter === 'all') {
    // Shuffle within priority groups
    const timeSuits = getTimeSuits(getTimePeriod());
    const priorityCards = deck.filter(c => timeSuits.includes(c.suit));
    const otherCards = deck.filter(c => !timeSuits.includes(c.suit));
    shuffleArray(priorityCards);
    shuffleArray(otherCards);
    deck = [...priorityCards, ...otherCards];
  } else {
    // Normal shuffle
    shuffleArray(deck);
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ========================================
// RENDER
// ========================================
function renderDeck(withAnimation = false) {
  const container = document.getElementById('deck');
  container.innerHTML = '';

  // Empty pool — tell the user to relax filters instead of a blank board
  if (deck.length === 0) {
    container.innerHTML = '<p class="empty-deck" role="status">Không còn lá nào phù hợp bộ lọc. Hãy nới bộ lọc hoặc thêm món.</p>';
    updateRemaining();
    return;
  }

  deck.forEach((card, index) => {
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.index = index;

    if (withAnimation) {
      el.classList.add('dealing');
      el.style.setProperty('--deal-delay', `${index * 15}ms`);
    }

    if (flippedCards.includes(index)) {
      el.classList.add('flipped');
      el.innerHTML = createCardFront(card);
    } else {
      el.innerHTML = `<div class="back"></div>`;
      el.addEventListener('click', () => pickCard(index));
    }

    container.appendChild(el);
  });

  updateRemaining();
}

function createCardFront(card) {
  const colorClass = card.isRed ? 'red' : 'black';
  return `
    <div class="front ${colorClass}">
      <div class="corner-tl">
        <span class="num">${card.value}</span>
        <span class="suit">${card.suit}</span>
      </div>
      <div class="center">
        <img src="${escapeHtml(card.imageUrl)}" alt="${escapeHtml(card.dish)}" class="card-thumb" loading="lazy" decoding="async" onerror="this.style.display='none'">
        <div class="food">${escapeHtml(card.dish)}</div>
      </div>
      <div class="corner-br">
        <span class="num">${card.value}</span>
        <span class="suit">${card.suit}</span>
      </div>
    </div>
  `;
}

function updateRemaining() {
  document.getElementById('remaining').textContent = deck.length - flippedCards.length;
}

// ========================================
// DRAMATIC CARD PICK - EXTENDED SUSPENSE (~5 seconds)
// ========================================
async function pickCard(index) {
  if (flippedCards.includes(index) || isAnimating) return;
  isAnimating = true;

  const card = deck[index];
  const cardEl = document.querySelector(`[data-index="${index}"]`);

  // Dim other cards
  document.querySelectorAll('.card:not(.flipped)').forEach(c => {
    if (c !== cardEl) c.classList.add('dimmed');
  });

  // Vibrate on mobile (short pulse)
  if (navigator.vibrate) navigator.vibrate(50);

  const reduceMotion = prefersReducedMotion();

  // Start heartbeat (5 beats for longer suspense)
  playHeartbeat(reduceMotion ? 1 : 5);

  // PHASE 1: Lift card up with glow (800ms)
  cardEl.classList.add('picking');
  await sleep(reduceMotion ? 150 : 800);

  // PHASE 2: Dramatic shake with drumroll (3000ms = 3 seconds!)
  cardEl.classList.add('shaking');
  playDrumroll(reduceMotion ? 400 : 3000);
  // Vibrate pattern during shake
  if (!reduceMotion && navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100, 50, 100, 50, 100]);
  await sleep(reduceMotion ? 400 : 3000);

  // PHASE 3: Flash reveal with sound
  cardEl.classList.remove('picking', 'shaking');
  cardEl.classList.add('revealing');
  playRevealSound();
  // Strong vibrate on reveal
  if (navigator.vibrate) navigator.vibrate(200);

  // Show popup FIRST, then flip card
  flippedCards.push(index);
  showResult(card);

  // Track results for multiplayer
  if (isMultiPlayer) {
    gameResults.push({
      player: currentPlayer,
      dish: card.dish,
      imageUrl: card.imageUrl
    });
    updateResultsPanel();
  }

  // Always add to history
  addToHistory(card);

  createConfetti();

  // Then flip the card in background
  await sleep(100);
  cardEl.classList.add('flipped');
  cardEl.innerHTML = createCardFront(card);

  await sleep(400);
  cardEl.classList.remove('revealing');

  // Undim other cards
  document.querySelectorAll('.dimmed').forEach(c => c.classList.remove('dimmed'));

  updateRemaining();

  isAnimating = false;
}

function showResult(card) {
  currentResult = card; // Store for sharing
  const modal = document.getElementById('modal');
  const resultCard = document.getElementById('resultCard');
  const isFav = isFavorite(card.dish);

  resultCard.className = 'result-card ' + (card.isRed ? 'red' : 'black');
  resultCard.innerHTML = `
    <button class="fav-btn ${isFav ? 'active' : ''}" id="favBtn" title="${isFav ? 'Bỏ yêu thích' : 'Yêu thích'}">
      <svg viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
    <div class="corner-tl">
      <span class="num">${card.value}</span>
      <span class="suit">${card.suit}</span>
    </div>
    <div class="main-suit">${card.suit}</div>
    <div class="card-center">
      <div class="card-image">
        <img src="${escapeHtml(card.imageUrl)}" alt="${escapeHtml(card.dish)}" loading="lazy" decoding="async" onerror="this.style.display='none'">
      </div>
      <div class="image-disclaimer">Hình ảnh mang tính chất minh họa</div>
      <div class="card-content">
        <div class="food-name">${escapeHtml(card.dish)}</div>
        <div class="food-pairing">Ăn kèm: ${escapeHtml(card.pairing)}</div>
      </div>
    </div>
    <div class="corner-br">
      <span class="num">${card.value}</span>
      <span class="suit">${card.suit}</span>
    </div>
  `;

  // Add favorite button listener
  document.getElementById('favBtn').addEventListener('click', () => {
    toggleFavorite(card.dish);
    const btn = document.getElementById('favBtn');
    const nowFav = isFavorite(card.dish);
    btn.classList.toggle('active', nowFav);
    btn.title = nowFav ? 'Bỏ yêu thích' : 'Yêu thích';
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="${nowFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>`;
  });

  // Food delivery / map links (same pattern as truanayangi)
  const dishQ = encodeURIComponent(card.dish);
  document.getElementById('linkMaps').href =
    `https://www.google.com/maps/search/${encodeURIComponent(card.dish + ' gần đây')}`;
  document.getElementById('linkGrab').href =
    `https://food.grab.com/vn/vi/restaurants?${new URLSearchParams({ search: card.dish, 'support-deeplink': 'true', searchParameter: card.dish })}`;
  document.getElementById('linkShopee').href = `https://shopeefood.vn/search?keyword=${dishQ}`;
  document.getElementById('linkBe').href = `https://food.be.com.vn/search?q=${dishQ}`;

  document.getElementById('nextBtn').classList.toggle('show', isMultiPlayer);
  modal.classList.add('show');
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
}

function nextPlayer() {
  currentPlayer = currentPlayer >= totalPlayers ? 1 : currentPlayer + 1;
  document.getElementById('playerName').textContent = playerNames[currentPlayer - 1];
  closeModal();
}

async function resetGame() {
  if (isAnimating) return;
  isAnimating = true;

  const cards = document.querySelectorAll('.card');
  cards.forEach((card, i) => {
    card.classList.add('collecting');
    card.style.setProperty('--collect-delay', `${i * 8}ms`);
  });

  await sleep(700);

  flippedCards = [];
  gameResults = [];
  currentPlayer = 1;
  createDeck();
  renderDeck(true);
  document.getElementById('playerName').textContent = 'Người chơi 1';
  updateResultsPanel();

  isAnimating = false;
}

function setMode(multi) {
  isMultiPlayer = multi;
  const singleBtn = document.getElementById('singleMode');
  const multiBtn = document.getElementById('multiMode');
  singleBtn.classList.toggle('active', !multi);
  multiBtn.classList.toggle('active', multi);
  singleBtn.setAttribute('aria-pressed', String(!multi));
  multiBtn.setAttribute('aria-pressed', String(multi));

  if (multi) {
    // Show multiplayer modal for setup
    openMultiplayerModal();
  } else {
    // Single player - hide all panels
    document.getElementById('playerBar').classList.remove('show');
    document.getElementById('resultsPanel').classList.remove('show');
    resetGame();
  }
}

// ========================================
// MULTIPLAYER MODAL
// ========================================
function openMultiplayerModal() {
  const modal = document.getElementById('multiplayerModal');
  modal.classList.add('show');
  generatePlayerInputs(3); // Default 3 players
}

function closeMultiplayerModal() {
  document.getElementById('multiplayerModal').classList.remove('show');
  // Reset to single mode if cancelled
  document.getElementById('singleMode').classList.add('active');
  document.getElementById('multiMode').classList.remove('active');
  isMultiPlayer = false;
}

function generatePlayerInputs(count) {
  const container = document.getElementById('playerInputs');
  container.innerHTML = '';
  
  for (let i = 1; i <= count; i++) {
    const row = document.createElement('div');
    row.className = 'player-input-row';
    row.innerHTML = `
      <span class="player-number">${i}</span>
      <input type="text" placeholder="Người chơi ${i}" data-player="${i}">
    `;
    container.appendChild(row);
  }
}

function startMultiplayerGame() {
  const inputs = document.querySelectorAll('#playerInputs input');
  totalPlayers = inputs.length;
  playerNames = Array.from(inputs).map((inp, i) => inp.value.trim() || `Người chơi ${i + 1}`);
  currentPlayer = 1;
  gameResults = [];
  
  // Close modal and show player bar
  document.getElementById('multiplayerModal').classList.remove('show');
  document.getElementById('playerBar').classList.add('show');
  document.getElementById('playerName').textContent = playerNames[0];
  
  // Reset deck for new game
  flippedCards = [];
  createDeck();
  renderDeck(true);
  updateResultsPanel();
}

function endMultiplayerGame() {
  // Show results panel with final results
  document.getElementById('resultsPanel').classList.add('show');
  
  // Reset to single mode
  isMultiPlayer = false;
  document.getElementById('singleMode').classList.add('active');
  document.getElementById('multiMode').classList.remove('active');
  document.getElementById('playerBar').classList.remove('show');
}

// ========================================
// CONFETTI
// ========================================
function createConfetti() {
  if (prefersReducedMotion()) return;
  const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b9d', '#a855f7'];
  const container = document.createElement('div');
  container.className = 'confetti';
  container.style.left = '50%';
  container.style.top = '20%';

  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = `${Math.random() * 400 - 200}px`;
    piece.style.animationDelay = `${Math.random() * 400}ms`;
    piece.style.animationDuration = `${1.2 + Math.random() * 0.6}s`;
    container.appendChild(piece);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 2500);
}

// ========================================
// HELPERS & EVENTS
// ========================================
function updateResultsPanel() {
  const list = document.getElementById('resultsList');
  if (gameResults.length === 0) {
    list.innerHTML = '<p class="no-results">Chưa có kết quả</p>';
    return;
  }

  list.innerHTML = gameResults.map(r => `
    <div class="result-item">
      <img src="${escapeHtml(r.imageUrl)}" alt="${escapeHtml(r.dish)}" class="result-thumb" loading="lazy" decoding="async">
      <div class="result-info">
        <span class="result-player">${escapeHtml(playerNames[r.player - 1] || 'Người chơi ' + r.player)}</span>
        <span class="result-dish">${escapeHtml(r.dish)}</span>
      </div>
    </div>
  `).join('');
}

function toggleResultsPanel() {
  document.getElementById('resultsPanel').classList.toggle('show');
}

// Lucky Wheel - Canvas-based spinning wheel
let wheelDishes = [];
let wheelAngle = 0;
let isSpinning = false;

const WHEEL_COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

function openWheelModal() {
  // Get available dishes
  const available = deck.filter((_, i) => !flippedCards.includes(i));
  if (available.length === 0) {
    alert('Hết lá rồi! Hãy chia lại bộ bài.');
    return;
  }

  // Pick up to 8 random dishes for wheel
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  wheelDishes = shuffled.slice(0, Math.min(8, shuffled.length));

  document.getElementById('wheelModal').classList.add('show');
  document.getElementById('spinWheelBtn').disabled = false;
  drawWheel();
}

function closeWheelModal() {
  document.getElementById('wheelModal').classList.remove('show');
}

function drawWheel(highlightIndex = -1) {
  const canvas = document.getElementById('wheelCanvas');
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const outerRadius = 145;
  const innerRadius = 130;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw outer rim (decorative border)
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
  ctx.fillStyle = '#2d3748';
  ctx.fill();
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Draw tick marks on rim
  for (let i = 0; i < 24; i++) {
    const angle = (i * Math.PI * 2) / 24;
    ctx.beginPath();
    ctx.moveTo(
      centerX + Math.cos(angle) * (outerRadius - 8),
      centerY + Math.sin(angle) * (outerRadius - 8)
    );
    ctx.lineTo(
      centerX + Math.cos(angle) * outerRadius,
      centerY + Math.sin(angle) * outerRadius
    );
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  const sliceAngle = (2 * Math.PI) / wheelDishes.length;

  wheelDishes.forEach((dish, i) => {
    const startAngle = wheelAngle + i * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, innerRadius, startAngle, endAngle);
    ctx.closePath();

    ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
    if (highlightIndex === i) {
      ctx.fillStyle = '#fbbf24'; // Highlight winner
    }
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw text - larger and more readable
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px "Be Vietnam Pro", sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    // Truncate dish name
    let dishName = dish.dish;
    if (dishName.length > 10) {
      dishName = dishName.substring(0, 8) + '..';
    }

    // Position text in middle of slice
    ctx.fillText(dishName, innerRadius / 2 + 15, 5);
    ctx.restore();
  });

  // Draw center circle with gradient
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
  gradient.addColorStop(0, '#fbbf24');
  gradient.addColorStop(0.5, '#f59e0b');
  gradient.addColorStop(1, '#d97706');

  ctx.beginPath();
  ctx.arc(centerX, centerY, 28, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw "?" in center
  ctx.fillStyle = '#1a1a2e';
  ctx.font = 'bold 24px "Be Vietnam Pro", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'transparent';
  ctx.fillText('?', centerX, centerY);
}

function spinWheel() {
  if (isSpinning || wheelDishes.length === 0) return;
  isSpinning = true;

  document.getElementById('spinWheelBtn').disabled = true;

  const reduceMotion = prefersReducedMotion();

  // Play sound
  if (settings.soundEnabled) playDrumroll(reduceMotion ? 800 : 3000);

  // Random spin: 5-7 full rotations + random final position (longer spin)
  const totalRotation = (reduceMotion ? 1.5 : 5 + Math.random() * 2) * 2 * Math.PI;
  const winnerIndex = Math.floor(Math.random() * wheelDishes.length);
  const sliceAngle = (2 * Math.PI) / wheelDishes.length;

  // Calculate final angle to land on winner (pointer at top = -PI/2)
  const targetAngle = -Math.PI / 2 - (winnerIndex * sliceAngle) - sliceAngle / 2;
  const finalAngle = wheelAngle + totalRotation + (targetAngle - (wheelAngle % (2 * Math.PI)));

  const startAngle = wheelAngle;
  const duration = reduceMotion ? 1500 : 6000; // 6 seconds for slower spin
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing: decelerate
    const easeOut = 1 - Math.pow(1 - progress, 3);

    wheelAngle = startAngle + (finalAngle - startAngle) * easeOut;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Spin complete
      isSpinning = false;

      // Highlight winner
      drawWheel(winnerIndex);

      // Play reveal sound
      playRevealSound();

      // Show result after short delay
      setTimeout(() => {
        const winner = wheelDishes[winnerIndex];
        const deckIndex = deck.findIndex(c => c.id === winner.id);

        if (deckIndex !== -1) {
          flippedCards.push(deckIndex);

          // Mark card in deck
          const cardEl = document.querySelector(`[data-index="${deckIndex}"]`);
          if (cardEl) {
            cardEl.classList.add('flipped');
            cardEl.innerHTML = createCardFront(winner);
          }
        }

        closeWheelModal();
        showResult(winner);
        addToHistory(winner);

        if (isMultiPlayer) {
          gameResults.push({
            player: currentPlayer,
            dish: winner.dish,
            imageUrl: winner.imageUrl
          });
          updateResultsPanel();
        }

        createConfetti();
        updateRemaining();
      }, 800);
    }
  }

  requestAnimationFrame(animate);
}

// ========================================
// REEL MODE — CS:GO-style horizontal case opening
// ========================================
let reelDishes = [];
let reelStrip = [];
let isReelSpinning = false;
let reelWinnerIndex = -1;

const REEL_TILE_W = 104; // px, must match CSS
const REEL_LEN = 42;
const REEL_WIN_AT = 36;

function openReelModal() {
  const available = deck.filter((_, i) => !flippedCards.includes(i));
  if (available.length === 0) {
    alert('Hết lá rồi! Hãy chia lại bộ bài.');
    return;
  }
  reelDishes = available;
  buildReelStrip();
  document.getElementById('reelModal').classList.add('show');
  document.getElementById('spinReelBtn').disabled = false;
}

function closeReelModal() {
  document.getElementById('reelModal').classList.remove('show');
}

// Spin profile — randomized per roll so each opening feels different
// (ported from truanayangi's CS:GO Panorama reconstruction)
function createSpinProfile(random = Math.random, reducedMotion = false) {
  if (reducedMotion) {
    return { durationMs: 800 + Math.floor(random() * 400), friction: 2.7 + random() * 0.6 };
  }
  return { durationMs: 5200 + Math.floor(random() * 1800), friction: 2.7 + random() * 0.6 };
}

function spinProgress(progress, friction) {
  const p = Math.max(0, Math.min(1, progress));
  return 1 - Math.pow(1 - p, friction);
}

function buildReelStrip() {
  const winner = reelDishes[Math.floor(Math.random() * reelDishes.length)];
  reelStrip = [];
  const recent = [];
  for (let i = 0; i < REEL_LEN; i++) {
    if (i === REEL_WIN_AT) {
      reelStrip.push(winner);
      continue;
    }
    // Avoid repeating the same dish back-to-back like truanayangi's reel
    const alternatives = reelDishes.filter(d => !recent.includes(d));
    const pick = (alternatives.length ? alternatives : reelDishes)[Math.floor(Math.random() * (alternatives.length ? alternatives : reelDishes).length)];
    reelStrip.push(pick);
    recent.push(pick);
    if (recent.length > 6) recent.shift();
  }
  reelWinnerIndex = REEL_WIN_AT;

  const strip = document.getElementById('reelStrip');
  strip.style.transition = 'none';
  strip.style.transform = 'translateX(0)';
  strip.innerHTML = reelStrip.map(d => `
    <div class="reel-tile">
      <img src="${escapeHtml(d.imageUrl)}" alt="${escapeHtml(d.dish)}" loading="lazy" decoding="async" onerror="this.style.display='none'">
      <span>${escapeHtml(d.dish)}</span>
    </div>
  `).join('');
}

function spinReel() {
  if (isReelSpinning || reelStrip.length === 0) return;
  isReelSpinning = true;
  document.getElementById('spinReelBtn').disabled = true;

  const reduceMotion = prefersReducedMotion();
  const window_ = document.querySelector('.reel-window');
  const strip = document.getElementById('reelStrip');

  // Offset so the winner tile's center lands on the window's center,
  // with a small random jitter within the tile for realism
  const jitter = (Math.random() - 0.5) * (REEL_TILE_W - 24);
  const targetX = -(REEL_WIN_AT * REEL_TILE_W + REEL_TILE_W / 2) + window_.clientWidth / 2 + jitter;

  const profile = createSpinProfile(Math.random, reduceMotion);
  const duration = profile.durationMs;
  const startTime = performance.now();

  if (settings.soundEnabled) playDrumroll(Math.min(duration, 3000));

  // Tick when a tile crosses the pointer (CS:GO scroll tick)
  let lastCell = Math.floor(-targetX / REEL_TILE_W);

  function frame(now) {
    const p = Math.min((now - startTime) / duration, 1);
    const ease = spinProgress(p, profile.friction);
    const currentX = targetX * ease;
    strip.style.transform = `translateX(${currentX}px)`;

    const cell = Math.floor((-currentX + window_.clientWidth / 2) / REEL_TILE_W);
    if (cell !== lastCell) {
      playTick();
      lastCell = cell;
    }

    if (p < 1) {
      requestAnimationFrame(frame);
    } else {
      isReelSpinning = false;
      const winner = reelStrip[reelWinnerIndex];
      const tile = strip.children[reelWinnerIndex];
      if (tile) tile.classList.add('winner');
      playRevealSound();

      setTimeout(() => {
        const deckIndex = deck.findIndex(c => c.id === winner.id);
        if (deckIndex !== -1) {
          flippedCards.push(deckIndex);
          const cardEl = document.querySelector(`[data-index="${deckIndex}"]`);
          if (cardEl) {
            cardEl.classList.add('flipped');
            cardEl.innerHTML = createCardFront(winner);
          }
        }
        closeReelModal();
        showResult(winner);
        addToHistory(winner);
        if (isMultiPlayer) {
          gameResults.push({ player: currentPlayer, dish: winner.dish, imageUrl: winner.imageUrl });
          updateResultsPanel();
        }
        createConfetti();
        updateRemaining();
      }, 700);
    }
  }

  requestAnimationFrame(frame);
}

// ========================================
// BATTLE MODE — So Găng: 8-dish head-to-head bracket
// ========================================
let battleRound = [];
let battleNextRound = [];
let battleRoundSize = 0;

function openBattleModal() {
  const available = deck.filter((_, i) => !flippedCards.includes(i));
  if (available.length < 2) {
    alert('Cần ít nhất 2 lá để so găng! Hãy chia lại bộ bài.');
    return;
  }

  const shuffled = [...available].sort(() => Math.random() - 0.5);
  battleRound = shuffled.slice(0, Math.min(8, shuffled.length));
  battleRoundSize = battleRound.length;
  battleNextRound = [];

  document.getElementById('battleModal').classList.add('show');
  renderBattleMatch();
}

function closeBattleModal() {
  document.getElementById('battleModal').classList.remove('show');
}

function battleRoundLabel(size) {
  if (size <= 2) return 'Chung kết';
  if (size <= 4) return 'Bán kết';
  return 'Tứ kết';
}

function renderBattleMatch() {
  const a = battleRound[0];
  const b = battleRound[1];

  document.getElementById('battleTitle').textContent =
    `So Găng — ${battleRoundLabel(battleRoundSize)}`;

  for (const [id, d] of [['battleCardA', a], ['battleCardB', b]]) {
    document.getElementById(id).innerHTML = `
      <img src="${escapeHtml(d.imageUrl)}" alt="${escapeHtml(d.dish)}" loading="lazy" decoding="async" onerror="this.style.display='none'">
      <span class="battle-dish">${escapeHtml(d.dish)}</span>
    `;
  }

  document.getElementById('battleProgress').textContent =
    `Còn ${battleRound.length} món vòng này`;
}

function pickBattleSide(side) {
  const winner = battleRound[side];
  battleNextRound.push(winner);
  battleRound.splice(0, 2);

  if (battleRound.length === 0) {
    battleRound = battleNextRound;
    battleNextRound = [];
    battleRoundSize = battleRound.length;

    if (battleRound.length === 1) {
      const champion = battleRound[0];
      closeBattleModal();

      const deckIndex = deck.findIndex(c => c.id === champion.id);
      if (deckIndex !== -1) {
        flippedCards.push(deckIndex);
        const cardEl = document.querySelector(`[data-index="${deckIndex}"]`);
        if (cardEl) {
          cardEl.classList.add('flipped');
          cardEl.innerHTML = createCardFront(champion);
        }
      }

      showResult(champion);
      addToHistory(champion);
      if (isMultiPlayer) {
        gameResults.push({ player: currentPlayer, dish: champion.dish, imageUrl: champion.imageUrl });
        updateResultsPanel();
      }
      createConfetti();
      updateRemaining();
      return;
    }
  }

  renderBattleMatch();
}

// ========================================
// FAMILY MEAL — Mâm Cơm Gia Đình: region-themed tray generator
// ========================================
const MAM_COURSES = [
  { key: 'soup', label: 'Món canh', icon: 'M4 11h16a8 8 0 0 1-16 0zM8 7c0-2 2-2 2-4M12 7c0-2 2-2 2-4' },
  { key: 'main', label: 'Món mặn', icon: 'M12 3v3M5.6 5.6l2.1 2.1M18.4 5.6l-2.1 2.1M3 13h18a9 9 0 0 1-18 0z' },
  { key: 'veg', label: 'Món rau', icon: 'M12 21c-5 0-8-3.5-8-8 4.5 0 8 3.5 8 8zm0 0c0-4.5 3.5-8 8-8 0 4.5-3.5 8-8 8zm0-8V5' },
  { key: 'dessert', label: 'Tráng miệng', icon: 'M7 3h10l-2 7a3 3 0 0 1-6 0L7 3zM12 13v6M8 21h8' }
];

let mamRegion = 'B';
let mamTray = null; // {soup, main, veg, dessert}

function openMamComModal() {
  document.getElementById('mamModal').classList.add('show');
  document.querySelectorAll('.mam-chip').forEach(ch => {
    const on = ch.dataset.region === mamRegion;
    ch.classList.toggle('selected', on);
    ch.setAttribute('aria-pressed', String(on));
  });
  renderMamTray();
}

function closeMamComModal() {
  document.getElementById('mamModal').classList.remove('show');
}

function setMamRegion(region) {
  mamRegion = region;
  document.querySelectorAll('.mam-chip').forEach(ch => {
    const on = ch.dataset.region === region;
    ch.classList.toggle('selected', on);
    ch.setAttribute('aria-pressed', String(on));
  });
  rollMamCom();
}

function pickCourse(region, course, exclude) {
  const pool = FAMILY_MEALS[region][course].filter(d => d !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}

function rollMamCom() {
  mamTray = {};
  for (const c of MAM_COURSES) {
    mamTray[c.key] = pickCourse(mamRegion, c.key);
  }
  renderMamTray();
  playTick();
}

function rerollMamItem(course) {
  if (!mamTray) return;
  mamTray[course] = pickCourse(mamRegion, course, mamTray[course]);
  renderMamTray();
  playTick();
}

function renderMamTray() {
  const tray = document.getElementById('mamTray');
  if (!tray) return;

  if (!mamTray) {
    tray.innerHTML = '<p class="mam-hint">Chọn miền rồi bấm Gieo mâm để nhận thực đơn đủ 4 món.</p>';
    return;
  }

  tray.innerHTML = MAM_COURSES.map(c => `
    <div class="mam-course">
      <div class="mam-course-head">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${c.icon}"/></svg>
        <span>${c.label}</span>
        <button class="mam-reroll" data-course="${c.key}" aria-label="Đổi ${c.label}" title="Đổi món này">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
      </div>
      <div class="mam-dish">${escapeHtml(mamTray[c.key])}</div>
    </div>
  `).join('');

  tray.querySelectorAll('.mam-reroll').forEach(btn => {
    btn.addEventListener('click', () => rerollMamItem(btn.dataset.course));
  });
}

// ========================================
// DISH OF THE DAY — deterministic daily suggestion
// ========================================
function getDishOfDay() {
  const all = [];
  for (const suit of SUITS) {
    DISHES[suit].forEach((dish, i) => {
      all.push({
        value: VALUES[i],
        suit,
        dish,
        pairing: PAIRINGS[suit][i],
        imageUrl: IMAGES[suit][i],
        isRed: suit === '♥' || suit === '♦',
        region: REGIONS[suit][i]
      });
    });
  }
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return all[seed % all.length];
}

function renderDishOfDay() {
  const el = document.getElementById('dishOfDayName');
  if (el) el.textContent = getDishOfDay().dish;
}

// "Last choice" + local pick counter — ported from truanayangi's local-counter
function updateSessionInfo() {
  const lastWrap = document.getElementById('lastChoiceWrap');
  const lastName = document.getElementById('lastChoiceName');
  const countWrap = document.getElementById('pickCountWrap');
  const countEl = document.getElementById('pickCount');
  if (!lastWrap || !countWrap) return;

  if (history.length > 0 && lastName) {
    const last = history[history.length - 1];
    lastName.textContent = last.dish || '';
    lastWrap.hidden = !last.dish;
  }
  if (totalSpins > 0 && countEl) {
    countEl.textContent = new Intl.NumberFormat('vi-VN').format(totalSpins);
    countWrap.hidden = false;
  }
  const visitsWrap = document.getElementById('visitCountWrap');
  const visitsEl = document.getElementById('visitCount');
  if (visitCount > 1 && visitsWrap && visitsEl) {
    visitsEl.textContent = new Intl.NumberFormat('vi-VN').format(visitCount);
    visitsWrap.hidden = false;
  }

  // Hide the whole strip when nothing has data yet
  const strip = document.getElementById('sessionInfo');
  if (strip) {
    const anyVisible = [...strip.querySelectorAll('.session-item')].some(el => !el.hidden);
    strip.hidden = !anyVisible;
  }
}

function openSettings() {
  document.getElementById('settingsModal').classList.add('show');
}

function closeSettings() {
  document.getElementById('settingsModal').classList.remove('show');
}

// Current result for sharing
let currentResult = null;

async function shareResult() {
  if (!currentResult) return;

  // Try to create and share image
  try {
    const canvas = await createShareImage(currentResult);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], 'homnayangi.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'Hôm Nay Ăn Gì?',
        text: `Hôm nay ăn: ${currentResult.dish}`,
        files: [file]
      });
      return;
    }
  } catch (err) {
    console.log('Image share failed:', err);
  }

  // Fallback to text share
  const shareData = {
    title: 'Hôm Nay Ăn Gì?',
    text: `🍜 Hôm nay ăn: ${currentResult.dish}\n🥢 Ăn kèm: ${currentResult.pairing}\n\n👉 Thử ngay: ${window.location.href}`,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log('Share cancelled:', err);
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareData.text);
      alert('Đã copy kết quả vào clipboard!');
    } catch (err) {
      alert('Không thể chia sẻ. Hãy copy thủ công:\n' + shareData.text);
    }
  }
}

async function createShareImage(card) {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 800);
  gradient.addColorStop(0, '#1a6b3a');
  gradient.addColorStop(1, '#0f4a28');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 800);

  // Card background
  ctx.fillStyle = '#fffef8';
  roundRect(ctx, 100, 80, 400, 560, 20);
  ctx.fill();

  // Card border
  ctx.strokeStyle = '#c0a875';
  ctx.lineWidth = 4;
  roundRect(ctx, 100, 80, 400, 560, 20);
  ctx.stroke();

  // Load and draw food image
  try {
    const img = await loadImage(card.imageUrl);
    ctx.save();
    roundRect(ctx, 130, 180, 340, 220, 10);
    ctx.clip();
    ctx.drawImage(img, 130, 180, 340, 220);
    ctx.restore();
  } catch (e) {
    // Draw placeholder if image fails
    ctx.fillStyle = '#eee';
    roundRect(ctx, 130, 180, 340, 220, 10);
    ctx.fill();
  }

  // Suit and value
  ctx.fillStyle = card.isRed ? '#dc2626' : '#1a1a1a';
  ctx.font = 'bold 48px Georgia, serif';
  ctx.fillText(card.value, 130, 150);
  ctx.font = '36px Georgia, serif';
  ctx.fillText(card.suit, 135, 190);

  // Food name
  ctx.fillStyle = card.isRed ? '#dc2626' : '#1a1a1a';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(card.dish, 300, 460);

  // Pairing
  ctx.fillStyle = '#666';
  ctx.font = '18px sans-serif';
  ctx.fillText(`Ăn kèm: ${card.pairing}`, 300, 500);

  // App name
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('Hôm Nay Ăn Gì?', 300, 720);

  ctx.font = '16px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('homnayangi.app', 300, 760);

  return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Pick a random unflipped card — used by the quick-pick CTA and PWA shortcut
function quickPick() {
  const available = deck.map((_, i) => i).filter(i => !flippedCards.includes(i));
  if (available.length === 0 || isAnimating) return;
  pickCard(available[Math.floor(Math.random() * available.length)]);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setupEvents() {
  document.getElementById('closeBtn').addEventListener('click', closeModal);
  document.getElementById('modalBg').addEventListener('click', closeModal);
  document.getElementById('nextBtn').addEventListener('click', nextPlayer);
  document.getElementById('resetBtn').addEventListener('click', resetGame);
  document.getElementById('singleMode').addEventListener('click', () => setMode(false));
  document.getElementById('multiMode').addEventListener('click', () => setMode(true));
  document.getElementById('resultsToggle').addEventListener('click', toggleResultsPanel);
  document.getElementById('shareBtn').addEventListener('click', shareResult);
  document.getElementById('quickPickBtn')?.addEventListener('click', quickPick);

  // Lucky wheel
  document.getElementById('wheelBtn')?.addEventListener('click', openWheelModal);
  document.getElementById('closeWheelX')?.addEventListener('click', closeWheelModal);
  document.getElementById('wheelBg')?.addEventListener('click', closeWheelModal);
  document.getElementById('spinWheelBtn')?.addEventListener('click', spinWheel);

  // Reel (Quay Mâm)
  document.getElementById('reelBtn')?.addEventListener('click', openReelModal);
  document.getElementById('closeReelX')?.addEventListener('click', closeReelModal);
  document.getElementById('reelBg')?.addEventListener('click', closeReelModal);
  document.getElementById('spinReelBtn')?.addEventListener('click', spinReel);

  // Battle (So Găng)
  document.getElementById('battleBtn')?.addEventListener('click', openBattleModal);
  document.getElementById('closeBattleX')?.addEventListener('click', closeBattleModal);
  document.getElementById('battleBg')?.addEventListener('click', closeBattleModal);
  document.getElementById('battleCardA')?.addEventListener('click', () => pickBattleSide(0));
  document.getElementById('battleCardB')?.addEventListener('click', () => pickBattleSide(1));

  // Family meal (Mâm Cơm)
  document.getElementById('mamBtn')?.addEventListener('click', openMamComModal);
  document.getElementById('closeMamX')?.addEventListener('click', closeMamComModal);
  document.getElementById('rollMamBtn')?.addEventListener('click', rollMamCom);
  document.querySelectorAll('.mam-chip').forEach(ch => {
    ch.addEventListener('click', () => setMamRegion(ch.dataset.region));
  });

  // Dish of the day
  document.getElementById('dishOfDay')?.addEventListener('click', () => {
    showResult(getDishOfDay());
  });

  // Onboarding
  document.getElementById('skipOnboarding')?.addEventListener('click', hideOnboarding);
  document.getElementById('nextOnboarding')?.addEventListener('click', nextSlide);
  document.querySelectorAll('.onboarding-dots .dot').forEach(dot => {
    dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.dot)));
  });

  // Category filter
  document.getElementById('categoryFilter').addEventListener('change', () => {
    createDeck();
    renderDeck(true);
  });

  // Region filter
  document.getElementById('regionFilter').addEventListener('change', () => {
    createDeck();
    renderDeck(true);
  });

  // Favorites filter
  document.getElementById('favFilter').addEventListener('change', () => {
    createDeck();
    renderDeck(true);
  });

  // Multiplayer modal
  document.getElementById('closeMultiplayerX')?.addEventListener('click', closeMultiplayerModal);
  document.getElementById('multiplayerBg')?.addEventListener('click', closeMultiplayerModal);
  document.getElementById('startGameBtn')?.addEventListener('click', startMultiplayerGame);
  document.getElementById('endGameBtn')?.addEventListener('click', endMultiplayerGame);
  document.getElementById('closeResultsPanel')?.addEventListener('click', () => {
    document.getElementById('resultsPanel').classList.remove('show');
  });
  document.getElementById('resultsPanelBg')?.addEventListener('click', () => {
    document.getElementById('resultsPanel').classList.remove('show');
  });

  // Player count buttons
  document.querySelectorAll('.count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const count = parseInt(btn.dataset.count);
      document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      generatePlayerInputs(count);
    });
  });

  // Custom dish modal
  document.getElementById('cancelCustomDish').addEventListener('click', closeCustomDishModal);
  document.getElementById('customDishBg').addEventListener('click', closeCustomDishModal);
  document.getElementById('saveCustomDish').addEventListener('click', saveCustomDishFromForm);
  document.getElementById('closeCustomDishX')?.addEventListener('click', closeCustomDishModal);

  // Planner modal
  document.getElementById('closePlannerX')?.addEventListener('click', closePlanner);
  document.getElementById('plannerBg').addEventListener('click', closePlanner);
  document.getElementById('autoFillBtn').addEventListener('click', autoFillWeek);
  document.getElementById('clearPlanBtn').addEventListener('click', clearWeekPlan);

  // Settings
  document.getElementById('settingsBtn').addEventListener('click', openSettings);
  document.getElementById('closeSettingsX')?.addEventListener('click', closeSettings);
  document.getElementById('settingsBg').addEventListener('click', closeSettings);

  // Settings navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.dataset.section;
      
      // Update nav buttons
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update sections
      document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
      document.getElementById('section' + section.charAt(0).toUpperCase() + section.slice(1))?.classList.add('active');
      
      // Refresh history if needed
      if (section === 'history') {
        updateHistoryPanel();
        updateStatsPanel();
      }
    });
  });

  // Feature cards in settings
  document.getElementById('openPlannerBtn')?.addEventListener('click', () => {
    closeSettings();
    openPlanner();
  });
  
  document.getElementById('openCustomDishBtn')?.addEventListener('click', () => {
    closeSettings();
    openCustomDishModal();
  });

  document.getElementById('openExcludesBtn')?.addEventListener('click', () => {
    closeSettings();
    openExcludesModal();
  });

  document.getElementById('closeExcludesX')?.addEventListener('click', closeExcludesModal);
  document.getElementById('excludesBg')?.addEventListener('click', closeExcludesModal);

  document.getElementById('darkModeToggle').addEventListener('change', (e) => {
    settings.darkMode = e.target.checked;
    document.body.classList.toggle('dark-mode', settings.darkMode);
    saveSettings();
  });

  document.getElementById('soundToggle').addEventListener('change', (e) => {
    settings.soundEnabled = e.target.checked;
    saveSettings();
  });

  // Time filter toggle (now in settings)
  document.getElementById('timeFilterToggle')?.addEventListener('change', (e) => {
    settings.timeFilterEnabled = e.target.checked;
    saveSettings();
    createDeck();
    renderDeck(true);
  });

  document.getElementById('animSpeedSelect').addEventListener('change', (e) => {
    settings.animSpeed = e.target.value;
    document.documentElement.style.setProperty('--anim-speed',
      settings.animSpeed === 'slow' ? '1.5' : settings.animSpeed === 'fast' ? '0.6' : '1'
    );
    saveSettings();
  });

  // Tab switching for history/stats
  document.querySelectorAll('.history-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      // Update buttons
      document.querySelectorAll('.history-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update content
      document.getElementById('historyTab').classList.toggle('hidden', tab !== 'history');
      document.getElementById('statsTab').classList.toggle('hidden', tab !== 'stats');

      // Refresh content
      if (tab === 'history') updateHistoryPanel();
      if (tab === 'stats') updateStatsPanel();
    });
  });

  // Enable audio on first interaction
  document.body.addEventListener('click', () => {
    if (!audioContext) initAudio();
  }, { once: true });

  // Escape closes the topmost open modal (dialog semantics)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector(
      '.modal.show, .settings-modal.show, .multiplayer-modal.show, .planner-modal.show, ' +
      '.custom-dish-modal.show, .excludes-modal.show, .wheel-modal.show, .reel-modal.show, ' +
      '.battle-modal.show, .onboarding-modal.show'
    );
    if (open) open.classList.remove('show');
  });

  // Suspend audio when the tab is hidden, resume when it returns
  // (truanayangi pauses its audio engine on visibilitychange)
  document.addEventListener('visibilitychange', () => {
    if (!audioContext) return;
    if (document.hidden) {
      audioContext.suspend().catch(() => {});
    } else if (settings.soundEnabled) {
      audioContext.resume().catch(() => {});
    }
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}

// ========================================
// TEST API — CommonJS export for Jest (no-op in browser)
// ========================================
if (typeof module !== 'undefined' && module.exports) {
  const SUIT_KEYS = { '♥': 'hearts', '♦': 'diamonds', '♣': 'clubs', '♠': 'spades' };
  const SUIT_SYMBOLS = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };

  const FoodDatabase = {
    FOOD_DATA: {
      hearts: DISHES['♥'],
      diamonds: DISHES['♦'],
      clubs: DISHES['♣'],
      spades: DISHES['♠']
    },

    getAllFoods() {
      const foods = [];
      for (const suit of SUITS) {
        DISHES[suit].forEach((foodName, i) => {
          foods.push(this._toFoodItem(SUIT_KEYS[suit], VALUES[i], foodName));
        });
      }
      return foods;
    },

    getFoodByCard(suit, value) {
      const symbol = SUIT_SYMBOLS[suit];
      const index = VALUES.indexOf(value);
      if (!symbol || index === -1) return null;
      return this._toFoodItem(suit, value, DISHES[symbol][index]);
    },

    getRandomCard() {
      const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
      const index = Math.floor(Math.random() * VALUES.length);
      return this._toFoodItem(SUIT_KEYS[suit], VALUES[index], DISHES[suit][index]);
    },

    _toFoodItem(suit, cardValue, foodName) {
      return {
        cardValue,
        suit,
        suitSymbol: SUIT_SYMBOLS[suit],
        suitColor: (suit === 'hearts' || suit === 'diamonds') ? 'red' : 'black',
        foodName
      };
    }
  };

  const HistoryManager = {
    saveToHistory(entry) {
      history.push(entry);
      saveHistory();
    },
    getHistory() {
      return [...history].reverse();
    },
    getRecentHistory(n) {
      return this.getHistory().slice(0, n);
    },
    clearHistory() {
      history = [];
      saveHistory();
    }
  };

  const CardPicker = {
    drawCard() {
      if (isAnimating) return null;
      return { card: FoodDatabase.getRandomCard(), timestamp: Date.now() };
    },
    isDrawing() {
      return isAnimating;
    },
    setDrawingState(state) {
      isAnimating = state === true;
    }
  };

  module.exports = { FoodDatabase, HistoryManager, CardPicker };
}
