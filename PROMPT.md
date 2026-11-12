# IAPI Church Website Rebuild: Master Prompt for OpenCode

Paste this whole file into OpenCode (or save it in the project folder as `PROMPT.md` and tell OpenCode: "Read PROMPT.md and PROGRESS.md and follow them").

---

## ROLE

You are a senior designer-developer. Rebuild the IAPI church website from scratch so it looks hand-designed by a professional agency, NOT AI-generated.

Work step by step. If you need a decision or a missing fact, ASK ME a short question (one at a time, with simple options when possible) instead of guessing. Never invent facts: use a clear placeholder and list it in `TODO.md`.

## PROGRESS TRACKING (MANDATORY, DO THIS FIRST)

I may continue this project across many different chats and sessions, so you must keep a file called `PROGRESS.md` at the root of the project and keep it current.

1. At the very start of EVERY session, read `PROMPT.md`, `PROGRESS.md`, and `TODO.md` (create them if missing) before doing anything else. Then tell me in 3 lines where we left off.
2. `PROGRESS.md` must contain these sections:
   - **Current status**: one paragraph on where the project stands.
   - **Done**: checklist of finished pages/features (with dates).
   - **In progress**: what is being worked on right now.
   - **Next steps**: the next 5 tasks in order.
   - **Decisions made**: every choice I made (palette, fonts, sitemap, tools, etc.) so they are never re-asked.
   - **Open questions**: anything waiting on me.
   - **File map**: where each page, JSON content file, function, and config lives.
   - **How to run / deploy**: exact commands.
   - **Known issues / bugs**.
3. Update `PROGRESS.md` after every meaningful change and at the end of every session, before saying you are done. Never delete history; append dated entries to a **Changelog** section.
4. Never re-ask a question that is already answered in this prompt or in `PROGRESS.md`.

## PHASE 0: PREP

1. Read everything in `~/websites` (the old site, built with Copilot, live at iglesiaiapirving.netlify.app). Make a backup at `~/websites-old`. Reuse only real content/assets (Logo.png, Pastor.JPG, Congregation.JPG). Do not reuse its code or design.
2. Ask me what I dislike or want gone from the old site, then ask for the missing facts listed at the end of this prompt.
3. Extract the color palette from `Logo.png` and show it to me with your proposed fonts and sitemap, then build.

## CHURCH FACTS

- Legal name: **Iglesia Apostoles y Profetas USA en Irving**. Public name: Iglesia Apóstoles y Profetas Irving (IAPI). Registered 501(c)(3) (recognized as a church). Do not state an EIN.
- Address: 530 N O'Connor Rd, Irving, TX **75061**. Free parking lot.
- Phone: **(903) 998-0338**.
- Public contact email: **apostolesyprofetasirving@gmail.com**.
- ALL form submissions are sent to the church Yahoo address: **apostolesyprofetasirving@yahoo.com**. Never mix these two up.
- Pastor: Oscar Amílcar Guevara.
- Tagline: "¡Proclamando el señorío de Cristo y reuniéndonos en adoración, oración y la Palabra!"
- Services (Spanish only):
  - Domingo 11:00 AM: Culto de Enseñanza (usually runs until about 1:00-1:30 PM)
  - Miércoles 7:30 PM: Culto de Oración
  - Viernes 7:30 PM: Culto de Exaltación
- First Sunday of every month is special, alternating every other month:
  - **Santa Cena** (during the regular 11:00 AM service)
  - **Ayuno** (fast, about 9:00 AM to 5:00 PM)
  - November 2026 was Santa Cena, December 2026 is Ayuno, then it keeps alternating. Show "next special Sunday" automatically from this pattern, editable in the admin.
- Founding year unknown: say "muchos años" or leave it out.
- Beliefs/mission text: write a short, respectful placeholder and flag it in `TODO.md`. Do not invent doctrine.
- Do NOT mention a dress code anywhere.
- First-time visitors: there is NO welcome team or greeters. At the end of the sermon the pastor personally welcomes first-time visitors, and they can meet him after the service. Use this warmly on Plan Your Visit and in the FAQ. Do not promise greeters, welcome gifts, or a welcome team.
- WhatsApp: the church has an unofficial WhatsApp. Do NOT show it on the site. Add a hidden, off-by-default "WhatsApp" setting in the CMS in case I want it later.
- Prayer requests: the handling policy is undecided. For now, requests are private, sent only to the Yahoo email, and never shown publicly. Say so under the form ("Tu petición se envía en privado a la iglesia"). Add a TODO for me to confirm who sees them.
- Pastoral visit: add a simple private form, "Solicitar una visita pastoral" (name, phone, area of town, best time, optional reason). It is sent only to the Yahoo email, never shown publicly, and linked from Contact and the Prayer Request page.
- Baptism: do NOT build a baptism signup form. Baptism takes place at the church after a person accepts the Lord. Explain this in the FAQ and tell visitors to talk to the pastor.
- Socials:
  - YouTube: youtube.com/aypirving
  - Facebook: facebook.com/apostolesyprofetasirving
  - Instagram: instagram.com/iglesiaiapi
  - TikTok: tiktok.com/@iglesiaiapi
