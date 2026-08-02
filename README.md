# angelosky — portfolio

Portfolio of Angelo C. Balane. React + Vite, three routed pages (`#/home`,
`#/projects`, `#/contacts`) behind a fixed nav.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the built bundle
```

Routing is a small hash router (`src/hooks/useHashRoute.js`) — no dependency,
works on any static host with no rewrites, and browser back/forward behave
normally.

## Where to edit things

Almost everything lives in **`src/data/content.js`**:

| What | Field |
| --- | --- |
| Education / Experience pop-ups | `PANELS` — `heading` + `groups[]` (a group `title` is an optional bold sub-label) |
| Video cards | `VIDEOS[]` — `title`, `award`, `roles`, `src`, `poster` |
| Program cards | `PROGRAMS[]` — `title`, `award`, `roles`, `href`, `image` |
| "Tools used" row | `TOOLS.videos[]` / `TOOLS.programs[]` — `name`, `icon` |
| Projects backdrops | `PROJECT_BACKDROPS.videos` / `.programs` |
| Contact + social links | `INQUIRIES[]`, `SOCIALS[]` |

Colors, type scale and spacing are tokens at the top of
**`src/styles/global.css`** (`--coral`, `--mint`, `--teal`, `--cream`, `--ink`,
`--nav-h`, `--maxw`, `--year-size`).

Three images are still set in JSX rather than data: the hero
(`Home.jsx` → `.hero__media`), the portrait (`Home.jsx` → `.about__photo`) and
the contact background (`Contact.jsx` → `.talk__media`).

## Media

Everything static lives under `public/` and is served from the root — a file at
`public/videos/1.mp4` is fetched as `/videos/1.mp4`.

```
public/
  videos/   1.mp4 … 19.mp4
  images/   backgrounds + portrait
    thumbs/ 1.png … 19.png   (video posters)
  tools/    software logos
  favicon.svg
```

**Videos must be H.264 MP4.** `.mov` and H.265/HEVC will not play in Chrome or
Firefox even though the file is fine. Export from Resolve as MP4 / H.264, and
tick "Web Optimized" if compressing through HandBrake so playback can start
before the file finishes downloading.

Originals of the downscaled backgrounds are kept in `assets-original/`, which is
gitignored and never deployed. Delete it once you're happy with the resizes.

**After adding a new file to `public/`, restart the dev server.** The watcher
ignores that folder (see `vite.config.js`) because OneDrive locks files while
syncing and kept crashing Vite with `EBUSY`. Replacing an existing file only
needs a hard refresh.

## Deploying

`netlify.toml` is set up — build `npm run build`, publish `dist`, Node 20, with
cache headers and an SPA fallback.

**Netlify → connect the GitHub repo**, or drag the `dist` folder onto
app.netlify.com/drop for a one-off deploy.

After the site is live, set the absolute URLs for link previews in
`index.html` — `og:image` and an `og:url` meta tag both want the full
`https://your-site.netlify.app/...` form for Facebook and Twitter to resolve
them.

### Before pushing to GitHub

`public/videos/19.mp4` is **100.4 MB**, and GitHub rejects any single file over
100 MB. Re-encode that one below the limit (HandBrake, RF 24–26) or the push
fails. Everything else is comfortably under.

The repo carries ~600 MB of video. That works, but git stores a full copy of
every version, so replacing clips grows history permanently. If it becomes a
problem, either gitignore `public/videos/` and deploy via the Netlify CLI, or
move the videos to YouTube/Vimeo and embed them.
