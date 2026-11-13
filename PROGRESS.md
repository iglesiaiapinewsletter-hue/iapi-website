# PROGRESS

## Current status
**Build substantially complete and iterating (2026-11-13):** Dark cinematic IAPI rebuild is live for testing at `https://iapi-test-site.netlify.app/` with repo pushed to `main` (`iglesiaiapinewsletter-hue/iapi-website`). CMS admin works via **GitHub Personal Access Token** (OAuth Worker login deferred; `sveltia-cms-auth-2` runtime env binding issue external). Recent fixes: absolute canonical URLs on site pages, absolute `robots.txt` sitemap and `sitemap.xml` locs, black SVG social/redes icons added to footer and contact, and CSS safeguards to reduce text overlap at small/large viewports. Remaining: complete full bilingual wiring (`data-i18n` coverage + dynamic content), photo placement/content polish, Lighthouse/QA fixes, form email notifications (Web3Forms/Option B later), newsletter, OAuth, and go-live tasks.

**Photo processing:** completed 2026-11-11 — 241 approved photos processed (222 women, 18 events, 1 baptism), originals backed up to `photos-originals/inbox-2026-11-11/`, optimized library in `assets/images/library/`, manifest `content/photos.json` (~1.04GB in → ~108MB out). All approved by user; still apply placement/consent judgment when publishing specific images.