- Livestreams: Sunday and Friday services, on both YouTube and Facebook.
- Giving: Zelle only, to the main church phone (903) 998-0338; the name shown is the legal name. The Give page has copy-to-clipboard buttons and instructions. Never collect payment details.

## MINISTRIES (show leader names publicly)

- **Kids** (Sunday only): ages 3-10, runs during the sermon until the closing prayer. Leader: Claribel Garcia.
- **Youth**: ages 10-21. They do a participation in the service every 3rd Sunday and meet right after the service that day. Leader: Marlon Guevara.
- **Women**: leader Maria Marquina. Schedule is randomized, so announce dates through Events and social media.
- **Men**: leader Pedro Ventura. Same randomized schedule.
- **Worship/Music**: leader Marlon Guevara. Anyone interested talks to the worship leader and the pastor.
- NO small groups or home groups.

## VOLUNTEERS

Volunteer areas: A/V, Kids ministry, Ushers, Church cleaning.

The volunteer form must state the requirements: the person must have accepted the Lord as their savior, be baptized, and be a member of the church. The pastor reviews every application. Send applications to the Yahoo email.

## PHOTO POLICY

Never show kids' faces unless the parents have approved, and never show anyone who doesn't want to appear. Add a "photo approval" reminder in the admin guide. Use the old site's photos only if they follow this rule; flag any with kids' faces.

## AUDIENCE & DESIGN

- Audience: everyone equally. First-time visitors are the priority. The main call to action everywhere: **"Planifica tu visita / Plan your visit"**.
- Style: modern megachurch website: cinematic full-screen hero, huge confident typography, bold section transitions, big imagery, polished and high-production, never cluttered. Blend warm/welcoming, bold/modern, elegant/classic, and youthful/energetic using a warm clean base, bold type, an elegant serif for headlines, and the logo's accent color used sparingly.
- Colors come ONLY from the church logo. Use the logo exactly as is, never redrawn or altered. Check contrast.
- Anti-vibecoded: no purple/blue gradients, no glassmorphism, no neon glow, no emoji icons, no endless grids of identical rounded cards. Use asymmetric layouts, overlapping elements, tasteful scroll-reveal animation (respect `prefers-reduced-motion`), and clean SVG icons.
- Mobile-first: sticky header with a persistent "Plan your visit" button, a sticky bottom bar on mobile (Directions, Call), big tap targets.
- Home page headline: **"Bienvenido a casa"** (English: "Welcome home"). Use the tagline and service times right under it.
- Writing tone: warm and personal, like family. Short, friendly sentences, speak directly to the visitor ("tú"), no corporate language, no pressure.
- Placeholder images go in `/assets/images` with clear filenames; tell me which real photos to add and at what dimensions.

### Hero background

I don't have a hero video yet and I'm not sure how it works. For now:
- Use a strong full-screen photo as the hero, with the video slot already built in and switched off.
- Explain in plain English what a hero background video is (a short, silent, looping 10-20 second clip behind the headline).
- Tell me exactly what clip to make (length, resolution, file size, format) and how to turn it on later through `videos.json` / the admin, with the photo as the fallback.

## LANGUAGE

Spanish by default, English toggle. All text in `es.json` / `en.json`. No Anthropic API key or AI translation in the browser. Use the static files.

## PAGES

1. **Home**: hero, headline, service times, next special Sunday, "Plan your visit", who-we-are, what to expect, latest sermon, events, ministries preview, final invitation + map.
2. **Plan Your Visit**: service times, address, click-to-load map and Get Directions, free parking, step-by-step of a Sunday service (worship, preaching, altar call), duration (about 2 hours), kids (Sunday) and youth info, FAQ accordion, and a "Tell us you're coming" form.
3. **About**: story, pastor, leadership cards, beliefs placeholder.
4. **Ministries**: Kids, Youth, Women, Men, Worship, each with leader, ages, schedule, description.
5. **Watch**: livestream (YouTube embed + "Watch on Facebook" button) and the sermon archive.
6. **Events**: from `events.json`. Start EMPTY with one commented example and a "Próximamente" message (old events are outdated).
7. **Announcements / online bulletin**: from `announcements.json`, with a printable view.
8. **Give** (Zelle) page.
9. **Prayer request** form.
10. **Volunteer** form (with the requirements above).
11. **Contact**: form, address, map, phone, email, socials.
12. **Newsletter** signup in the footer and on Home.
13. Legal pages, a custom 404, and a footer on every page.

