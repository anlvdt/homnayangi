"""Run the complete dining flow in an isolated local browser/server."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

server = ThreadingHTTPServer(('127.0.0.1', 0), QuietHandler)
Thread(target=server.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{server.server_port}/'
artifacts = Path('/tmp/homnayangi-dining')
artifacts.mkdir(exist_ok=True)
try:
 with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width':390,'height':844}, reduced_motion='reduce')
    errors=[]
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.add_init_script("localStorage.setItem('homnayangi_onboarded','true')")
    page.goto(url); page.wait_for_load_state('networkidle')
    for width,height in [(320,700),(390,844),(844,390),(790,1000),(1440,900),(1920,1080)]:
        page.set_viewport_size({'width':width,'height':height})
        assert page.evaluate('document.documentElement.scrollWidth') <= width
        assert page.locator('#quickPickBtn, .play-modes .mode-pill').count() == 8
    page.set_viewport_size({'width':390,'height':844})
    page.screenshot(path=str(artifacts/'home.png'),full_page=True)
    page.locator('#preferencesToggle').click()
    page.select_option('#cityFilter','hoian')
    page.locator('#preferencesToggle').click()
    assert page.locator('#cityFilter').input_value() == 'hoian'
    page.locator('#preferencesToggle').click(); page.select_option('#cityFilter','all'); page.locator('#preferencesToggle').click()
    for method, action in [('quickPickBtn','.card:not(.flipped)'),('wheelBtn','#spinWheelBtn'),('reelBtn','#spinReelBtn'),('vesoBtn','#revealScratchBtn'),('xamBtn','#shakeXamBtn'),('hoaBtn','.hoa-flower'),('battleBtn','#battleCardA'),('mamBtn','#rollMamBtn')]:
        if method != 'quickPickBtn':
            page.evaluate('''() => {
              const panel = document.getElementById('moreMethodsPanel');
              const btn = document.getElementById('moreMethodsSummary');
              if (panel) panel.hidden = false;
              btn?.setAttribute('aria-expanded', 'true');
              btn?.classList.add('is-open');
            }''')
        page.locator('#'+method).click()
        if method == 'battleBtn':
            for _ in range(7): page.locator(action).click()
        else:
            page.locator(action).first.click()
        if method == 'mamBtn': page.locator('[data-serve-course]').first.click()
        page.locator('#modal.show').wait_for(timeout=15000)
        assert page.locator('#orderOptions').is_hidden()
        assert page.locator('.wheel-modal.show, .reel-modal.show, .battle-modal.show, .mam-modal.show, .xam-modal.show, .hoa-modal.show, .veso-modal.show').count() == 0
        name=page.locator('#resultCard .food-name').inner_text()
        page.locator('#orderDishBtn').click()
        assert page.locator('#orderOptions').is_visible()
        assert page.locator('#orderHeading').evaluate('(el)=>el===document.activeElement')
        from urllib.parse import unquote
        assert name in unquote(page.locator('#linkShopee').get_attribute('href'))
        assert page.locator('#linkGrab').get_attribute('target') == '_blank'
        page.locator('#closeBtn').click()
        if method == 'quickPickBtn':
            assert not page.locator('body').evaluate('(el)=>el.classList.contains("choosing-method")')
            assert page.locator('#modal').evaluate('(el)=>!el.classList.contains("show")')
            page.locator('#backToMethodsBtn').click()
        else:
            assert page.locator('body').evaluate('(el)=>el.classList.contains("choosing-method")')
            assert page.locator('#modal').evaluate('(el)=>!el.classList.contains("show")')
    # Cancellation invalidates timers and cannot reopen an abandoned result.
    page.evaluate('''() => {
      const panel = document.getElementById('moreMethodsPanel');
      const btn = document.getElementById('moreMethodsSummary');
      if (panel) panel.hidden = false;
      btn?.setAttribute('aria-expanded', 'true');
      btn?.classList.add('is-open');
    }''')
    page.locator('#wheelBtn').click(); page.locator('#spinWheelBtn').click(); page.keyboard.press('Escape'); page.wait_for_timeout(1800)
    assert not page.locator('#modal').evaluate('(el)=>el.classList.contains("show")')
    page.evaluate('showResult(deck.find(card=>card.imageUrl))'); page.wait_for_timeout(300)
    page.screenshot(path=str(artifacts/'result.png'))
    page.locator('#orderDishBtn').click(); page.screenshot(path=str(artifacts/'order.png'))
    page.keyboard.press('Escape')
    page.evaluate('document.body.classList.add("dark-mode")'); page.screenshot(path=str(artifacts/'dark.png'),full_page=True)
    page.evaluate('document.body.classList.remove("dark-mode")')
    page.set_viewport_size({'width':1440,'height':900}); page.screenshot(path=str(artifacts/'desktop.png'),full_page=True)
    # Text enlargement and short screens keep the return action reachable.
    page.set_viewport_size({'width':320,'height':568}); page.evaluate('document.documentElement.style.fontSize="150%"; showResult(deck[0])')
    page.locator('#orderDishBtn').click(); page.locator('#closeBtn').click()
    assert not errors, errors
    browser.close()
finally: server.shutdown()
print('Dining flow: 8 methods, ordering, return, cancellation, responsive and keyboard checks passed')
