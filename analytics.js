/* Website analytics: no Google requests or analytics storage before opt-in. */
(() => {
  'use strict';
  const measurementId = document.querySelector('meta[name="ga-measurement-id"]')?.content;
  if (!/^G-[A-Z0-9]+$/.test(measurementId || '')) return;
  const storageKey = 'aalert-website-analytics-v1';
  const maxAge = 180 * 24 * 60 * 60 * 1000;
  const production = ['aangiftealert.nl', 'www.aangiftealert.nl'].includes(location.hostname);
  let enabled = false;
  let choice = readChoice();
  let restoreFocus;

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      return saved && ['accepted', 'rejected'].includes(saved.value) &&
        Number.isFinite(saved.at) && saved.at <= Date.now() && Date.now() - saved.at < maxAge ? saved.value : null;
    } catch { return null; }
  }

  function cleanReferrer() {
    try { return new URL(document.referrer).origin + '/'; } catch { return ''; }
  }

  function startAnalytics() {
    if (enabled || !production) return;
    enabled = true;
    window['ga-disable-' + measurementId] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    const config = {
      send_page_view: false,
      page_location: location.origin + location.pathname,
      page_referrer: cleanReferrer(),
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 180 * 24 * 60 * 60,
      cookie_update: false,
    };
    // Campaign names are optional; reject free text, emails and arbitrary URL data.
    const params = new URLSearchParams(location.search);
    for (const [parameter, field] of [['utm_source', 'campaign_source'], ['utm_medium', 'campaign_medium'], ['utm_campaign', 'campaign_name']]) {
      const value = params.get(parameter);
      if (value && /^[a-zA-Z][a-zA-Z0-9_-]{0,79}$/.test(value)) config[field] = value;
    }
    if (params.get('analytics_test') === '1') {
      config.debug_mode = true;
      config.traffic_type = 'internal';
    }
    window.gtag('config', measurementId, config);
    window.gtag('event', 'page_view', { page_title: document.title });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    script.id = 'aalert-google-tag';
    document.head.appendChild(script);
  }

  function clearAnalyticsCookies() {
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (name !== '_ga' && !name.startsWith('_ga_')) continue;
      for (const domain of ['', location.hostname, '.' + location.hostname, 'aangiftealert.nl', '.aangiftealert.nl']) {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
      }
    }
  }

  function choose(value) {
    choice = value;
    try { localStorage.setItem(storageKey, JSON.stringify({ value, at: Date.now() })); } catch { /* Choice applies to this page. */ }
    banner.hidden = true;
    if (value === 'accepted') startAnalytics();
    else {
      window['ga-disable-' + measurementId] = true;
      clearAnalyticsCookies();
      // Unload the SDK too, so withdrawal stops subsequent requests on this page.
      if (enabled) { location.reload(); return; }
    }
    restoreFocus?.focus();
  }

  const banner = document.createElement('section');
  banner.className = 'analytics-consent';
  banner.setAttribute('aria-labelledby', 'analytics-consent-title');
  banner.hidden = true;
  banner.innerHTML = '<div class="analytics-consent-copy"><h2 id="analytics-consent-title" tabindex="-1">Help je ons de website verbeteren?</h2>' +
    '<p>Met jouw toestemming meet Google Analytics bezoeken, herkomst en klikken naar de App Store. Google ontvangt technische bezoekgegevens en gebruikt analytische cookies. Je kunt weigeren of je keuze later aanpassen. <a href="/privacy/#website">Meer over je privacy</a>.</p></div>' +
    '<div class="analytics-consent-actions"><button type="button" data-consent="rejected">Weigeren</button><button type="button" data-consent="accepted">Toestaan</button></div>';
  banner.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-consent]');
    if (button) choose(button.dataset.consent);
  });
  document.body.appendChild(banner);

  const settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'analytics-settings';
  settings.textContent = 'Cookie-instellingen';
  settings.addEventListener('click', () => {
    restoreFocus = settings;
    banner.hidden = false;
    banner.querySelector('h2').focus();
  });
  (document.querySelector('footer .wrap') || document.querySelector('footer') || document.body).appendChild(settings);

  document.addEventListener('click', (event) => {
    if (!enabled || choice !== 'accepted') return;
    const link = event.target.closest('a[href]');
    if (!link) return;
    let url;
    try { url = new URL(link.href); } catch { return; }
    if (url.hostname !== 'apps.apple.com' || !url.pathname.endsWith('/id6819453752')) return;
    const section = link.closest('section, article');
    window.gtag('event', 'app_store_click', {
      link_url: url.origin + url.pathname,
      placement: section?.id || section?.getAttribute('aria-labelledby') || 'page',
      transport_type: 'beacon',
    });
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== storageKey) return;
    const updated = readChoice();
    if (updated !== choice) location.reload();
  });
  if (choice === 'accepted') startAnalytics();
  else {
    window['ga-disable-' + measurementId] = true;
    clearAnalyticsCookies();
    banner.hidden = choice === 'rejected';
  }
})();