## VIDEO

Short videos (hero loop, promos) come from my FileBrowser Quantum server at `https://storage.buffalo-diminished.ts.net`.

- Define them in `videos.json`. Use HTML5 video with `preload="none"`/`"metadata"`, poster, `playsinline`, muted for backgrounds, and a graceful fallback if the server is offline. Never block page load.
- Base URL in one variable.
- Explain how to make a file publicly shareable in FileBrowser Quantum and the direct-link format, plus any CORS/range issues.
- Do not proxy video through Netlify.

## SERMON FEED (FREE, NO API KEY)

- Channel ID: `YOUTUBE_CHANNEL_ID_HERE` (one config variable; I will give it later; leave a placeholder).
- Netlify Function `/.netlify/functions/sermons` fetches `https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID`, parses it into JSON, and caches about 15 minutes.
- Watch page: featured latest sermon, grid of the rest, search box. Home shows only the newest. Click-to-load facades with `youtube-nocookie.com`.
- Livestream: `youtube-nocookie.com/embed/live_stream?channel=CHANNEL_ID` (click-to-load), a "Watch on YouTube" fallback, and a Facebook live button. Show an "Estamos en vivo" banner during the Sunday and Friday service times (America/Chicago, configurable).
- If the feed fails, show a friendly message and a link to the channel. Add loading skeletons. Do not use the YouTube Data API.

## FORMS & NEWSLETTER

- Netlify Forms (honeypot + validation, friendly Spanish success messages) for visit, prayer, volunteer, and contact. Tell me how to set up email notifications to the Yahoo address.
- Newsletter (Spanish only): connect the signup form to a free email service (recommend EmailOctopus or Brevo; check their current free limits). Include a consent checkbox. Plan: a full-details email on the 1st of each month plus a weekly email with that week's info. Explain step by step how I create the account, connect the form, and send my first email. Remind me each email needs an unsubscribe link and the church address.

## ADMIN EDITOR (FREE)

I will manage the site myself. Build an easy admin at `/admin` using **Sveltia CMS** with the GitHub backend. Do NOT use Netlify Identity or Git Gateway (deprecated).

- Put the site in a GitHub repo and set up Netlify auto-deploy from it. Walk me through every step.
- Set up the free Sveltia CMS Auth OAuth helper (Cloudflare Workers) and the GitHub OAuth app, explaining every click.
- All content editable in the CMS: special Sundays, services, events, announcements/bulletin, ministries and leaders (name, photo, description), About/leadership, FAQ, `videos.json`, sermon settings, and site settings (phone, emails, socials, Zelle info).
- Friendly Spanish labels, hints under every field, image upload with size limits, and validation so I can't break the site. Works on my phone. Explain how to add a second editor.
- Write `ADMIN_GUIDE.md` in plain English: add an event, post a bulletin, change service times, swap a photo, undo a mistake.

## LEGAL, PRIVACY & SECURITY

- Bilingual Privacy Policy, Terms of Use, Cookie Policy with consent banner (Accept / Reject / Preferences), Accessibility Statement, giving disclaimer, and photo/video notice (services are recorded and livestreamed). Plain language for a Texas church. Note they should be reviewed by a lawyer.
- Load NO non-essential cookies or third-party embeds until accepted (facades for YouTube and Maps). "Cookie settings" link in the footer.
- Security headers in `netlify.toml` (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS), form spam protection, input validation, no secrets in front-end code, minimal data collection with a Privacy Policy checkbox on forms.
- Never publish private individuals' phones/emails.
- Add a child-safety note on the Kids page (check-in/out and background-check policy as TODO).
- Add `security.txt`.

## QUALITY

- Accessible (WCAG 2.1 AA, semantic HTML, alt text, keyboard nav, skip link), Lighthouse 90+ on all four categories, optimized lazy-loaded webp images, minimal JS.
- SEO: per-page titles/meta, Open Graph, `sitemap.xml`, `robots.txt`, schema.org "Church" JSON-LD with address and hours, and keep Google Search Console verification working.
- Favicons and web manifest.
- Everything in JSON/CMS-editable files with a README.
- Write warm, natural Spanish copy with English translations.

## PHOTO INTAKE & AUTO-SORT

I will drop photos into a single folder (`/photos-inbox`) and you sort them for me. Build a script (`npm run photos`) and follow these rules every time I add photos:

