# 🐾 PawJakarta — Setup & Deployment Guide

A responsive pet-friendly places directory for Jakarta, powered by Google Sheets as a backend.

---

## File Structure

```
pawjakarta/
├── index.html          ← Main website
├── css/
│   └── style.css       ← All styles (responsive)
├── js/
│   ├── config.js       ← 🔧 YOUR SETTINGS GO HERE
│   ├── data.js         ← Data layer (fetch + fallback)
│   ├── app.js          ← UI logic (render, filter, modal, form)
│   └── apps-script.gs  ← Google Apps Script (paste into Sheet)
└── README.md
```

---

## Step 1 — Set Up Your Google Sheet (Read)

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name the first tab `Sheet1`.
3. Add these **exact headers** in Row 1:

   | id | name | area | type | address | hours | pet_size | rules | notes | status |

4. Paste in the starter data from `js/data.js` (the `FALLBACK_DATA` array).
5. Go to **File → Share → Publish to web**
   - Under "Link", choose **"Sheet1"** and **"Comma-separated values (.csv)"**
   - Click **Publish** and copy the URL.
6. Open `js/config.js` and replace `YOUR_SHEET_ID` in `SHEET_CSV_URL` with your copied URL.

> **Tip**: Set `status = "published"` for live entries. Entries with `status = "pending"` are hidden from the site.

---

## Step 2 — Set Up Google Apps Script (Submit Form / Write)

1. In your Google Sheet, go to **Extensions → Apps Script**.
2. Delete any existing code, then paste the entire contents of `js/apps-script.gs`.
3. Click **Save** (Ctrl+S).
4. Click **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, authorize the app, then **copy the Web App URL**.
6. Open `js/config.js` and replace `YOUR_SCRIPT_ID` in `APPS_SCRIPT_URL` with your copied URL.

---

## Step 3 — Deploy the Website

### Option A: Netlify (Recommended — Free)
1. Sign up at [netlify.com](https://netlify.com)
2. Drag and drop the `pawjakarta/` folder onto the Netlify deploy zone
3. Done — you get a free `*.netlify.app` URL instantly
4. For a custom domain (e.g. `pawjakarta.com`), add it in Site Settings → Domains

### Option B: Vercel (Free)
1. Push the folder to a GitHub repo
2. Sign in at [vercel.com](https://vercel.com) and import the repo
3. No build step needed — Vercel serves it as a static site

### Option C: GitHub Pages (Free)
1. Create a GitHub repo and push the files
2. Go to repo Settings → Pages → Source: main branch / root
3. Your site is live at `https://yourusername.github.io/pawjakarta/`

---

## Managing Data

### Adding new places
- Open your Google Sheet, add a new row with `status = "published"`.
- The site fetches fresh data from the sheet (cached for 5 minutes).

### Reviewing submissions
- Submissions from the website form arrive with `status = "pending"`.
- Review them in the sheet and change `status` to `"published"` to make them live.

### Getting email notifications for new submissions
- In your Apps Script, uncomment the `MailApp.sendEmail(...)` line and add your email address.

---

## Features

- ✅ Responsive — mobile, tablet, desktop
- ✅ Live Google Sheets integration (read + write)
- ✅ Graceful fallback to bundled data if the sheet is unreachable
- ✅ Search by name, area, or notes
- ✅ Filter by category (Parks, Cafés, Malls, Restaurants, Small pets)
- ✅ Sort alphabetically or by area
- ✅ Expandable detail modal with address, rules, pet size
- ✅ Google Maps link from each place
- ✅ Web Share API for sharing places
- ✅ Submit form with Google Sheets backend
- ✅ "Likely open" indicator based on time of day
- ✅ Staggered card animations

---

## Google Sheet Column Reference

| Column    | Description                                      | Example |
|-----------|--------------------------------------------------|---------|
| id        | Unique number (auto-increment)                   | 1 |
| name      | Place name                                       | Como Park |
| area      | Neighborhood + district                          | Kemang, South Jakarta |
| type      | One of: park, cafe, mall, restaurant, other      | park |
| address   | Full street address                              | Jl. Kemang Timur No.15 998 |
| hours     | Opening hours as text                            | Daily 10:00 AM – 10:00 PM |
| pet_size  | All sizes / Small only / etc.                   | All sizes |
| rules     | Rules separated by semicolons (`;`)              | Leash required; Vaccination needed |
| notes     | Extra info for visitors                          | Popular weekend spot |
| status    | published / pending                              | published |
