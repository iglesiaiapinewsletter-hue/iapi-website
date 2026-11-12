# IAPI Website (Rebuild)

Static website for Iglesia Apóstoles y Profetas Irving (IAPI), built for Netlify.

## Status
Work in progress. See `PROGRESS.md` and `TODO.md` for current state and pending items.

## Local preview
```bash
python3 -m http.server 8080 --bind 127.0.0.1
# open http://127.0.0.1:8080
```
Or: `npm start`

## Structure (high level)
- `index.html`, `*/index.html`: site pages
- `assets/css`, `assets/js`, `assets/images`: frontend assets
- `content/*.json`, `content/i18n/*.json`: editable/content data
- `netlify/functions/`: serverless functions (e.g. sermons feed)
- `admin/`: Sveltia CMS (GitHub backend, OAuth setup required)
- `scripts/photos.js`: photo intake/optimization scaffold (`npm run photos`)

## Deploy (initial)
1. Push this folder to a GitHub repository.
2. Create a **new** Netlify site (do not replace the live site yet) and connect the repo.
3. Build settings: publish directory `.` (no build command required for static files unless added later).
4. Configure form notifications to send submissions to `apostolesyprofetasirving@gmail.com`.
5. Set up Sveltia CMS OAuth helper (Cloudflare Workers) + GitHub OAuth app and update `admin/config.yml`.
6. After approval, switch domain/live site per launch plan in `PROMPT.md`.

## Notes
- Sermon feed uses YouTube RSS via `/.netlify/functions/sermons` (channel ID in `content/site.json` / env).
- Hero video is configured in `content/videos.json` (disabled by default).
- Legal/content text includes placeholders and should be reviewed before launch.
