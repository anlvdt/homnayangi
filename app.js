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
    'images/pho_bo_1769851159194.png',
    'images/pho_ga.png',
    'images/bun_bo_hue_1769851174568.png',
    'images/bun_cha_1769851878488.png',
    'images/bun_rieu_1769851188904.png',
    'images/bun_dau_mam_tom_1769851860469.png',
    'images/bun_thit_nuong.png',
    'images/hu_tieu_1769851204224.png',
    'images/mi_quang_1769851314324.png',
    'images/bun_ca_1769851333627.png',
    'images/bun_mam_1769851373054.png',
    'images/mien_ga_1769851220414.png',
    'images/mi_xao.png'
  ],
  '♦': [
    'images/com_tam_1769851390923.png',
    'images/com_suon_1769851423572.png',
    'images/com_ga_1769851406663.png',
    'images/com_rang_dua_bo.png',
    'images/com_chien_1769851438643.png',
    'images/com_ca_kho_1769851495798.png',
    'images/com_thit_kho_1769851603858.png',
    'images/com_trung_chien.png',
    'images/canh_chua.png',
    'images/com_vit_1769851588657.png',
    'images/com_nieu_1769851480399.png',
    'images/com_ga_luoc.png',
    'images/com_chay_1769851545278.png'
  ],
  '♣': [
    'images/banh_mi_1769851625130.png',
    'images/banh_cuon_1769851655972.png',
    'images/banh_xeo.png',
    'images/banh_canh_1769851264800.png',
    'images/xoi_xeo.png',
    'images/banh_beo_1769851730342.png',
    'images/banh_khot_1769851670592.png',
    'images/banh_bot_loc_1769851828366.png',
    'images/banh_gio.png',
    'images/xoi_ga.png',
    'images/banh_trang_nuong_1769851778904.png',
    'images/banh_uot_1769851715272.png',
    'images/xoi_man.png'
  ],
  '♠': [
    'images/goi_cuon_1769851929695.png',
    'images/cha_gio_1769851944525.png',
    'images/nem_nuong_1769851901613.png',
    'images/nem_ran.png',
    'images/lau_thai_1769851977079.png',
    'images/chao_ga.png',
    'images/ga_nuong_1769852050721.png',
    'images/hai_san_1769852083065.png',
    'images/bbq_nuong_1769852036308.png',
    'images/oc_cac_loai_1769851960829.png',
    'images/lau_bo_1769851992471.png',
    'images/vit_quay_1769852066805.png',
    'images/ca_kho_to.png'
  ]
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

function loadSettings() {
  const saved = localStorage.getItem('homnayangi_settings');
  if (saved) {
    settings = { ...settings, ...JSON.parse(saved) };
  }
  applySettings();
}

