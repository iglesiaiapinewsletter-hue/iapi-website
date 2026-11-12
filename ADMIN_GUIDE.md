# IAPI Website – Admin Guide (Plain English)

This guide explains how to manage the website content. The site is designed to be edited through **Sveltia CMS** at `/admin` once GitHub + OAuth are set up, or by editing the JSON files in `content/`.

## 1) One-time setup (owner)
1. **Put the site in GitHub:** create a repo (e.g. `iapi-website`), push this project, and connect the repo to a **new** Netlify site (do not replace the live site until approved).
2. **Netlify deploy:** publish directory = `.` (root). Enable automatic deploys from `main`.
3. **Forms:** in Netlify, set form notifications so submissions go to `apostolesyprofetasirving@gmail.com`.
4. **Sveltia CMS login (GitHub backend):**
   - Create a GitHub OAuth App (Settings → Developer settings → OAuth Apps). Homepage URL = your Netlify site URL, callback URL = your OAuth helper callback.
   - Deploy the free Sveltia CMS Auth helper to Cloudflare Workers (see Sveltia docs) and copy its URL.
   - Update `admin/config.yml`: set `backend.repo` to `OWNER/REPO` and `backend.base_url` to your Worker URL.
5. **Open admin:** go to `https://YOUR-SITE.netlify.app/admin/` and sign in with GitHub.

## 2) Add or edit an event
- **In CMS:** Events → Lista de eventos → add/edit items (title, date, time, location, description ES/EN). Save/publish.
- **In files:** edit `content/events.json` and add objects to the `events` array.
- The Events page shows “Próximamente” when the list is empty.

## 3) Post an announcement/bulletin
- **In CMS:** Anuncios / Boletín → add title/date/content.
- **In files:** edit `content/announcements.json`.
- Use the **Imprimir** button on `/anuncios/` for a printable view.

## 4) Change service times or church info
- Edit `content/site.json` (services, phone, emails, socials, Zelle, YouTube channel ID, special Sunday settings). Many pages read or should be kept in sync with these values.

## 5) Swap a photo
- Upload/replace images in `assets/images/` (prefer optimized WebP/AVIF/JPEG, correct dimensions). Update references in page/content files or CMS media fields as configured.
- **Photo approval reminder:** never publish photos showing kids’ faces without parent approval, and never show anyone who doesn’t want to appear. Put uncertain photos in `/photos-needs-review` until approved.
- Run `npm run photos` (once fully implemented) to sort/optimize inbox photos.

## 6) Turn on the hero video (later)
- Upload a short, silent, looping clip (10–20s, 1920x1080 or 1280x720, ideally under 3 MB, H.264 MP4 and/or WebM) to FileBrowser and make it publicly shareable.
- Update `content/videos.json`: set `hero.enabled` to `true` and add `mp4`/`webm`/`poster` URLs (or paths). Keep a strong photo fallback.
- The site should load video only after interaction/readiness and not on slow connections, Save-Data, or reduced-motion preferences (implement/verify behavior).

## 7) Undo a mistake
- If using GitHub/CMS: revert the commit in GitHub or restore a previous version of the JSON/file.
- If editing locally: use your editor’s undo or restore from Git history/backups.
- Keep backups (old site saved at `~/websites-old/live-site-copy-2026-11-11`).

## 8) Add a second editor
- In GitHub repo settings, invite the person as a collaborator with write access. They can log in to `/admin` with their GitHub account after OAuth is configured.

## Helpful reminders
- Forms should notify `apostolesyprofetasirving@gmail.com` (same as public contact, per user override).
- Prayer requests and pastoral visit requests are private (not public).
- Review legal text with a lawyer before launch. Verify photo consent before publishing images.
