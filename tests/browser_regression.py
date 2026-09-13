"""Targeted real-browser regression checks. Run with local server on :4173.

Requires `pip install playwright` and `playwright install chromium`.
"""
import os
from pathlib import Path

from PIL import Image, ImageChops, ImageStat
from playwright.sync_api import sync_playwright

URL = os.environ.get('APP_URL', 'http://127.0.0.1:4173/')
BASELINE_DIR = Path(__file__).parent / 'visual-baselines'
UPDATE_BASELINES = os.environ.get('UPDATE_VISUAL_BASELINES') == '1'


def check_visual(page, name):
    """Compare stable viewport screenshots while tolerating tiny font raster differences."""
    actual_path = Path('/tmp') / f'homnayangi-{name}.png'
    baseline_path = BASELINE_DIR / f'{name}.png'
    page.screenshot(path=str(actual_path), full_page=False, animations='disabled')
    if UPDATE_BASELINES:
        BASELINE_DIR.mkdir(exist_ok=True)
        baseline_path.write_bytes(actual_path.read_bytes())
        return
    assert baseline_path.exists(), f'Missing visual baseline: {baseline_path}'
    actual = Image.open(actual_path).convert('RGB')
    expected = Image.open(baseline_path).convert('RGB')
    assert actual.size == expected.size, (name, actual.size, expected.size)
    diff = ImageChops.difference(actual, expected)
    mean_delta = sum(ImageStat.Stat(diff).mean) / 3
    assert mean_delta < 2.0, f'{name} visual delta too large: {mean_delta:.2f}'

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 390, 'height': 844}, reduced_motion='reduce')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.add_init_script("""(() => {
      localStorage.setItem('homnayangi_onboarded', 'true');
      let seed = 123456789;
      Math.random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
    })()""")
    page.goto(URL)
    page.wait_for_load_state('networkidle')

    # Method chooser is the entry screen; every method must remain reachable.
    for width, height in [(320, 700), (390, 844), (790, 1000), (1920, 1080)]:
        page.set_viewport_size({'width': width, 'height': height})
        page.wait_for_timeout(200)
        layout = page.evaluate('''() => ({
          documentWidth: document.documentElement.scrollWidth,
          methods: document.querySelectorAll('#quickPickBtn, .play-modes .mode-pill').length
        })''')
        assert layout['documentWidth'] <= width, (width, height, layout)
        assert layout['methods'] == 8, layout

    page.set_viewport_size({'width': 390, 'height': 844})
    page.evaluate("document.getElementById('dishOfDayName').textContent = 'Món của hôm nay'")
    # Action icons and compact filters must not regress to clipped glyphs or tiny targets.
    assert page.locator('.pref-chevron').evaluate('(el) => el.getBoundingClientRect().width') == 20
    assert page.locator('.craving-chip').evaluate_all('(els) => els.every(el => el.getBoundingClientRect().height >= 44)')
    assert page.locator('#dishOfDayRerollBtn').evaluate('(el) => el.getBoundingClientRect().height') >= 44
    assert page.locator('button, a.btn').evaluate_all("(els) => els.every(el => !/[↻↗⌄▼▲☰✕×❯]/.test(el.textContent))")
    check_visual(page, 'home-mobile-390x844')
    heading = page.locator('#methodHeading').inner_text()
    assert 'gợi ý' in heading.lower()
    greeting = page.locator('#headerGreeting').inner_text().lower()
    assert 'ăn gì' in greeting or 'lót dạ' in greeting or 'đói' in greeting
    assert page.locator('#dishOfDay').is_visible()
    assert page.locator('#deckHeading h2').inner_text() == 'Chạm một lá để ra món'
    assert page.locator('.play-modes .mode-pill').count() == 8
    mobile_modes = page.locator('.play-modes').evaluate(
        '(el) => ({scrollWidth: el.scrollWidth, clientWidth: el.clientWidth})'
    )
    assert mobile_modes['scrollWidth'] <= mobile_modes['clientWidth'] + 1, mobile_modes

    page.locator('#settingsBtn').click()
    nav = page.locator('.settings-nav')
    assert nav.evaluate('(el) => el.scrollWidth > el.clientWidth')
    check_visual(page, 'settings-mobile-390x844')
    page.locator('.nav-btn[data-section="privacy"]').scroll_into_view_if_needed()
    assert page.locator('.nav-btn[data-section="privacy"]').is_visible()
    page.locator('.nav-btn[data-section="history"]').click()
    assert page.locator('#historyList .empty-state-action').is_visible()
    page.locator('.tab-btn[data-tab="stats"]').click()
    assert page.locator('#statsContent .empty-state-action').is_visible()
    page.locator('.nav-btn[data-section="features"]').click()
    page.locator('#openCustomDishBtn').click()
    page.locator('[data-focus-custom-name]').wait_for(state='visible')
    assert page.locator('[data-focus-custom-name]').is_visible()
    page.locator('[data-focus-custom-name]').click()
    assert page.locator('#customDishName').evaluate('(el) => el === document.activeElement')
    page.locator('#closeCustomDishX').click()
    page.locator('#settingsBtn').click()
    page.locator('.nav-btn[data-section="features"]').click()
    page.locator('#openExcludesBtn').click()
    page.locator('#excludesSearch').fill('mon-khong-ton-tai-xyz')
    assert page.locator('[data-clear-exclude-search]').is_visible()
    page.locator('[data-clear-exclude-search]').click()
    assert page.locator('.exclude-item').count() > 0
    page.locator('#closeExcludesX').click()

    # Enter the card-flip method, then verify the deck and the explicit back path.
    page.locator('#quickPickBtn').click()
    assert not page.locator('body').evaluate('(el) => el.classList.contains("choosing-method")')
    assert page.locator('#backToMethodsBtn').is_visible()
    for width, height in [(320, 700), (390, 844), (790, 1000), (844, 390), (1440, 900), (1920, 1080)]:
        page.set_viewport_size({'width': width, 'height': height})
        page.wait_for_timeout(200)
        layout = page.evaluate('''() => ({
          documentWidth: document.documentElement.scrollWidth,
          cardWidth: document.querySelector('.card').getBoundingClientRect().width,
          headingTop: document.querySelector('.deck-heading').getBoundingClientRect().top,
          areaTop: document.getElementById('deckArea').getBoundingClientRect().top,
          areaClientHeight: document.getElementById('deckArea').clientHeight,
          areaScrollHeight: document.getElementById('deckArea').scrollHeight
        })''')
        assert layout['documentWidth'] <= width, (width, height, layout)
        assert layout['cardWidth'] >= 47.5, (width, height, layout)
        assert layout['headingTop'] >= layout['areaTop'], (width, height, layout)
        if (width, height) == (1920, 1080):
            assert layout['areaScrollHeight'] <= layout['areaClientHeight'] + 2, layout
    page.set_viewport_size({'width': 390, 'height': 844})

    page.locator('#backToMethodsBtn').click()
    assert page.locator('body').evaluate('(el) => el.classList.contains("choosing-method")')
    assert page.locator('#quickPickBtn').is_visible()
    assert page.locator('.play-modes .mode-pill').count() == 8
    page.locator('#quickPickBtn').click()
    assert page.locator('#backToMethodsBtn').is_visible()

    page.locator('#advancedFiltersLabel').click()
    page.select_option('#favFilter', 'fav')
    assert page.locator('[data-reset-filters]').is_visible()
    page.locator('[data-reset-filters]').click()
    assert page.locator('.card').count() > 0
    assert page.locator('#categoryFilter').input_value() == 'all'
    page.select_option('#cityFilter', 'hoian')
    names = page.evaluate('deck.map(card => card.dish)')
    assert 'Bún thịt nướng' in names and 'Bánh bao bánh vạc' in names
    assert 'Phở bò' not in names
    assert page.locator('#dishOfDayName').text_content() in names
    page.select_option('#cityFilter', 'danang')
    names = page.evaluate('deck.map(card => card.dish)')
    assert 'Bún mắm nêm' in names and 'Bánh tráng cuốn thịt heo' in names
    page.select_option('#cityFilter', 'all')

    before = page.evaluate('deck[0].dish')
    page.evaluate('''() => {
      pickCard(0);
      const filter = document.getElementById('categoryFilter');
      filter.value = '♦'; filter.dispatchEvent(new Event('change'));
    }''')
    page.wait_for_timeout(1500)
    result = page.evaluate('''() => ({
      flipped: flippedCards.length, domFlipped: document.querySelectorAll('#deck .card.flipped').length,
      open: document.getElementById('modal').classList.contains('show')
    })''')
    assert result == {'flipped': 0, 'domFlipped': 0, 'open': False}, (before, result)

    state = page.evaluate('''() => {
      favorites = [deck[0].dish]; document.getElementById('favFilter').value = 'fav';
      createDeck(); renderDeck(); const dish = deck[0].dish; toggleFavorite(dish);
      return { favorite: isFavorite(dish), inDeck: deck.some(card => card.dish === dish) };
    }''')
    assert state == {'favorite': False, 'inDeck': False}, state
    if not page.locator('#advancedFilters').evaluate('(el) => el.open'):
        page.locator('#advancedFiltersLabel').click()
    page.select_option('#favFilter', 'all')
    page.select_option('#regionFilter', 'T')
    assert page.locator('#advancedFiltersLabel').inner_text() == 'Lọc thêm · 1'
    assert page.locator('#dishOfDayName').text_content() in page.evaluate('deck.map(card => card.dish)')
    page.select_option('#regionFilter', 'all')

    exclusions = page.evaluate('''() => {
      excludes = getExcludableDishes(); renderDishOfDay();
      const family = pickCourse('B', 'main'); rollMamCom();
      return { daily: getDishOfDay(), family, tray: mamTray };
    }''')
    assert exclusions == {'daily': None, 'family': None, 'tray': None}, exclusions

    page.evaluate('''() => { excludes = []; createDeck(); renderDeck(); showResult(deck[0]); }''')
    assert page.locator('#modal .modal-card').get_attribute('aria-labelledby') == 'modalTitle'
    assert page.locator('#modalTitle').text_content().startswith('Kết quả:')
    page.keyboard.press('Escape')
    page.wait_for_timeout(100)
    assert not page.locator('#modal').evaluate('(el) => el.classList.contains("show")')

    calls = page.evaluate('''async () => {
      currentResult = deck[0]; window.shareCalls = 0;
      Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => true });
      Object.defineProperty(navigator, 'share', {
        configurable: true, value: async () => { shareCalls++; throw new DOMException('cancel', 'AbortError'); }
      });
      await shareResult(); return shareCalls;
    }''')
    assert calls == 1, calls
    assert not errors, errors
    page.close()

    credits = browser.new_page()
    credit_errors = []
    credits.on('pageerror', lambda error: credit_errors.append(str(error)))
    credits.goto(URL + 'images/credits.html')
    credits.locator('#credits article').first.wait_for()
    assert credits.locator('.retired').count() >= 19
    assert credits.locator('#count').inner_text().startswith(
        f"{credits.locator('article:not(.retired)').count()} ảnh Commons đang dùng"
    )
    assert not credit_errors, credit_errors
    credits.close()

    private = browser.new_page()
    private_errors = []
    private.on('pageerror', lambda error: private_errors.append(str(error)))
    private.add_init_script("Object.defineProperty(window, 'localStorage', {get(){ throw new DOMException('blocked', 'SecurityError'); }})")
    private.goto(URL)
    private.wait_for_load_state('networkidle')
    assert not private_errors, private_errors
    private.close()

    offline = browser.new_page()
    offline.add_init_script("localStorage.setItem('homnayangi_onboarded', 'true')")
    offline.goto(URL)
    offline.wait_for_load_state('networkidle')
    offline.evaluate('navigator.serviceWorker.ready')
    offline.reload()
    offline.wait_for_load_state('networkidle')
    assert offline.evaluate('!!navigator.serviceWorker.controller')
    offline.context.set_offline(True)
    offline.evaluate('''() => showResult({
      dish: 'Phở bò', suit: '♥', value: 'A', pairing: 'Quẩy',
      imageUrl: 'images/not-previously-cached.webp', region: 'B', isRed: true
    })''')
    offline.wait_for_timeout(500)
    assert offline.locator('#resultCard .card-image.image-missing').count() == 1
    offline.close()
    browser.close()

print('Browser regression: passed')