## Done
- [2026-11-11] Read and reviewed `IAPI_website_prompt.md`.
- [2026-11-11] Created `PROGRESS.md`, `TODO.md`, and `PROMPT.md` copy.
- [2026-11-11] Located old/current live site copy at `~/Desktop/Website` (confirmed). User stated preference to replace old site fully.
- [2026-11-11] Identified reusable assets in old copy: `assets/images/logo.png`, `assets/images/pastor.jpg`, `assets/images/congregation.jpg`.
- [2026-11-11] Phase 0 inputs collected and proposal approved (palette, fonts Cormorant Garamond + Source Sans 3, sitemap). Backup created at `~/websites-old/live-site-copy-2026-11-11`.
- [2026-11-11] Initial project scaffold created: folders (`assets/`, `content/`, `netlify/functions`, `admin/`, `scripts/`, photo dirs), `netlify.toml`, `content/site.json`, `content/events.json`, `content/announcements.json`, `content/videos.json`.
- [2026-11-11] Added base implementation starters: `assets/css/main.css` (approved palette/tokens, layout, header/hero/footer/mobile bar, reduced-motion), `content/i18n/es.json` & `en.json` (starter strings), `index.html` (initial Home shell), `assets/js/main.js` (basic lang preference toggle placeholder). Copied reusable assets to `assets/images/` (`logo.png`, `pastor.jpg`, `congregation.jpg`).
- [2026-11-11] Design direction updated to dark, cinematic feel (inspired by Potter's House vibe, not copied); Home reworked with bold hero/split sections. Started local preview server.
- [2026-11-11] Implemented core pages: `planifica-tu-visita`, `nosotros`, `ministerios`, `eventos`, `anuncios` (printable), `ver` (click-to-load live/embed + sermon feed UI/fallback), `dar`, `oracion`, `visita-pastoral`, `servir`, `contacto`, legal pages (`privacidad`, `terminos`, `cookies`, `accesibilidad`), and `404.html`.
- [2026-11-11] Added `netlify/functions/sermons.js` (YouTube RSS, cached headers), `robots.txt`, `sitemap.xml`, `.well-known/security.txt`, `admin/index.html` + `admin/config.yml` scaffold, `package.json`, `scripts/photos.js` scaffold, `README.md`, `ADMIN_GUIDE.md`, `.gitignore`. Local preview server restarted after restart.
- [2026-11-11] Added baseline functionality: JS-injected cookie consent banner/settings link, "next special Sunday" (Santa Cena/Ayuno) calculation on Home, newsletter signup block on Home, legal links in footer.
- [2026-11-11] Enhanced Home: next-service countdown, latest sermon/events/verse-of-week blocks (dynamic fetch with fallbacks), added verse-of-week to `content/site.json`, mobile menu button/nav behavior and persistent header visit CTA on desktop. Updated baptism FAQ wording and removed lawyer-review notes from legal pages per user requests.
- [2026-11-11] Watch page: added forgiving sermon title parser in `assets/js/sermon-title-parser.js` (split on `|`, service type/date detection, ignore trailing `IAPI`) with filter chips by service type and month/year; unmatched titles always shown as-is.
- [2026-11-11] Added site-wide header enhancement + mobile nav injection in `assets/js/main.js` (for pages missing enhanced header elements) and "Estamos en vivo" banner during Sunday/Friday service windows (America/Chicago).
- [2026-11-11] Added mobile quick-action bar injection for pages missing it, `.page-intro` styling, and applied intro backgrounds to main interior pages for more consistent/less flat UI.
- [2026-11-11] Optimized key images with Pillow: generated WebP/responsive variants for `pastor` and `congregation` (480/800/1200/1920) plus fallbacks and `logo.webp`; updated Home/About/CSS references to use optimized assets instead of 10MB originals.
- [2026-11-11] Added ICS "Agregar al calendario" for weekly services, privacy checkboxes to key forms, favicons/web manifest (copied from old assets, updated manifest), and comprehensive `SETUP_GUIDE.md`. Propagated favicon/manifest links across site pages.
- [2026-11-11] Added Home SEO/schema enhancements (OG/canonical/JSON-LD Church), expanded `content/i18n/es.json` and `en.json`, and expanded `admin/config.yml` collections/fields for site settings, events, announcements, and videos.
- [2026-11-11] Completed inbox photo processing: 241 approved photos categorized/optimized into `assets/images/library/` with `content/photos.json` manifest (women/events/baptism). Rotated pastor image assets 90° CCW per user request.
- [2026-11-11] Applied requested UI/content updates: different homepage section background photos (from processed library), increased dark contrast/overlay depth, improved headings/nav tab styling, removed Facebook embed/player language on Watch page (kept link + note that streams are also on Facebook), and updated form/contact email handling to Gmail per user override. Rotated original/source inbox and backup copies 90° CCW (481 files; 1 truncated file error logged: `photos-originals/inbox-2026-11-11/15_aniversario_damas/DSC_0123.jpeg`).
- [2026-11-12] Added GitHub repo `https://github.com/iglesiaiapinewsletter-hue/iapi-website.git` (git initialized locally with `origin` set) and updated `SETUP_GUIDE.md` + `admin/config.yml` to use `iglesiaiapinewsletter-hue/iapi-website`.

## In progress
- **Content/i18n and polish:** full bilingual wiring across pages/components (i18n infrastructure added in `main.js` for `data-i18n*`, but page content not yet fully keyed/translated), photo placement/selection in sections, and responsive QA/Lighthouse follow-up fixes. External tasks deferred by user: form email notifications (Option B later), OAuth Worker login, newsletter provider, domain/go-live.

## Next steps
1. **Design/UI:** continue polishing (reduce “solid color” feel on remaining pages, refine hero/imagery, consistent header+mobile nav on every page, improve typography/layout rhythm).
2. **Content/i18n:** wire full `es.json`/`en.json` content across pages, implement real language toggle/switching and persistence, complete English copy.
3. **Functionality:** add “next service” live indicator/banner rules, add-to-calendar/share for services/events, click-to-load/consent enforcement audit, newsletter provider hookup instructions.
4. **CMS/admin:** complete `admin/config.yml` collections/fields for all editable content, set real GitHub repo + OAuth worker URL, test editorial workflow.
5. **Quality/launch:** implement `npm run photos` pipeline, optimize/compress images (especially `pastor.jpg`/`congregation.jpg`), run Lighthouse (`npm run audit`) and fix to 90+, finalize legal/SEO/schema, Netlify deploy/config, and launch checklist.

## Decisions made
- Follow `IAPI_website_prompt.md` as the master spec (2026-11-11).
- Spanish default with English toggle via static `es.json`/`en.json` (per prompt).
- New build will not touch live site until approved; deploy to a new Netlify site first (per prompt).
- User preference (2026-11-11): "Replace it fully" — no specific keepers from old design/code; rebuild from scratch per prompt (reuse only real content/assets as appropriate).
- YouTube channel ID (2026-11-11): `UCidzfKBmsuv01CCQIQkCofw` (from youtube.com/aypirving).
- FileBrowser videos (2026-11-11): none available now; keep hero video slot built but switched off with photo fallback (per prompt).
- Reusable assets from `~/Desktop/Website` approved for use as appropriate (2026-11-11). User can provide additional photos if needed when requested.
- **Approved (2026-11-11):** Proposed color palette (from `logo.png`), font pairing (Cormorant Garamond headlines + Source Sans 3 body/UI), and sitemap as presented in Phase 0 proposal. Build may proceed.
- **User override (2026-11-11):** Remove volunteer page `/servir/` from the site (even though included in prompt). Removed page, nav/sitemap references.
- **User override (2026-11-11):** Use `apostolesyprofetasirving@gmail.com` for form submissions/notifications (and public contact) instead of Yahoo; docs and site config updated accordingly.

## Open questions
- **Pending user decisions:** (1) do GitHub/Netlify/admin setup now or proceed with requested code changes (different homepage photos per section, more dark contrast, remove Facebook player on Ver but note streaming there, improve headings/tabs)? (2) send all form submissions to `apostolesyprofetasirving@gmail.com` instead of Yahoo? (3) rotate original/source copies in `photos-inbox/` and `photos-originals/` 90° CCW too? (processed library already rotated)
- Which processed photos from `assets/images/library/` should be used where (hero, ministries, events, baptism, etc.)?
- FileBrowser video links / hero video source details? (still none/later)
- Confirm who sees prayer requests (currently private to Yahoo email only per prompt). Any other missing facts/assets?

## File map
- `/IAPI_website_prompt.md`, `/PROMPT.md`, `/PROGRESS.md`, `/TODO.md`, `/README.md`, `/ADMIN_GUIDE.md`, `/SETUP_GUIDE.md`: Spec and project/setup docs.
- `/index.html`: Home page (dark cinematic shell, dynamic sections, schema/OG/meta).
- `/planifica-tu-visita/`, `/nosotros/`, `/ministerios/`, `/ver/`, `/eventos/`, `/anuncios/`, `/dar/`, `/oracion/`, `/visita-pastoral/`, `/contacto/`, `/privacidad/`, `/terminos/`, `/cookies/`, `/accesibilidad/`, `/404.html`: Site pages. (Volunteer `/servir/` removed per user request 2026-11-11, overriding prompt.)
- `/assets/css/main.css`, `/assets/js/main.js`, `/assets/js/sermon-title-parser.js`, `/assets/images/*`: Frontend assets/scripts (includes copied `logo.png`, `pastor.jpg`, `congregation.jpg`).
- `/content/site.json`, `/content/events.json`, `/content/announcements.json`, `/content/videos.json`, `/content/i18n/es.json`, `/content/i18n/en.json`, `/content/photos.json` (generated when inbox processing completes): Content/config/i18n/photo-manifest data.
- `/netlify.toml`, `/netlify/functions/sermons.js`: Netlify config and YouTube RSS sermon function.
- `/admin/index.html`, `/admin/config.yml`: Sveltia CMS scaffold/config (expanded fields; repo/OAuth placeholders).
- `/scripts/photos.js`, `/scripts/process-inbox.py`, `/package.json`: Photo/script utilities and npm scripts (`photos`, `audit`, `start`).
- `/robots.txt`, `/sitemap.xml`, `/.well-known/security.txt`, `/.gitignore`: SEO/security/misc.
- `~/websites-old/live-site-copy-2026-11-11/`: Backup of old site copy.

## How to run / deploy
- **Local preview:** `python3 -m http.server 8080 --bind 127.0.0.1` (or `npm start`) then open `http://127.0.0.1:8080`.
- **Detailed setup:** see `SETUP_GUIDE.md` (GitHub, new Netlify site, form notifications to Yahoo, Sveltia CMS OAuth, newsletter, hero video, launch checklist).
- **Deploy safety:** do not replace current live site until approved; deploy/test on a new Netlify site first. Keep backup at `~/websites-old/live-site-copy-2026-11-11`.

## Known issues / bugs
- Original large images (`congregation.jpg`, `pastor.jpg`) remain in `assets/images/` and still require consent/kids-face review before publish (optimized WebP variants now used in key views). Full photo pipeline/EXIF stripping workflow not yet complete.
- i18n is **partially wired**: `assets/js/main.js` can apply translations for elements with `data-i18n`/`data-i18n-html`/`data-i18n-placeholder`/`data-i18n-aria`, but most page copy is still hardcoded Spanish and not keyed; dynamic JS-rendered strings may not fully switch language. English coverage incomplete.
- Cookie consent is baseline (accept/reject + settings link) but needs fuller preference management and consistent enforcement/auditing across all embeds/scripts.
- Sveltia CMS OAuth login blocked by external Cloudflare Worker env/binding issue on `sveltia-cms-auth-2` (MISCONFIGURED_CLIENT at runtime); token login works.
- Sermon function works in Netlify environment; static local server cannot execute `/.netlify/functions/*` (Watch page falls back to channel link).
- Header/mobile menu markup is not yet consistent across all pages (JS enhances at runtime, but source markup varies). Visual polish still needed on several interior pages.
- Lighthouse (mobile, user-reported): console/Issues panel items and Best Practices findings may remain; re-test after deploy in clean/incognito context for accurate results.

## Changelog
- 2026-11-11: Created `PROGRESS.md`, `TODO.md`, and `PROMPT.md`; recorded initial status and Phase 0 questions.
- 2026-11-11: Captured decisions (replace fully, YouTube channel ID `UCidzfKBmsuv01CCQIQkCofw`, no FileBrowser videos yet) and confirmed `~/Desktop/Website` as live-site copy with logo/pastor/congregation assets.
- 2026-11-11: Approved palette/fonts/sitemap; backed up old site; scaffolded project and base Home implementation; started local preview server; pivoted UI to dark theme per user request.
- 2026-11-11: Added core pages, sermons function, admin/docs/script scaffolds, robots/sitemap/security, dynamic Home features (next service/special Sunday, latest sermon/events, verse), cookie banner baseline, and mobile menu; removed `/servir/` and lawyer-review notes per user overrides.
- 2026-11-11: Added “Las 10 Plagas en Egipto” event to `content/events.json`, improved hero/section spacing and visual richness (image-backed sections, gradients, Home “Quiénes somos” showcase, quick-actions), ensured event visibility with static Home fallback/hero notice, rolled out `main.js` and consistent footers to content pages.
- 2026-11-11 (session paused): Finalized progress tracking for handoff; user stopping to update prompt. Resume from Next steps.
- 2026-11-11 (update): Implemented Watch page sermon title parsing (`assets/js/sermon-title-parser.js`) with forgiving parsing of service type/Spanish date, filter chips by service type and month/year, and guaranteed visibility of unmatched titles. Updated `PROGRESS.md`.
- 2026-11-11 (update): Added JS-driven header/mobile-nav enhancement across pages and "Estamos en vivo" banner for Sunday/Friday service windows.
- 2026-11-11 (update): Improved interior page consistency (mobile bar injection, page-intro backgrounds) and continued UI polish.
- 2026-11-11 (update): Optimized hero/about imagery (WebP responsive variants for pastor/congregation, logo.webp) and updated key references for faster loading.
- 2026-11-11 (update): User approved all 241 inbox photos for processing; zip files removed from inbox; background batch processing started to back up originals, categorize, optimize/strip metadata on export, and generate `content/photos.json`.
- 2026-11-11 (final pass): Added ICS service calendar links, privacy checkboxes on key forms, favicons/manifest, `SETUP_GUIDE.md`, Home schema/OG/canonical, expanded i18n/admin config, and finalized progress/docs for handoff. Photo inbox processing completed (241 photos; `content/photos.json` + `assets/images/library/`). Pastor images rotated 90° CCW.
- 2026-11-11 (final pass): Switched form notifications/docs/config to Gmail per user override, applied homepage section-specific library photos, increased dark contrast, improved headings/nav styling, simplified Watch Facebook section (link/note, no player), and started rotation of original/source photo copies.
- 2026-11-13: Set absolute canonical URLs on public pages, made `robots.txt`/`sitemap.xml` use absolute test-site URLs, added black SVG social icons (`assets/images/social-*.svg`) and social links in footers/contact, added global CSS wrap/overlap safeguards and responsive input fixes, and added basic i18n translation-application support in `assets/js/main.js` (`data-i18n*`). Noted that Netlify form email notifications (paid UI) and OAuth Worker remain deferred/external.
