# Dr. Salma Afroz — practice website

A fast, responsive, single-page website built with plain HTML, CSS, and JavaScript. It is ready for GitHub Pages and has no build step or paid dependency.

## The easy update protocol

All changing information lives in **one file: `content.js`**. The website reads that file and fills every section automatically. Optional information left as `""` is hidden.

To update the live site without using a terminal:

1. Sign in to GitHub and open this repository.
2. Click **`content.js`**.
3. Click the pencil icon (**Edit this file**).
4. Change only the words inside quotation marks. Do not remove commas, brackets, or quotation marks.
5. Click **Commit changes…**, write a short note such as `Update phone number`, then click **Commit changes** again.
6. Wait about 1–3 minutes and refresh the website.

For safety, use GitHub's preview/diff before committing. If a change causes a problem, open the file’s **History**, choose the previous working version, and use **Revert**.

## Every available input

The defaults below are already present in `content.js`. Replace placeholder text such as “Add city and country”.

| Group | Input | Example/default |
|---|---|---|
| Site | `eyebrow` | `Thoughtful care · Individual attention` |
| Site | `headline` | `A calm space to tell your whole health story.` |
| Site | `introduction` | Short introduction shown in the hero |
| Doctor | `name` | `Dr. Salma Afroz` |
| Doctor | `shortTitle` | `Licensed Homeopathic Practitioner` |
| Doctor | `photo` | Empty; use `assets/salma-afroz.jpg` after adding a photo |
| Doctor | `bio` | Short professional biography |
| Doctor | `philosophy` | How she works and what she values |
| Doctor | `credentials` | A list of licences, degrees, memberships, and years |
| Doctor | `languages` | `Bangla`, `English` |
| Clinic | `name` | `Jilani Dar Shefa` |
| Clinic | `location` | City and country |
| Clinic | `address` | Full public clinic address; optional |
| Clinic | `mapUrl` | Google Maps share link; optional |
| Clinic | `appointmentTypes` | In-person/online availability |
| Clinic | `consultationTypes` | The hospital, home-visit, and online consultation cards |
| Clinic | `hours` | Consultation days and hours |
| Contact | `phone` | Public phone number; optional |
| Contact | `whatsapp` | International format, e.g. `+8801...`; optional |
| Contact | `email` | Public practice email; optional |
| Contact | `facebook` | Facebook page URL |
| Contact | `bookingUrl` | Online booking link; optional and preferred by the main button |
| Approach | `intro` | Introduction to consultations |
| Approach | `steps` | Any number of `{ title, text }` items |
| Areas | `heading` | Section title |
| Areas | `intro` | Careful description of areas of interest |
| Areas | `items` | Any number of practice-interest labels |
| Preparation | `heading`, `intro`, `note` | Before-your-visit guidance |
| Preparation | `items` | Any number of questionnaire/checklist prompts |
| Resources | `heading`, `intro` | Educational-library introduction |
| Resources | `items` | Article objects with `category`, `title`, `summary`, `url`, and `source` |
| FAQ | `faqs` | Any number of `{ question, answer }` items |
| Legal | `disclaimer` | Footer health disclaimer |

### Adding list items

Copy an existing line and keep the same punctuation. For example:

```js
credentials: [
  "Licence name — authority, 2026",
  "Degree — institution, year"
],
```

For a new FAQ:

```js
{ question: "Your question?", answer: "Your answer." },
```

Avoid publishing patient names, private health information, unverified testimonials, guaranteed outcomes, or claims that homeopathy can replace medical diagnosis, vaccination, or effective treatment.

## Adding a practitioner photo

1. Prepare a clear portrait named `salma-afroz.jpg` (roughly 1200 × 1500 pixels, under 1 MB).
2. In GitHub, open the `assets` folder and choose **Add file → Upload files**.
3. Upload the image and commit it.
4. Change `photo: ""` in `content.js` to `photo: "assets/salma-afroz.jpg"` and commit again.

The generated still-life image is used until a photo is supplied.

## Publish with GitHub Pages

1. On GitHub, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select the `main` branch and the `/ (root)` folder, then click **Save**.
4. GitHub will display the public `github.io` address when deployment finishes.

If the repository is named `USERNAME.github.io`, the address is `https://USERNAME.github.io/`. Otherwise it is `https://USERNAME.github.io/REPOSITORY/`.

## Preview on a computer

Double-clicking `index.html` works for a quick preview. For a closer match to GitHub Pages, run any local static server in this folder, for example `python3 -m http.server 8000`, then open `http://localhost:8000`.

## Files

- `content.js` — all editable information
- `index.html` — page structure and metadata
- `styles.css` — layout, colours, typography, and responsive design
- `app.js` — fills the page from `content.js` and handles interactions
- `assets/hero-still-life.png` — generated default image