function saveSettings() {
  localStorage.setItem('homnayangi_settings', JSON.stringify(settings));
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

function loadCustomDishes() {
  const saved = localStorage.getItem('homnayangi_custom_dishes');
  if (saved) {
    customDishes = JSON.parse(saved);
  }
}

function saveCustomDishes() {
  localStorage.setItem('homnayangi_custom_dishes', JSON.stringify(customDishes));
}

// ========================================
// FAVORITES & EXCLUDES
// ========================================
function loadFavorites() {
  const saved = localStorage.getItem('homnayangi_favorites');
  if (saved) favorites = JSON.parse(saved);
}

function saveFavorites() {
  localStorage.setItem('homnayangi_favorites', JSON.stringify(favorites));
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
  const saved = localStorage.getItem('homnayangi_excludes');
  if (saved) excludes = JSON.parse(saved);
}

function saveExcludes() {
  localStorage.setItem('homnayangi_excludes', JSON.stringify(excludes));
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
  customDishes.push({
    id: Date.now(),
    name: dish.name,
    pairing: dish.pairing,
    category: dish.category,
    imageUrl: dish.imageUrl || 'images/default.png'
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
      <span class="dish-name">${d.name}</span>
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
  const saved = localStorage.getItem('homnayangi_week_plan');
  if (saved) {
    weekPlan = JSON.parse(saved);
  }
}

function saveWeekPlan() {
  localStorage.setItem('homnayangi_week_plan', JSON.stringify(weekPlan));
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
      <span class="day-dish ${weekPlan[i] ? '' : 'empty'}">${weekPlan[i] || 'Chưa chọn'}</span>
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

function loadHistory() {
  const saved = localStorage.getItem('homnayangi_history');
  if (saved) {
    history = JSON.parse(saved);
  }
}

function saveHistory() {
  // Keep only last 100 items
  if (history.length > 100) {
    history = history.slice(-100);
  }
  localStorage.setItem('homnayangi_history', JSON.stringify(history));
}

function addToHistory(card) {
  history.push({
    dish: card.dish,
    pairing: card.pairing,
    imageUrl: card.imageUrl,
    date: new Date().toISOString()
  });
  saveHistory();
  updateHistoryPanel();
  updateChallengeBadge();
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
        <img src="${h.imageUrl}" alt="${h.dish}" class="history-thumb" onerror="this.style.display='none'">
        <div class="history-info">
          <span class="history-dish">${h.dish}</span>
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
      <span class="stat-dish">${s.dish}</span>
      <span class="stat-count">${s.count} lần</span>
    </div>
  `).join('');
}

// ========================================
// AUDIO - Web Audio API for suspense sounds
// ========================================
function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function playDrumroll(duration = 1500) {
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
  loadCustomDishes();
  loadFavorites();
  loadExcludes();
  createDeck();
  renderDeck(true);
  setupEvents();
  updateHistoryPanel();
  
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
    setTimeout(() => {
      const availableCards = deck.filter((_, i) => !flippedCards.includes(i));
      if (availableCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        if (!flippedCards.includes(randomIndex)) {
          pickCard(randomIndex);
        }
      }
    }, 500);
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
        <img src="${card.imageUrl}" alt="${card.dish}" class="card-thumb" onerror="this.style.display='none'">
        <div class="food">${card.dish}</div>
      </div>
      <div class="corner-br">
        <span class="num">${card.value}</span>
        <span class="suit">${card.suit}</span>
      </div>
    </div>
  `;
}

function updateRemaining() {
  document.getElementById('remaining').textContent = 52 - flippedCards.length;
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

  // Start heartbeat (5 beats for longer suspense)
  playHeartbeat(5);

  // PHASE 1: Lift card up with glow (800ms)
  cardEl.classList.add('picking');
  await sleep(800);

  // PHASE 2: Dramatic shake with drumroll (3000ms = 3 seconds!)
  cardEl.classList.add('shaking');
  playDrumroll(3000);
  // Vibrate pattern during shake
  if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100, 50, 100, 50, 100]);
  await sleep(3000);

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
        <img src="${card.imageUrl}" alt="${card.dish}" loading="lazy" onerror="this.style.display='none'">
      </div>
      <div class="image-disclaimer">Hình ảnh mang tính chất minh họa</div>
      <div class="card-content">
        <div class="food-name">${card.dish}</div>
        <div class="food-pairing">Ăn kèm: ${card.pairing}</div>
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
  document.getElementById('singleMode').classList.toggle('active', !multi);
  document.getElementById('multiMode').classList.toggle('active', multi);

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
      <img src="${r.imageUrl}" alt="${r.dish}" class="result-thumb">
      <div class="result-info">
        <span class="result-player">${playerNames[r.player - 1] || 'Người chơi ' + r.player}</span>
        <span class="result-dish">${r.dish}</span>
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

  // Play sound
  if (settings.soundEnabled) playDrumroll(3000);

  // Random spin: 5-7 full rotations + random final position (longer spin)
  const totalRotation = (5 + Math.random() * 2) * 2 * Math.PI;
  const winnerIndex = Math.floor(Math.random() * wheelDishes.length);
  const sliceAngle = (2 * Math.PI) / wheelDishes.length;

  // Calculate final angle to land on winner (pointer at top = -PI/2)
  const targetAngle = -Math.PI / 2 - (winnerIndex * sliceAngle) - sliceAngle / 2;
  const finalAngle = wheelAngle + totalRotation + (targetAngle - (wheelAngle % (2 * Math.PI)));

  const startAngle = wheelAngle;
  const duration = 6000; // 6 seconds for slower spin
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
      if (settings.soundEnabled) playReveal();

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
}

document.addEventListener('DOMContentLoaded', init);
