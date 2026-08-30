# Editing content via Google Sheets

Artists, events, occurrences (dates/times) and the Past Makes Future running
order can be edited in a Google Sheet instead of the JSON files in `data/`.
Everything else — projects, places, strands, locations, opening hours —
stays in `data/*.json`, since it barely changes and defines how the rest of
the model fits together.

## One-time setup

1. **Create the sheet.** Make a new Google Sheet with four tabs named
   `artists`, `events`, `occurrences` and `pmf-sessions`. Import the
   matching file from `cms-template/` into each tab (File → Import →
   Upload → Insert new sheet(s)) — `events.csv`, `occurrences.csv` and
   `pmf-sessions.csv` already contain the real current programme, so the
   sheet starts pre-filled instead of empty. `artists.csv` has one example
   row — overwrite it with real artists as they're confirmed.

2. **Share the sheet by link.** Click **Share** (top right) → change
   "General access" to **Anyone with the link**, role **Viewer** → Done.
   (Publish-to-web would also work, but it's a manual UI-only action with
   no API behind it — link-sharing is the one that a Drive-connected
   assistant can also do on your behalf, and both produce a live CSV link
   that updates instantly as you edit.)

3. **Point the site at it.** Open `js/data.js` and set `SHEET_ID` near the
   top to the sheet's file id (the long string in its URL, between `/d/`
   and `/edit`):

   ```js
   const SHEET_ID = "your-spreadsheet-id-here";
   ```

   The three tab URLs (`SHEET_CSV_URLS`) are built from `SHEET_ID`
   automatically by tab name — nothing else to configure.

That's it — from then on, editing a cell in the sheet updates the live
site immediately (no republish delay, no redeploy). Blanking out one of
the `SHEET_CSV_URLS` entries falls that table back to its bundled JSON.

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
- **`photoUrl` (artists) / `imageUrl` (events)** — upload the photo to a
  Google Drive folder, get its shareable link (Share → "Anyone with the
  link"), paste that link straight into the cell. Leave blank and that
  artist/event just keeps showing the site's placeholder image — nothing
  breaks. Any of Drive's usual link formats works
  (`.../file/d/FILE_ID/view?usp=sharing` or `.../open?id=FILE_ID`).
- A row missing an `id` is skipped entirely, so it's safe to leave a blank
  row at the bottom of a tab for typing into.

## If something looks wrong on the site

Open the browser console (F12). If a sheet fetch fails, times out, or comes
back looking like the wrong tab entirely (a real Google quirk: asking for a
tab name that doesn't exist silently returns the *first* tab's data instead
of an error), you'll see a line like `[data] Falling back to bundled
events.json — …` and the site will keep showing the last version saved in
`data/events.json` instead of breaking or showing wrong content. This
usually means either the sheet's general access got changed back to
restricted (check Share → General access is still "Anyone with the link"),
or a tab got renamed (tab names must stay exactly `artists`, `events`,
`occurrences`, `pmf-sessions`).

## Column reference

**artists** — `id, name, discipline, placeId, bio, portraitCaption, projectIds, photoUrl, portfolioUrl, instagramUrl`

**events** — `id, title, type, strandId, locationIds, artistIds, projectIds, summary, blurb, bookingStatus, bookingUrl, imageUrl, ageGuidance, mode, dateStart, dateEnd, confirmed`

**occurrences** — `id, eventId, date, startTime, endTime, locationId, note, confirmed`

**pmf-sessions** — `section, time, title, purpose, who` — drives the Past
Makes Future page's conference and pageant running order. `section` must
be exactly `conference` or `pageant`; row order is display order.

`placeId`, `strandId`, `locationIds` must match an `id` in `data/places.json`,
`data/strands.json` and `data/locations.json` respectively — those are the
structural lists that don't move to the sheet.
