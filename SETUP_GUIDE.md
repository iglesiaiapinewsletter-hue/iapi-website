# IAPI Website – Simple Step-by-Step Setup Guide

This guide explains how to put the rebuilt website online safely (without touching the current live site until you approve).

## 0) Before you start (what you need)
- A **GitHub** account (free)
- A **Netlify** account (free)
- Access to the church email **apostolesyprofetasirving@gmail.com** (to receive form submissions and contact)
- (For admin editing) a **Cloudflare** account (free) to run the Sveltia CMS login helper
- (Optional later) **FileBrowser** video links and a newsletter provider account (EmailOctopus or Brevo)

Project folder: `/Volumes/USB/Website_IAPI` (this is the website).

---

## 1) Preview the website on your computer (local)
1. Open Terminal.
2. Go to the project folder:
   ```bash
   cd /Volumes/USB/Website_IAPI
   ```
3. Start a local preview server:
   ```bash
   python3 -m http.server 8080 --bind 127.0.0.1
   ```
   (or `npm start`)
4. Open your browser to: **http://127.0.0.1:8080**
5. Check pages on desktop and mobile widths (resize browser or use phone on same network if configured).
6. To stop the server: press **Ctrl + C** in Terminal.

> Note: The sermon feed (`/.netlify/functions/sermons`) works on Netlify. On the simple local Python server it may fall back to a YouTube channel link, which is normal.

---

## 2) Connect to GitHub and upload the site
**Repository:** https://github.com/iglesiaiapinewsletter-hue/iapi-website.git

1. Make sure the repository exists on GitHub and you have access to it.
2. In Terminal, from `/Volumes/USB/Website_IAPI` (git and remote may already be set up locally):
   ```bash
   git init  # skip if already initialized
   git remote add origin https://github.com/iglesiaiapinewsletter-hue/iapi-website.git  # skip if already set
   git add .
   git commit -m "Initial IAPI website rebuild"
   git branch -M main
   git push -u origin main
   ```
   If the remote already exists with a different URL: `git remote set-url origin https://github.com/iglesiaiapinewsletter-hue/iapi-website.git`
3. Refresh GitHub and confirm files are uploaded. If push asks for authentication, sign in with your GitHub credentials/token.

---

## 3) Deploy to a **new** Netlify site (safe test site)
**Do not replace the current live site yet.**

1. Go to https://app.netlify.com and log in.
2. Click **Add new site** → **Import an existing project**.
3. Choose **GitHub** and authorize Netlify if asked.
4. Select your `iapi-website` repository.
5. Build settings:
   - **Branch to deploy:** `main`
   - **Build command:** *(leave empty)*
   - **Publish directory:** `.`
6. Click **Deploy site**.
7. Netlify will give you a test URL like `https://something-random.netlify.app`. Open it and test the site.

---

## 4) Set up form email notifications (very important)
The site uses Netlify Forms (visit, prayer, pastoral visit, contact, newsletter). Submissions must go to **apostolesyprofetasirving@gmail.com**.

1. In Netlify, open your site → **Forms**.
2. Submit a test form on the test site (e.g. Contact) so Netlify detects it.
3. Go to **Site configuration** → **Notifications** → **Emails and webhooks** (or Forms notifications).
4. Add an **Email notification** for form submissions:
   - Event: **New form submission** (choose specific form or all forms)
   - Email to notify: `apostolesyprofetasirving@gmail.com`
5. Repeat/check for each important form if needed.
6. Submit another test and confirm the Gmail inbox receives it.

> Public contact and forms inbox: `apostolesyprofetasirving@gmail.com` (per user override).

---

## 5) Set up the Admin editor (`/admin`) with Sveltia CMS (GitHub login)
This lets you edit events, announcements, and settings in a friendly editor.

### A. Deploy the Sveltia CMS Auth helper (Cloudflare Workers)
1. Create/login to a Cloudflare account: https://dash.cloudflare.com
2. Use the official Sveltia CMS Auth helper template (Cloudflare Worker). Follow Sveltia docs: https://github.com/sveltia/sveltia-cms-auth
3. Deploy the Worker and copy its URL (example: `https://sveltia-cms-auth.yourname.workers.dev`).

### B. Create a GitHub OAuth App
1. GitHub → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**.
2. Fill in:
   - **Application name:** `IAPI Website Admin`
   - **Homepage URL:** your Netlify test site URL (e.g. `https://something-random.netlify.app`)
   - **Authorization callback URL:** your Worker URL + `/callback` (example: `https://sveltia-cms-auth.yourname.workers.dev/callback`)
