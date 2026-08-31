# Qiskit Fall Fest 2026 @ UTM website

A deployable, dependency-free static site for Qiskit Fall Fest 2026 @ UTM. It uses plain HTML, CSS, and one vanilla JavaScript module. There is no package manager, build step, analytics, cookie, backend, or registration form.

## Preview locally

From the repository root:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`. Do not open the HTML through `file://`; browsers block the JSON fetch there and intentionally show the static fallback.

## Update the site in under ten steps

1. Open `content/event.json`. This is the source of truth for event metadata, agenda, speakers, FAQ, resources, collaborators, sponsors, and social links.
2. Replace every `TODO:` value with a confirmed committee fact. Do not guess missing details.
3. Add a registration URL only when registration is live. An empty `registrationUrl` keeps the button hidden.
4. Put approved logos and speaker photos in `assets/img/`, then add their relative paths to `event.json` (for example, `assets/img/speaker-yap.webp`). Use WebP, declare dimensions in the rendered markup if the image treatment changes, and confirm usage permission.
5. Add each sponsor to the `sponsors` array with `name`, local `logo`, `tier`, and `url`. Never edit the HTML sponsor strip.
6. If the repository moves, update `site.canonicalBase`, `sitemap.xml`, and `robots.txt` with the new HTTPS URL.
7. Preview locally and test `index.html`, `resources.html`, `community.html`, `#agenda`, the mobile menu, FAQ, countdown, and calendar download.
8. Run the launch checks below, commit, and push to `main`. GitHub Pages serves the repository root because `.nojekyll` is present.

## Publish on GitHub Pages

The site is initially published under `hafizkwar`. To recreate that deployment, run:

```powershell
git init
git add index.html resources.html community.html assets content .nojekyll README.md LICENSE sitemap.xml robots.txt
git commit -m "Launch Qiskit Fall Fest 2026 UTM website"
git branch -M main
git remote add origin https://github.com/hafizkwar/qiskit-fall-fest-2026-utm.git
git push -u origin main
```

In GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/ (root)` → Save**. Enforce HTTPS after the first deployment succeeds.

## Content model

- `event`, `agenda`, `speakers`: dates, venue, programme, people
- `resources`: before/during/after learning links
- `community`: launch copy, planned activities, public social links
- `collaborators`, `sponsors`: local logo references and recognition tiers
- `faq`: participant-facing answers, including privacy and photography notice
- `site`: canonical URL, shared contact email, repository, last-updated date

The JavaScript fetches this file at page load and replaces readable HTML fallbacks. If the JSON fails or JavaScript is disabled, the core event details, agenda, speakers, resources, and FAQ remain available.

## Confirm before launch

- [ ] Replace all `TODO:` values in `content/event.json`
- [ ] Transfer the repository to `Qiskit-Fall-Fest-2026` when organization permissions are available, then update the canonical and sitemap URLs
- [ ] Confirm the shared committee email, registration status, fee, language, certificate, dietary details, prayer facilities, parking, and arrival point
- [ ] Add approved IBM Quantum, Qiskit, UTM, and faculty logos with permission
- [ ] Add confirmed speaker photos and bios with permission
- [ ] Confirm the agenda against the latest committee version
- [ ] Test at 360 px, 768 px, and 1440 px, then on a real Android phone
- [ ] Test current Chrome, Safari, and Firefox
- [ ] Re-run Lighthouse and keep all four scores at 95 or above
- [ ] Validate event JSON-LD with Google's Rich Results Test after setting the final URL
- [ ] Check the Open Graph preview in WhatsApp and LinkedIn
- [ ] Enable GitHub Pages, HTTPS, and any final DNS; submit the sitemap; generate the final QR code

## Licence and trademarks

The code is MIT licensed. Event content and logos are excluded. This is a student-organised event site, not an official IBM or Qiskit publication. All trademarks belong to their owners.
