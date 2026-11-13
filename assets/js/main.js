// IAPI base script (progressive enhancement)
(function () {
  const LANG_KEY = 'iapi-lang';
  const CONSENT_KEY = 'iapi-consent';

  let i18nCache = {};
  let siteCache = null;

  function getLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'es';
  }

  async function loadI18n(lang) {
    lang = lang || getLang();
    if (i18nCache[lang]) return i18nCache[lang];
    try {
      const r = await fetch('/content/i18n/' + lang + '.json', { cache: 'no-store' });
      if (!r.ok) throw new Error('i18n');
      i18nCache[lang] = await r.json();
      return i18nCache[lang];
    } catch { return null; }
  }

  function getByPath(obj, path) {
    return path && obj ? path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), obj) : null;
  }

  async function t(path, fallback) {
    const dict = await loadI18n(getLang());
    const v = getByPath(dict, path);
    return (typeof v === 'string') ? v : (fallback || '');
  }

  async function loadSite() {
    if (siteCache) return siteCache;
    try {
      const r = await fetch('/content/site.json', { cache: 'no-store' });
      siteCache = await r.json();
      return siteCache;
    } catch { return null; }
  }

  async function applyTranslations(lang) {
    lang = lang || getLang();
    const dict = await loadI18n(lang);
    if (!dict) return;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = getByPath(dict, key);
      if (typeof val === 'string') el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = getByPath(dict, key);
      if (typeof val === 'string') el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = getByPath(dict, key);
      if (typeof val === 'string') el.setAttribute('placeholder', val);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const val = getByPath(dict, key);
      if (typeof val === 'string') el.setAttribute('aria-label', val);
    });
  }

  async function refreshDynamicContent() {
    await applyTranslations(getLang());
    renderLiveBanner();
    renderNextSpecialSunday();
    renderNextService();
    renderHomeExtras();
    renderCookieBannerText();
    try { window.dispatchEvent(new CustomEvent('iapi:langchange', { detail: { lang: getLang() } })); } catch {}
  }

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null'); } catch { return null; }
  }
  function setConsent(val) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(val)); } catch {}
  }

  function injectCookieBanner() {
    if (document.getElementById('cookieBanner')) return;
    const consent = getConsent();
    const wrap = document.createElement('div');
    wrap.id = 'cookieBanner';
    wrap.innerHTML = `
      <div class="cookie-inner card" role="dialog" aria-modal="false">
        <p style="margin:.2rem 0 .6rem;"><strong data-cookie-title>Cookies y privacidad</strong></p>
        <p style="margin:0 0 .8rem;color:var(--color-text-muted);font-size:.95rem;" data-cookie-text>Usamos almacenamiento esencial (como idioma). Contenido de terceros (mapas/YouTube) solo se carga cuando tú lo solicitas. Puedes aceptar o rechazar opciones no esenciales.</p>
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;">
          <button class="btn btn-primary" data-consent="accept" data-cookie-accept>Aceptar</button>
          <button class="btn btn-secondary" data-consent="reject" data-cookie-reject>Rechazar</button>
          <a class="btn btn-secondary" href="/cookies/" data-cookie-prefs>Preferencias</a>
        </div>
      </div>`;
    const style = document.createElement('style');
    style.textContent = `#cookieBanner{position:fixed;left:1rem;right:1rem;bottom:5.5rem;z-index:80;display:${consent?'none':'block'}} #cookieBanner .cookie-inner{max-width:860px;margin:0 auto;background:rgba(4,14,30,.98);backdrop-filter:blur(10px)} @media(max-width:900px){#cookieBanner{bottom:6.5rem}}`;
    document.head.appendChild(style);
    document.body.appendChild(wrap);
    wrap.addEventListener('click', (e) => {
      const b = e.target.closest('[data-consent]');
      if (!b) return;
      const choice = b.getAttribute('data-consent');
      setConsent({ essential: true, analytics: false, embeds: choice === 'accept', ts: Date.now(), choice });
      wrap.style.display = 'none';
    });
    if (consent) wrap.style.display = 'none';
    renderCookieBannerText();
  }

  async function renderCookieBannerText() {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;
    const dict = await loadI18n(getLang());
    const c = (dict && dict.cookieBanner) || {};
    const inner = banner.querySelector('.cookie-inner');
    if (inner && c.aria) inner.setAttribute('aria-label', c.aria);
    const t = banner.querySelector('[data-cookie-title]'); if (t && c.title) t.textContent = c.title;
    const tx = banner.querySelector('[data-cookie-text]'); if (tx && c.text) tx.textContent = c.text;
    const a = banner.querySelector('[data-cookie-accept]'); if (a && c.accept) a.textContent = c.accept;
    const r = banner.querySelector('[data-cookie-reject]'); if (r && c.reject) r.textContent = c.reject;
    const p = banner.querySelector('[data-cookie-prefs]'); if (p && c.preferences) p.textContent = c.preferences;
  }

  function setupLangToggle() {
    const btn = document.getElementById('langToggle');
    async function setLang(lang) {
      document.documentElement.lang = lang;
      if (btn) btn.textContent = lang === 'en' ? 'ES' : 'EN';
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
      await refreshDynamicContent();
    }
    if (btn) {
      btn.addEventListener('click', function () {
        const isEs = getLang() === 'es';
        setLang(isEs ? 'en' : 'es');
      });
    }
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'en' || saved === 'es') {
        document.documentElement.lang = saved;
      } else {
        document.documentElement.lang = 'es'; // default Spanish
      }
    } catch (e) {
      document.documentElement.lang = document.documentElement.lang || 'es';
    }
    if (btn) btn.textContent = getLang() === 'en' ? 'ES' : 'EN';
  }

  function computeNextSpecialSunday() {
    // Pattern: first Sunday alternates Santa Cena / Ayuno.
    // Reference: Nov 2026 was Santa Cena, Dec 2026 Ayuno (from site config/spec).
    const now = new Date();
    const tzNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    let y = tzNow.getFullYear();
    let m = tzNow.getMonth(); // 0-based
    for (let i = 0; i < 14; i++) {
      const first = new Date(y, m, 1);
      const offset = (7 - first.getDay()) % 7; // Sunday=0
      const firstSunday = new Date(y, m, 1 + offset);
      const endOfDay = new Date(firstSunday); endOfDay.setHours(23,59,59,999);
      if (endOfDay >= tzNow) {
        const monthsSinceNov2026 = (y - 2026) * 12 + (m - 10);
        const isSantaCena = (monthsSinceNov2026 % 2 === 0);
        return { date: firstSunday, isSantaCena };
      }
      m++; if (m > 11) { m = 0; y++; }
    }
    return null;
  }

  let nextServiceTimer = null;
  function getNextService() {
    const schedule = [
      { day: 0, hour: 11, minute: 0, label_es: 'Domingo 11:00 AM · Culto de Enseñanza', label_en: 'Sunday 11:00 AM · Teaching Service' },
      { day: 3, hour: 19, minute: 30, label_es: 'Miércoles 7:30 PM · Culto de Oración', label_en: 'Wednesday 7:30 PM · Prayer Service' },
      { day: 5, hour: 19, minute: 30, label_es: 'Viernes 7:30 PM · Culto de Exaltación', label_en: 'Friday 7:30 PM · Worship Service' }
    ];
    const now = new Date();
    const tzNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    for (let add = 0; add < 8; add++) {
      const d = new Date(tzNow); d.setDate(d.getDate() + add);
      for (const s of schedule) {
        if (d.getDay() !== s.day) continue;
        const candidate = new Date(d); candidate.setHours(s.hour, s.minute, 0, 0);
        if (candidate > tzNow) return { date: candidate, label: getLang() === 'en' ? s.label_en : s.label_es };
      }
    }
    return null;
  }

  async function renderNextSpecialSunday() {
    const el = document.getElementById('nextSpecialSunday');
    if (!el) return;
    const next = computeNextSpecialSunday();
    if (!next) return;
    const lang = getLang();
    const dict = await loadI18n(lang);
    const d = dict && dict.dynamic ? dict.dynamic : {};
    const type = next.isSantaCena ? (d.santaCena || (lang==='en'?'Communion':'Santa Cena')) : (d.ayuno || (lang==='en'?'Fasting':'Ayuno'));
    const detail = next.isSantaCena ? (d.santaCenaDetail || '') : (d.ayunoDetail || '');
    const label = d.nextSpecialSunday || (lang==='en'?'Next special first Sunday:':'Próximo primer domingo especial:');
    const dateStr = next.date.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago' });
    el.innerHTML = `<strong>${label}</strong> ${type} · ${dateStr}<br><span style="color:var(--color-text-muted)">${detail}</span>`;
  }

  async function renderNextService() {
    const el = document.getElementById('nextService');
    if (!el) return;
    async function tick() {
      const next = getNextService();
      if (!next) return;
      const lang = getLang();
      const dict = await loadI18n(lang);
      const d = dict && dict.dynamic ? dict.dynamic : {};
      const label = d.nextService || (lang==='en'?'Next service:':'Próximo servicio:');
      const starts = d.startsIn || (lang==='en'?'Starts in':'Comienza en');
      const diff = next.date - new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }));
      const totalMin = Math.max(0, Math.floor(diff / 60000));
      const days = Math.floor(totalMin / (60*24));
      const hours = Math.floor((totalMin % (60*24)) / 60);
      const mins = totalMin % 60;
      const parts = [];
      if (days) parts.push(days + 'd');
      parts.push(hours + 'h', mins + 'm');
      el.innerHTML = `<strong>${label}</strong> ${next.label}<br><span style="color:var(--color-text-muted)">${starts} ${parts.join(' ')}</span>`;
    }
    await tick();
    if (nextServiceTimer) clearInterval(nextServiceTimer);
    nextServiceTimer = setInterval(tick, 60000);
  }

  async function renderHomeExtras() {
    const lang = getLang();
    const dict = await loadI18n(lang);
    const site = await loadSite();
    // Verse of week
    const verseEl = document.getElementById('verseOfWeek');
    if (verseEl) {
      try {
        const v = (site && site.verseOfWeek) ? site.verseOfWeek : {};
        const text = lang === 'en' ? (v.text_en || v.text_es || '') : (v.text_es || v.text_en || '');
        const ref = lang === 'en' ? (v.ref_en || v.ref_es || '') : (v.ref_es || v.ref_en || '');
        const label = (dict && dict.dynamic && dict.dynamic.verseOfWeek) || (lang==='en'?'Verse of the week':'Versículo de la semana');
        if (text || ref) {
          verseEl.innerHTML = `<p class="eyebrow">${label}</p><blockquote style="margin:0;font-size:1.2rem;line-height:1.5;">“${text}”</blockquote><p style="margin-top:.5rem;color:var(--color-text-muted);"><strong>${ref}</strong></p>`;
        }
      } catch {}
    }
    // Latest sermon
    const sermonEl = document.getElementById('latestSermon');
    if (sermonEl) {
      const lm = (dict && dict.dynamic && dict.dynamic.latestMessage) || (lang==='en'?'Latest message':'Último mensaje');
      const viewMsg = (dict && dict.home && dict.home.viewMessage) || (lang==='en'?'Watch message':'Ver mensaje');
      const viewChan = (dict && dict.home && dict.home.viewYouTubeChannel) || (lang==='en'?'View YouTube channel':'Ver canal de YouTube');
      try {
        const r = await fetch('/.netlify/functions/sermons'); if(!r.ok) throw new Error();
        const d = await r.json(); const item = (d.items||[])[0];
        if (item) sermonEl.innerHTML = `<p class="eyebrow">${lm}</p><h3 style="font-size:1.6rem;">${item.title}</h3><p><a class="btn btn-secondary" href="${item.link}" target="_blank" rel="noopener">${viewMsg}</a></p>`;
        else throw new Error();
      } catch {
        sermonEl.innerHTML = `<p class="eyebrow">${lm}</p><p><a href="https://www.youtube.com/aypirving" target="_blank" rel="noopener">${viewChan}</a></p>`;
      }
    }
    // Upcoming events
    const eventsEl = document.getElementById('homeEvents');
    if (eventsEl) {
      const evLabel = (dict && dict.dynamic && dict.dynamic.events) || (lang==='en'?'Events':'Eventos');
      const seeAll = (dict && dict.home && dict.home.viewAll) || (dict && dict.common && dict.common.seeAll) || (lang==='en'?'View all':'Ver todos');
      const soon = (dict && dict.dynamic && dict.dynamic.comingSoon) || (lang==='en'?'Coming soon':'Próximamente');
      try {
        const r = await fetch('/content/events.json', { cache: 'no-store' }); const d = await r.json();
        const items = (d.events||[]).slice(0,3);
        if (!items.length) eventsEl.innerHTML = `<p class="eyebrow">${evLabel}</p><h3>${soon}</h3><p><a href="/eventos/">${(dict && dict.home && dict.home.seeEvents) || (lang==='en'?'See events':'Ver eventos')}</a></p>`;
        else eventsEl.innerHTML = `<p class="eyebrow">${evLabel}</p>` + items.map(ev=>{
          const title = lang==='en' ? (ev.title_en || ev.title_es || ev.title || '') : (ev.title_es || ev.title_en || ev.title || '');
          return `<div style="margin:.6rem 0;"><strong>${title}</strong><div style="color:var(--color-text-muted);font-size:.95rem;">${ev.date||''}${ev.time?(' · '+ev.time):''}</div></div>`;
        }).join('') + `<p style="margin-top:.5rem;"><a href="/eventos/">${seeAll}</a></p>`;
      } catch (e) {
        eventsEl.innerHTML = `<p class="eyebrow">${evLabel}</p><p><a href="/eventos/">${(dict && dict.home && dict.home.seeEvents) || (lang==='en'?'See events':'Ver eventos')}</a></p>`;
      }
    }
  }

  function setupCookieSettingsLinks() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href="#cookie-settings"]');
      if (!a) return;
      e.preventDefault();
      const banner = document.getElementById('cookieBanner');
      if (banner) banner.style.display = 'block';
      try { localStorage.removeItem(CONSENT_KEY); } catch {}
    });
  }

  function setupMobileMenu() {
    const btn = document.getElementById('menuBtn');
    const nav = document.getElementById('mobileNav');
    if (!btn || !nav) return;
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }));
  }

  async function enhanceHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const inner = header.querySelector('.header-inner');
    if (!inner) return;
    const lang = getLang();
    const dict = await loadI18n(lang);
    const nav = dict && dict.nav ? dict.nav : {};
    const common = dict && dict.common ? dict.common : {};

    let actions = inner.querySelector('.header-actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'header-actions';
      inner.appendChild(actions);
    }
    if (!inner.querySelector('.visit-cta')) {
      const visit = document.createElement('a');
      visit.className = 'btn btn-primary visit-cta';
      visit.href = '/planifica-tu-visita/';
      visit.textContent = common.planVisit || (lang==='en'?'Plan your visit':'Planifica tu visita');
      actions.insertBefore(visit, actions.firstChild);
    } else {
      inner.querySelector('.visit-cta').textContent = common.planVisit || inner.querySelector('.visit-cta').textContent;
    }
    if (!document.getElementById('langToggle')) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'btn btn-primary'; b.id = 'langToggle';
      b.setAttribute('aria-label', 'Cambiar idioma / Switch language');
      b.textContent = (lang === 'en') ? 'ES' : 'EN';
      actions.appendChild(b);
    } else {
      document.getElementById('langToggle').textContent = (lang === 'en') ? 'ES' : 'EN';
    }

    if (!document.getElementById('mobileNav')) {
      const mnav = document.createElement('nav');
      mnav.id = 'mobileNav';
      mnav.className = 'mobile-nav';
      mnav.setAttribute('aria-label', lang==='en' ? 'Mobile menu' : 'Menú móvil');
      mnav.innerHTML = `<div class="container">
        <a href="/">${nav.home || 'Inicio'}</a>
        <a href="/planifica-tu-visita/">${nav.visit || 'Planifica tu visita'}</a>
        <a href="/nosotros/">${nav.about || 'Nosotros'}</a>
        <a href="/ministerios/">${nav.ministries || 'Ministerios'}</a>
        <a href="/ver/">${nav.watch || 'Ver'}</a>
        <a href="/eventos/">${nav.events || 'Eventos'}</a>
        <a href="/anuncios/">${nav.announcements || 'Anuncios'}</a>
        <a href="/dar/">${nav.give || 'Dar'}</a>
        <a href="/oracion/">${nav.prayer || 'Oración'}</a>
        <a href="/contacto/">${nav.contact || 'Contacto'}</a>
      </div>`;
      header.appendChild(mnav);
    } else {
      const map = {
        '/': nav.home, '/planifica-tu-visita/': nav.visit, '/nosotros/': nav.about, '/ministerios/': nav.ministries,
        '/ver/': nav.watch, '/eventos/': nav.events, '/anuncios/': nav.announcements, '/dar/': nav.give,
        '/oracion/': nav.prayer, '/visita-pastoral/': nav.pastoral, '/contacto/': nav.contact
      };
      document.querySelectorAll('#mobileNav a').forEach(a => {
        const href = a.getAttribute('href');
        if (map[href]) a.textContent = map[href];
      });
      document.getElementById('mobileNav').setAttribute('aria-label', lang==='en' ? 'Mobile menu' : 'Menú móvil');
    }

    if (!document.getElementById('menuBtn')) {
      const menuBtn = document.createElement('button');
      menuBtn.type = 'button';
      menuBtn.className = 'menu-btn';
      menuBtn.id = 'menuBtn';
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-controls', 'mobileNav');
      menuBtn.textContent = common.menu || (lang==='en'?'Menu':'Menú');
      actions.appendChild(menuBtn);
    } else {
      document.getElementById('menuBtn').textContent = common.menu || (lang==='en'?'Menu':'Menú');
    }

    // translate existing desktop nav links by href when present
    const hrefMap = {
      '/': nav.home, '/planifica-tu-visita/': nav.visit, '/nosotros/': nav.about, '/ministerios/': nav.ministries,
      '/ver/': nav.watch, '/eventos/': nav.events, '/anuncios/': nav.announcements, '/dar/': nav.give,
      '/oracion/': nav.prayer, '/contacto/': nav.contact
    };
    document.querySelectorAll('.nav-links a, .brand span').forEach(a => {
      const href = a.getAttribute && a.getAttribute('href');
      if (href && hrefMap[href]) a.textContent = hrefMap[href];
    });

    setupMobileMenu();
  }

  function isLiveNowChicago() {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(now);
    const get = (t) => parts.find(p => p.type === t)?.value;
    const weekday = get('weekday');
    const hour = parseInt(get('hour') || '0', 10);
    const minute = parseInt(get('minute') || '0', 10);
    const mins = hour * 60 + minute;
    if (weekday === 'Sun' && mins >= (11*60) && mins <= (13*60+30)) return true;
    if (weekday === 'Fri' && mins >= (19*60+30) && mins <= (21*60+30)) return true;
    return false;
  }

  async function renderLiveBanner() {
    const existing = document.getElementById('liveBanner');
    const live = isLiveNowChicago();
    if (!live) { if (existing) existing.remove(); return; }
    const lang = getLang();
    const dict = await loadI18n(lang);
    const c = dict && dict.common ? dict.common : {};
    const text = `<strong>${c.liveNow || (lang==='en'?'We are live':'Estamos en vivo')}</strong> · ${c.joinNow || (lang==='en'?'Join us now':'Acompáñanos ahora')}`;
    const watch = c.watch || (lang==='en'?'Watch':'Ver');
    if (existing) {
      existing.innerHTML = `<div class="container" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.6rem 0;"><span>${text}</span><a class="btn btn-primary" href="/ver/" style="padding:.45rem .8rem;font-size:.9rem;">${watch}</a></div>`;
      return;
    }
    const banner = document.createElement('div');
    banner.id = 'liveBanner';
    banner.className = 'live-banner';
    banner.innerHTML = `<div class="container" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.6rem 0;"><span>${text}</span><a class="btn btn-primary" href="/ver/" style="padding:.45rem .8rem;font-size:.9rem;">${watch}</a></div>`;
    document.body.insertAdjacentElement('afterbegin', banner);
  }

  async function ensureMobileBar() {
    let bar = document.querySelector('.mobile-bar');
    const lang = getLang();
    const dict = await loadI18n(lang);
    const c = dict && dict.common ? dict.common : {};
    const html = `
      <a class="btn btn-primary" href="https://www.google.com/maps/dir/?api=1&destination=530+N+O%27Connor+Rd%2C+Irving%2C+TX+75061" target="_blank" rel="noopener">${c.directions || (lang==='en'?'Directions':'Cómo llegar')}</a>
      <a class="btn btn-primary" href="tel:+19039980338">${c.call || (lang==='en'?'Call':'Llamar')}</a>`;
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'mobile-bar';
      bar.setAttribute('aria-label', c.quickActions || (lang==='en'?'Quick actions':'Acciones rápidas'));
      bar.innerHTML = html;
      document.body.appendChild(bar);
    } else {
      bar.innerHTML = html;
      bar.setAttribute('aria-label', c.quickActions || bar.getAttribute('aria-label') || '');
    }
  }

  function downloadICS({ title, description, location, start, durationMinutes, filename }) {
    const pad = (n) => String(n).padStart(2, '0');
    const fmt = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
    const end = new Date(start.getTime() + durationMinutes * 60000);
    const ics = [
      'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//IAPI Irving//Website//ES','BEGIN:VEVENT',
      `UID:${Date.now()}-${Math.random().toString(16).slice(2)}@iglesiaiapirving`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${(title||'').replace(/\n/g,' ')}`,
      `DESCRIPTION:${(description||'').replace(/\n/g,'\\n')}`,
      `LOCATION:${(location||'').replace(/\n/g,' ')}`,
      'END:VEVENT','END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename || 'iapi-event.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  }

  function setupICSButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-ics]');
      if (!btn) return;
      e.preventDefault();
      const type = btn.getAttribute('data-ics');
      const location = "530 N O'Connor Rd, Irving, TX 75061";
      function nextWeekly(day, hour, minute) {
        const d = new Date();
        for (let i=0;i<8;i++){
          const c = new Date(d.getFullYear(), d.getMonth(), d.getDate()+i, hour, minute, 0);
          if (c.getDay()===day && c>new Date()) return c;
        }
        return new Date();
      }
      if (type === 'domingo') downloadICS({ title:'Culto de Enseñanza - IAPI Irving', description:'Servicio dominical en español.', location, start: nextWeekly(0,11,0), durationMinutes:150, filename:'iapi-domingo.ics' });
      if (type === 'miercoles') downloadICS({ title:'Culto de Oración - IAPI Irving', description:'Servicio de oración en español.', location, start: nextWeekly(3,19,30), durationMinutes:90, filename:'iapi-miercoles.ics' });
      if (type === 'viernes') downloadICS({ title:'Culto de Exaltación - IAPI Irving', description:'Servicio de exaltación en español.', location, start: nextWeekly(5,19,30), durationMinutes:120, filename:'iapi-viernes.ics' });
    });
  }

  document.addEventListener('DOMContentLoaded', async function () {
    enhanceHeader();
    ensureMobileBar();
    setupLangToggle();
    injectCookieBanner();
    setupCookieSettingsLinks();
    setupMobileMenu();
    setupICSButtons();
    await refreshDynamicContent();
    setInterval(() => { if (isLiveNowChicago() || document.getElementById('liveBanner')) renderLiveBanner(); }, 60000);
  });
})();