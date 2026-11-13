// IAPI base script (progressive enhancement)
(function () {
  const LANG_KEY = 'iapi-lang';
  const CONSENT_KEY = 'iapi-consent';

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
      <div class="cookie-inner card" role="dialog" aria-label="Preferencias de cookies" aria-modal="false">
        <p style="margin:.2rem 0 .6rem;"><strong>Cookies y privacidad</strong></p>
        <p style="margin:0 0 .8rem;color:var(--color-text-muted);font-size:.95rem;">Usamos almacenamiento esencial (como idioma). Contenido de terceros (mapas/YouTube) solo se carga cuando tú lo solicitas. Puedes aceptar o rechazar opciones no esenciales.</p>
        <div style="display:flex;flex-wrap:wrap;gap:.5rem;">
          <button class="btn btn-primary" data-consent="accept">Aceptar</button>
          <button class="btn btn-secondary" data-consent="reject">Rechazar</button>
          <a class="btn btn-secondary" href="/cookies/">Preferencias</a>
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
  }

  let i18nCache = {};
  async function loadI18n(lang) {
    if (!lang) lang = document.documentElement.lang || 'es';
    if (i18nCache[lang]) return i18nCache[lang];
    try {
      const r = await fetch('/content/i18n/' + lang + '.json', { cache: 'no-store' });
      if (!r.ok) throw new Error('i18n');
      i18nCache[lang] = await r.json();
      return i18nCache[lang];
    } catch { return null; }
  }
  function getByPath(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : null), obj);
  }
  async function applyTranslations(lang) {
    lang = lang || document.documentElement.lang || 'es';
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

  function setupLangToggle() {
    const btn = document.getElementById('langToggle');
    async function setLang(lang) {
      document.documentElement.lang = lang;
      if (btn) btn.textContent = lang === 'en' ? 'ES' : 'EN';
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
      await applyTranslations(lang);
    }
    if (btn) {
      btn.addEventListener('click', function () {
        const isEs = document.documentElement.lang === 'es';
        setLang(isEs ? 'en' : 'es');
      });
    }
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'en' || saved === 'es') {
        document.documentElement.lang = saved;
        if (btn) btn.textContent = saved === 'en' ? 'ES' : 'EN';
      }
    } catch (e) {}
    applyTranslations(document.documentElement.lang || 'es');
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
      // If this month's first Sunday has passed (end of day), move on
      const endOfDay = new Date(firstSunday); endOfDay.setHours(23,59,59,999);
      if (endOfDay >= tzNow) {
        // Months since 2026-10 (Nov 2026 index) where Nov 2026 => Santa Cena
        const monthsSinceNov2026 = (y - 2026) * 12 + (m - 10);
        const isSantaCena = (monthsSinceNov2026 % 2 === 0);
        return {
          date: firstSunday,
          type: isSantaCena ? 'Santa Cena' : 'Ayuno',
          detail: isSantaCena ? 'Durante el servicio de 11:00 AM' : 'Aproximadamente 9:00 AM – 5:00 PM'
        };
      }
      m++; if (m > 11) { m = 0; y++; }
    }
    return null;
  }

  function renderNextSpecialSunday() {
    const el = document.getElementById('nextSpecialSunday');
    if (!el) return;
    const next = computeNextSpecialSunday();
    if (!next) return;
    const dateStr = next.date.toLocaleDateString('es-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago' });
    el.innerHTML = `<strong>Próximo primer domingo especial:</strong> ${next.type} · ${dateStr}<br><span style="color:var(--color-text-muted)">${next.detail}</span>`;
  }

  function getNextService() {
    const schedule = [
      { day: 0, hour: 11, minute: 0, label: 'Domingo 11:00 AM · Culto de Enseñanza' },
      { day: 3, hour: 19, minute: 30, label: 'Miércoles 7:30 PM · Culto de Oración' },
      { day: 5, hour: 19, minute: 30, label: 'Viernes 7:30 PM · Culto de Exaltación' }
    ];
    const now = new Date();
    const tzNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
    for (let add = 0; add < 8; add++) {
      const d = new Date(tzNow); d.setDate(d.getDate() + add);
      for (const s of schedule) {
        if (d.getDay() !== s.day) continue;
        const candidate = new Date(d); candidate.setHours(s.hour, s.minute, 0, 0);
        if (candidate > tzNow) return { date: candidate, label: s.label };
      }
    }
    return null;
  }

  function renderNextService() {
    const el = document.getElementById('nextService');
    if (!el) return;
    function tick() {
      const next = getNextService();
      if (!next) return;
      const diff = next.date - new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }));
      const totalMin = Math.max(0, Math.floor(diff / 60000));
      const days = Math.floor(totalMin / (60*24));
      const hours = Math.floor((totalMin % (60*24)) / 60);
      const mins = totalMin % 60;
      const parts = [];
      if (days) parts.push(days + 'd');
      parts.push(hours + 'h', mins + 'm');
      el.innerHTML = `<strong>Próximo servicio:</strong> ${next.label}<br><span style="color:var(--color-text-muted)">Comienza en ${parts.join(' ')}</span>`;
    }
    tick();
    setInterval(tick, 60000);
  }

  async function renderHomeExtras() {
    // Verse of week
    const verseEl = document.getElementById('verseOfWeek');
    if (verseEl) {
      try {
        const r = await fetch('/content/site.json'); const site = await r.json();
        const v = site.verseOfWeek || {};
        verseEl.innerHTML = `<p class="eyebrow">Versículo de la semana</p><blockquote style="margin:0;font-size:1.25rem;line-height:1.5;">“${v.text_es || ''}”</blockquote><p style="margin-top:.5rem;color:var(--color-text-muted);"><strong>${v.ref_es || ''}</strong></p>`;
      } catch {}
    }
    // Latest sermon
    const sermonEl = document.getElementById('latestSermon');
    if (sermonEl) {
      try {
        const r = await fetch('/.netlify/functions/sermons'); if(!r.ok) throw new Error();
        const d = await r.json(); const item = (d.items||[])[0];
        if (item) sermonEl.innerHTML = `<p class="eyebrow">Último mensaje</p><h3 style="font-size:1.6rem;">${item.title}</h3><p><a class="btn btn-secondary" href="${item.link}" target="_blank" rel="noopener">Ver mensaje</a></p>`;
        else throw new Error();
      } catch {
        sermonEl.innerHTML = `<p class="eyebrow">Último mensaje</p><p><a href="https://www.youtube.com/aypirving" target="_blank" rel="noopener">Ver canal de YouTube</a></p>`;
      }
    }
    // Upcoming events
    const eventsEl = document.getElementById('homeEvents');
    if (eventsEl) {
      try {
        const r = await fetch('/content/events.json', { cache: 'no-store' }); const d = await r.json();
        const items = (d.events||[]).slice(0,3);
        if (!items.length) eventsEl.innerHTML = `<p class="eyebrow">Eventos</p><h3>Próximamente</h3><p><a href="/eventos/">Ver eventos</a></p>`;
        else eventsEl.innerHTML = `<p class="eyebrow">Eventos</p>` + items.map(ev=>`<div style="margin:.6rem 0;"><strong>${ev.title_es||ev.title||''}</strong><div style="color:var(--color-text-muted);font-size:.95rem;">${ev.date||''}${ev.time?(' · '+ev.time):''}</div></div>`).join('') + `<p style="margin-top:.5rem;"><a href="/eventos/">Ver todos</a></p>`;
      } catch (e) {
        eventsEl.innerHTML = `<p class="eyebrow">Eventos</p><p><a href="/eventos/">Ver eventos</a></p>`;
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
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }));
  }

  function enhanceHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const inner = header.querySelector('.header-inner');
    if (!inner) return;
    // Add actions container if missing
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
      visit.textContent = 'Planifica tu visita';
      actions.insertBefore(visit, actions.firstChild);
    }
    if (!document.getElementById('langToggle')) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'btn btn-primary'; b.id = 'langToggle';
      b.setAttribute('aria-label', 'Cambiar idioma / Switch language');
      b.textContent = (document.documentElement.lang === 'en') ? 'ES' : 'EN';
      actions.appendChild(b);
    }
    // Mobile nav
    if (!document.getElementById('mobileNav')) {
      const nav = document.createElement('nav');
      nav.id = 'mobileNav';
      nav.className = 'mobile-nav';
      nav.setAttribute('aria-label', 'Menú móvil');
      nav.innerHTML = `<div class="container">
        <a href="/">Inicio</a>
        <a href="/planifica-tu-visita/">Planifica tu visita</a>
        <a href="/nosotros/">Nosotros</a>
        <a href="/ministerios/">Ministerios</a>
        <a href="/ver/">Ver</a>
        <a href="/eventos/">Eventos</a>
        <a href="/anuncios/">Anuncios</a>
        <a href="/dar/">Dar</a>
        <a href="/oracion/">Oración</a>
        <a href="/contacto/">Contacto</a>
      </div>`;
      header.appendChild(nav);
    }
    if (!document.getElementById('menuBtn')) {
      const menuBtn = document.createElement('button');
      menuBtn.type = 'button';
      menuBtn.className = 'menu-btn';
      menuBtn.id = 'menuBtn';
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-controls', 'mobileNav');
      menuBtn.textContent = 'Menú';
      actions.appendChild(menuBtn);
    }
  }

  function isLiveNowChicago() {
    // Configurable windows (America/Chicago): Sunday 11:00 AM service and Friday 7:30 PM service.
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(now);
    const get = (t) => parts.find(p => p.type === t)?.value;
    const weekday = get('weekday'); // Sun, Mon, ...
    const hour = parseInt(get('hour') || '0', 10);
    const minute = parseInt(get('minute') || '0', 10);
    const mins = hour * 60 + minute;
    // Sunday 11:00 AM ~ 1:30 PM
    if (weekday === 'Sun' && mins >= (11*60) && mins <= (13*60+30)) return true;
    // Friday 7:30 PM ~ 9:30 PM
    if (weekday === 'Fri' && mins >= (19*60+30) && mins <= (21*60+30)) return true;
    return false;
  }

  function renderLiveBanner() {
    const existing = document.getElementById('liveBanner');
    const live = isLiveNowChicago();
    if (!live) { if (existing) existing.remove(); return; }
    if (existing) return;
    const banner = document.createElement('div');
    banner.id = 'liveBanner';
    banner.className = 'live-banner';
    banner.innerHTML = `<div class="container" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.6rem 0;">
      <span><strong>Estamos en vivo</strong> · Acompáñanos ahora</span>
      <a class="btn btn-primary" href="/ver/" style="padding:.45rem .8rem;font-size:.9rem;">Ver</a>
    </div>`;
    document.body.insertAdjacentElement('afterbegin', banner);
  }

  function ensureMobileBar() {
    if (document.querySelector('.mobile-bar')) return;
    const bar = document.createElement('div');
    bar.className = 'mobile-bar';
    bar.setAttribute('aria-label', 'Acciones rápidas');
    bar.innerHTML = `
      <a class="btn btn-primary" href="https://www.google.com/maps/dir/?api=1&destination=530+N+O%27Connor+Rd%2C+Irving%2C+TX+75061" target="_blank" rel="noopener">Cómo llegar</a>
      <a class="btn btn-primary" href="tel:+19039980338">Llamar</a>`;
    document.body.appendChild(bar);
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
      const location = '530 N O\'Connor Rd, Irving, TX 75061';
      // Create next occurrence in America/Chicago by approximating with local conversion
      const now = new Date();
      // Simple next-occurrence helper using Chicago local time components via Intl not trivial for constructing; use heuristic:
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

  document.addEventListener('DOMContentLoaded', function () {
    enhanceHeader();
    ensureMobileBar();
    setupLangToggle();
    injectCookieBanner();
    setupCookieSettingsLinks();
    setupMobileMenu();
    setupICSButtons();
    renderNextSpecialSunday();
    renderNextService();
    renderHomeExtras();
    renderLiveBanner();
    setInterval(renderLiveBanner, 60000);
  });
})();
