# TODO

## Missing facts / placeholders (do not invent)
- [x] Beliefs/mission text: short respectful placeholder added on About page; confirm final content with user.
- [x] YouTube channel ID for sermon feed/livestream embeds: `UCidzfKBmsuv01CCQIQkCofw` (provided 2026-11-11).
- [ ] FileBrowser video links and direct-link/CORS details for hero/promos.
- [ ] Confirm who sees prayer requests (currently private to Yahoo email only per prompt).
- [ ] Founding year unknown (use "muchos años" or omit per prompt).
- [ ] Child-safety note details for Kids page (check-in/out and background-check policy).
- [x] Inbox batch processed (2026-11-11, user approved all): 241 photos optimized/categorized into `assets/images/library/` with `content/photos.json` (222 women, 18 events, 1 baptism). Originals backed up to `photos-originals/inbox-2026-11-11/`.
- [ ] Review/select processed library photos for specific page placements (hero, ministries, events, baptism, etc.) and add/update alt text as needed. Keep `npm run photos` pipeline improvements for future uploads.
- [ ] Individual photos of leaders (Pastor, Claribel Garcia, Marlon Guevara, Maria Marquina, Pedro Ventura) to add when available.

## Phase 0
- [x] Obtain user feedback on old site (replace fully).
- [x] Reviewed downloaded old site copy at `~/Desktop/Website`; backup created at `~/websites-old/live-site-copy-2026-11-11`.
- [x] Located reusable assets (`logo.png`, `pastor.jpg`, `congregation.jpg`) and extracted/proposed logo palette.
- [x] Proposed and received approval for fonts and sitemap.

## Build / functional gaps (ongoing)
- [x] Complete bilingual content/i18n wiring across public pages with Spanish as default and remembered EN/ES toggle (2026-11-13). Wired page content, shared chrome, cookie banner, and dynamic/page scripts; keep ES/EN in sync for future content/CMS updates.
- [x] SEO basics (partial): absolute canonical URLs on public pages; `robots.txt` and `sitemap.xml` updated with absolute test-site URLs (2026-11-13). Re-run Lighthouse/SEO after deploy.
- [x] Social/redes links: added black SVG icon assets and social links in site footers and contact page (2026-11-13).
- [ ] Continue responsive/layout polish to ensure no text overlap at any viewport size (global safeguards added 2026-11-13; needs QA across pages).
- [ ] Add cookie consent banner with preferences and gate non-essential third-party embeds (YouTube/Maps/facades) accordingly. (baseline exists; audit/enforce fully)
- [ ] Finalize Sveltia CMS config/fields to match all editable content and complete OAuth/repo setup instructions (token login works; OAuth deferred).
- [ ] Implement full `npm run photos` pipeline and image optimization/responsive variants per prompt.
- [ ] Add `npm run audit` (Lighthouse) workflow and fix performance/accessibility/SEO/best-practices issues to 90+.
- [x] Announcements page: presentation-style slideshow (one at a time, auto 20s, prev/next arrows, click-to-zoom) with CMS-uploadable image slides (2026-11-13).
- [ ] Add newsletter provider integration steps/details (EmailOctopus/Brevo), form notification setup (Option B/Web3Forms later, per user), and Google Business Profile checklist.
- [ ] Fix Sveltia CMS OAuth login (Cloudflare Worker env/binding + GitHub App callback) so token is not required.

## Legal/content review
- [x] Initial bilingual legal/utility pages drafted (privacy, terms, cookies, accessibility, 404); flag for lawyer review before launch.
