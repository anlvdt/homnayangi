"""Release acceptance: installed engines and offline shell, isolated browser data."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from playwright.sync_api import sync_playwright

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

server = ThreadingHTTPServer(('127.0.0.1', 0), QuietHandler)
Thread(target=server.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{server.server_port}/'
try:
    with sync_playwright() as p:
        for engine in ('chromium', 'webkit', 'firefox'):
            browser = getattr(p, engine).launch()
            context = browser.new_context(viewport={'width':390,'height':844}, reduced_motion='reduce')
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.add_init_script("localStorage.setItem('homnayangi_onboarded','true')")
            page.goto(url)
            page.wait_for_load_state('networkidle')
            assert page.locator('#quickPickBtn, .play-modes .mode-pill').count() == 8
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            page.locator('#preferencesToggle').click()
            page.locator('#preferencesToggle').click()
            page.locator('#wheelBtn').click()
            page.locator('#spinWheelBtn').click()
            page.locator('#modal.show').wait_for(timeout=15000)
            assert page.locator('#resultCard .food-name').inner_text().strip()
            page.locator('#closeBtn').click()
            if engine == 'chromium':
                page.evaluate("navigator.serviceWorker.register('./sw.js')")
                page.evaluate('navigator.serviceWorker.ready')
                page.wait_for_function('navigator.serviceWorker.controller !== null')
                context.set_offline(True)
                page.reload(wait_until='load')
                assert page.locator('#app').is_visible()
                # Query cache miss must fall back to the precached unversioned shell.
                assert page.evaluate("fetch('./app.js?acceptance=uncached').then(r=>r.ok)")
                assert page.evaluate("fetch('./styles.css?acceptance=uncached').then(r=>r.ok)")
                page.goto(url+'offline-route', wait_until='load')
                assert page.locator('#app').is_visible()
                page.locator('#wheelBtn').click()
                page.locator('#spinWheelBtn').click()
                page.locator('#modal.show').wait_for(timeout=15000)
                print('PASS Chromium offline reload, uncached query, navigation fallback, wheel result', flush=True)
            assert not errors, errors
            print(f'PASS {engine}: mobile layout, preferences, wheel, result, close; no page errors', flush=True)
            browser.close()
finally:
    server.shutdown()
