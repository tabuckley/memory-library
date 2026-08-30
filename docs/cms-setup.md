# Editing content via Google Sheets

Artists, events and occurrences (dates/times) can be edited in a Google Sheet
instead of the JSON files in `data/`. Everything else — projects, places,
strands, locations, opening hours — stays in `data/*.json`, since it barely
changes and defines how the rest of the model fits together.

## One-time setup

1. **Create the sheet.** Make a new Google Sheet with three tabs named
   `artists`, `events` and `occurrences`. Import the matching file from
   `cms-template/` into each tab (File → Import → Upload → Insert new
   sheet(s)) — `events.csv` and `occurrences.csv` already contain the real
   current programme, so the sheet starts pre-filled instead of empty.
   `artists.csv` has one example row — overwrite it with real artists as
   they're confirmed.

2. **Publish each tab as CSV.** For each of the three tabs: File → Share →
   Publish to web → in the first dropdown choose the tab (not "Entire
   document") → in the second dropdown choose **Comma-separated values
   (.csv)** → tick **Automatically republish when changes are made** →
   Publish. Copy the URL it gives you.

3. **Paste the three URLs into the site.** Open `js/data.js` and fill in
   `SHEET_CSV_URLS` near the top:

   ```js
   const SHEET_CSV_URLS = {
     artists: "https://docs.google.com/…/pub?gid=…&single=true&output=csv",
     events: "https://docs.google.com/…/pub?gid=…&single=true&output=csv",
     occurrences: "https://docs.google.com/…/pub?gid=…&single=true&output=csv",
   };
   ```

That's it — from then on, editing a row in the Sheet updates the live site
within a few minutes (however long Google takes to republish), with no
redeploy needed. Leaving a URL blank keeps that table on the bundled JSON.

## Editing day-to-day

Just edit the sheet. A few things to know:

- **`id` is required and must be unique** within its tab (e.g. `artist-jane-doe`,
  `ev-new-workshop`). Nothing else references a row by anything but this id,
  so once you've picked one for a real event, don't change it — anything
  linking to it (occurrences, artist project links) would break.
- **List fields** (`projectIds`, `artistIds`, `locationIds`) take multiple
  ids separated by commas in a single cell, e.g. `queer-at-sea, salt-line`.
- **`confirmed`** takes `TRUE` or `FALSE`.
- **Leave a cell empty** for anything optional (`bookingUrl`, `ageGuidance`,
  `note`, `portraitCaption`, `dateStart`/`dateEnd` for timed events).
- **`bookingUrl`** — paste a full link (e.g. an Eventbrite page) and a
  "Book →" link appears on the programme automatically; leave it blank for
  free/drop-in events.
- A row missing an `id` is skipped entirely, so it's safe to leave a blank
  row at the bottom of a tab for typing into.

## If something looks wrong on the site

Open the browser console (F12). If a sheet fetch fails or times out, you'll
see a line like `[data] Falling back to bundled events.json — …` and the
site will keep showing the last version saved in `data/events.json` instead
of breaking. Re-publishing the tab (or just waiting a few minutes) usually
fixes it; if not, check the tab's Publish-to-web setting is still on.

## Column reference

**artists** — `id, name, discipline, placeId, bio, portraitCaption, projectIds`

**events** — `id, title, type, strandId, locationIds, artistIds, projectIds, summary, blurb, bookingStatus, bookingUrl, ageGuidance, mode, dateStart, dateEnd, confirmed`

**occurrences** — `id, eventId, date, startTime, endTime, locationId, note, confirmed`

`placeId`, `strandId`, `locationIds` must match an `id` in `data/places.json`,
`data/strands.json` and `data/locations.json` respectively — those are the
structural lists that don't move to the sheet.