1. **Never touch the originals.** Copy them to `/photos-originals` first, then work on copies.
2. **Look at each photo** (use image analysis if available; also use filename, folder, and EXIF date) and classify it: worship, preaching, congregation, pastor/leaders, building exterior, building interior, kids, youth, women, men, baptism, communion/Santa Cena, events, logo/graphics, other.
3. **Rename** to clear, lowercase names (`worship-2026-11-01-01.jpg`) and group them into folders by category.
4. **Auto-assign** the best photos to site slots (hero, About, ministry cards, Plan Your Visit, event headers) by composition: prefer sharp, well-lit, wide shots; avoid blurry, dark, or duplicate images. Write the result to `photos.json` so the CMS can swap any of them.
5. **Optimize every image**: convert to AVIF/WebP (JPEG fallback), create responsive sizes (480/800/1200/1920 px wide), strip EXIF/GPS location data for privacy, and keep each file as small as possible without visible quality loss.
6. **Generate alt text** in Spanish and English for every photo (describe what's visible; never guess names).
7. **Privacy gate (mandatory):** any photo that shows kids' faces, or where you can't tell if someone consented, goes to `/photos-needs-review` and is NEVER published until I approve it. Show me a short list: "These N photos need your approval."
8. **Detect and remove duplicates** and near-duplicates (keep the best one).
9. **Ask me** one short question when unsure where a photo belongs; don't guess.
10. **Report** after each run: how many photos were sorted, where they went, which need review, and total size saved. Log it in `PROGRESS.md`.

## PERFORMANCE & OPTIMIZATION (the site must be FAST)

Most visitors will be on phones with average connections. Targets, measured on a throttled mobile connection:
- Largest Contentful Paint under 2.5 s, Cumulative Layout Shift under 0.1, Interaction to Next Paint under 200 ms.
- Home page initial load (excluding the hero video) under about 500 KB transferred.

Requirements:
- **Images:** responsive `srcset`/`sizes`, AVIF/WebP, `loading="lazy"` for everything below the fold, explicit width/height on every image (no layout shift), and a preloaded hero image.
- **Video:** the hero video is optional, muted, 10-20 seconds, compressed (H.264 MP4 + WebM, ideally under 3 MB), with a poster image; load it only after the page is interactive and never on slow connections or when "Save-Data" / reduced motion is on.
- **Fonts:** at most 2 families, self-hosted or preloaded, WOFF2 only, subsetted to Latin + Spanish characters, `font-display: swap`.
- **CSS/JS:** inline critical CSS, minify and defer the rest, no big libraries, no frameworks unless truly needed, split JS by page, remove unused code.
- **Third parties:** none load until consent. YouTube and Maps are click-to-load facades.
- **Caching & delivery:** long-lived immutable caching for fingerprinted assets and short caching for HTML via `netlify.toml`; enable compression; use `<link rel="preconnect">` only where needed; prefetch the next likely page on hover.
- **Resilience:** pages must work with JavaScript slow or off for the basics (service times, address, directions, phone).
- **Measure it:** add `npm run audit` (Lighthouse) and report the scores on every build. Fix anything below 90 before telling me it's done.
- **SEO speed extras:** clean URLs, canonical tags, `lang` attributes for es/en with `hreflang`, structured data.

## EXTRA FEATURES (keep them simple and useful)

- "Add to calendar" (.ics) buttons for services and events.
- Click-to-call and click-for-directions buttons everywhere they matter.
- "Next service" countdown and "next special Sunday" (Santa Cena / Ayuno) on Home.
- A "Versículo de la semana" (verse of the week) block editable in the admin.
- A printable bulletin view and a QR code to the Plan Your Visit page (for flyers and the church sign).
- Share buttons for sermons and events.
- Remember the visitor's language choice.
- Cookieless, privacy-friendly basic analytics only (or none); no tracking before consent.
- Short Google Business Profile checklist so the church shows up on Google Maps correctly.

## LAUNCH PLAN

1. Do NOT touch the current live site (iglesiaiapirving.netlify.app) until I approve.
2. Deploy the new site to a NEW, separate Netlify site first so I can test it. Give me the exact steps.
3. After I approve, show me how to switch the live site over (or move the domain) with zero downtime, and keep the old site backed up.
4. Keep Google Search Console working after the switch.

## ASK ME IN PHASE 0 (one at a time)

What I dislike on the old site, the YouTube channel ID (or "later"), FileBrowser video links, and anything else missing.

## FINISH

1. Run a local preview and check every page at mobile and desktop widths. Fix bugs yourself.
2. Give me the exact deploy steps for Netlify.
3. Give me a launch checklist (forms, cookie banner, legal pages, links, mobile, Lighthouse, Search Console) and `TODO.md` listing everything still missing.
4. Update `PROGRESS.md` one last time.
