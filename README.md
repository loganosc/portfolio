# Logan Oscher · Portfolio

Source for my personal portfolio at **[loganoscher.com](https://loganoscher.com)**. I'm a UNC Computer Science + Media (AD/PR) student interested in web design, graphic design, and software engineering.

## What's inside

The site is a single landing page plus long-form case studies:

| Page | Project |
|---|---|
| `vanguard-case-study.html` | Vanguard redesign |
| `swiped-case-study.html` | Swiped, a UNC meal-swipe exchange |
| `digital-processing-fees-case-study.html` | Processing fees & the small business squeeze |
| `dinklink-case-study.html` | DinkLink, a pickleball matchmaking app |

The landing page (`index.html`) also features an eBay interface redesign and a UNC Hockey graphic collection.

## Stack

Plain HTML, CSS, and JavaScript with no build step. Icons come from Font Awesome.

```
index.html              landing page
*-case-study.html       case study pages
css/styles.css          all styles
js/main.js              interactions (project modal, navigation)
assets/                 images, icons, favicon
```

## Running locally

Open `index.html` in a browser, or serve the folder so relative paths behave like production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

Every push to `main` deploys the site to Hostinger over FTP via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The workflow needs two repository secrets: `FTP_USERNAME` and `FTP_PASSWORD`.

The deploy uses `dangerous-clean-slate: true`, so `public_html/` on the server is wiped and replaced with this repo's contents on each push. Anything uploaded to the server by hand will be removed.