3. Create the app and copy the **Client ID** and generate a **Client Secret**.
4. Add these credentials to your Cloudflare Worker settings as required by the Sveltia auth helper docs.

### C. Update site admin config
1. Edit `admin/config.yml` in the project:
   - `backend.repo`: already set to `iglesiaiapinewsletter-hue/iapi-website` (verify it matches)
   - `backend.base_url`: set to your Worker URL
2. Commit and push changes to GitHub (Netlify will auto-deploy).
3. Open `https://YOUR-NETLIFY-SITE.netlify.app/admin/` and sign in with GitHub.
4. Test editing `content/events.json` or announcements and publish.

### D. Add a second editor
- GitHub repo → **Settings** → **Collaborators** → invite the person (write access). They can log in at `/admin` after setup.

---

## 6) Content you can edit (after CMS setup)
- **Events:** `content/events.json` (or via CMS)
- **Announcements/Bulletin:** `content/announcements.json`
- **Site settings:** `content/site.json` (phone, emails, socials, YouTube channel ID, verse of week, special Sunday settings, etc.)
- **Videos config:** `content/videos.json` (hero video off by default)
- **Translations:** `content/i18n/es.json`, `content/i18n/en.json` (manual/static)

See **`ADMIN_GUIDE.md`** for plain-English editing steps (events, announcements, photos, undo mistakes, hero video).

---

## 7) Photos (important)
- Drop new photos into `photos-inbox/`.
- **Privacy rule:** never publish photos showing kids’ faces without parent approval, and never show anyone who doesn’t want to appear.
- A batch processor script was added (`scripts/process-inbox.py`) and optimized library output goes to `assets/images/library/` with manifest `content/photos.json`.
- Before publishing, review photos for consent and replace placeholders as needed.
- TODO: complete the full automated `npm run photos` workflow and run final optimization/EXIF checks.

---

## 8) Newsletter (EmailOctopus or Brevo) – connect later
1. Create a free account at **EmailOctopus** or **Brevo** (check current free limits).
2. Create an audience/list and enable double opt-in if desired.
3. Connect the newsletter form submissions to the provider:
   - Option A: Netlify form notification/webhook/Zapier/Make to provider
   - Option B: Provider embed/API integration (requires custom wiring)
4. Add a consent checkbox (already included in Home newsletter form) and include unsubscribe link + church address in every email.
5. Plan: full-details email on the 1st of each month + weekly email with that week’s info.

---

## 9) Hero video (optional, later)
- Make a short silent loop (10–20s, 1920x1080 or 1280x720, ideally < 3 MB, MP4 H.264 and/or WebM).
- Upload to FileBrowser (`https://storage.buffalo-diminished.ts.net`) and get a public direct link.
- Update `content/videos.json` (`hero.enabled`, `mp4`, `webm`, `poster`). Keep photo fallback.
- Ensure video loads only when appropriate (after page ready, not on Save-Data/reduced motion if implemented).

---

## 10) Final checks before going live
- [ ] Test all pages on mobile and desktop
- [ ] Test every form (visit, prayer, pastoral visit, contact, newsletter) and confirm Yahoo receives submissions
- [ ] Verify cookie banner/settings and that embeds load only when intended
- [ ] Check phone/address/map/directions links, service times, and event info
- [ ] Verify YouTube/Facebook/social links
- [ ] Review photos for consent (especially kids/faces)
- [ ] Review Spanish/English text and legal pages
- [ ] Run Lighthouse/audits and fix issues (`npm run audit` placeholder currently)
- [ ] Confirm Google Search Console remains/gets verified (keep existing verification file/process)

---

## 11) Go live (after you approve the test site)
1. Keep the current live site untouched until approval.
2. In Netlify, choose one:
   - **Move custom domain** to the new site, or
   - **Replace** the old site’s deploy with the new repo (after backup confirmation)
3. Verify HTTPS, redirects, and forms after switch.
4. Keep backup of old site (`~/websites-old/live-site-copy-2026-11-11`) and monitor Search Console.

---

## 12) If something breaks
- Undo content changes via GitHub history or CMS revisions.
- Check Netlify deploy logs and Forms/Functions logs.
- Revert to previous deploy in Netlify if needed.
- Refer to `PROGRESS.md` and `TODO.md` for current known gaps.

**Forms inbox & public contact:** `apostolesyprofetasirving@gmail.com`  
**Phone/Zelle:** `(903) 998-0338`  
**Address:** `530 N O'Connor Rd, Irving, TX 75061`
