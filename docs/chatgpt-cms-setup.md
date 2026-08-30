# Task: set up the Memory Library content sheet in Google Drive

You have access to my Google Drive. Please create and configure a Google
Sheet exactly as specified below, so it can act as a lightweight CMS for a
website. Follow every step precisely — the website's code expects exact tab
names, exact column headers in the exact order, and a specific publishing
setting. At the end, report back the three URLs described in "What to
return" — nothing else needs to be sent back.

## 1. Create the spreadsheet

Create a new Google Sheet named **Memory Library CMS**.

It needs exactly three tabs (sheets within the file), named exactly:

- `artists`
- `events`
- `occurrences`

Delete the default empty "Sheet1" once the three are created, or rename it
to one of the three and add the other two.

## 2. Fill each tab with this exact data

Each block below is the full content for one tab, given as CSV. Row 1 in
each is the header row — enter it exactly as shown, in this column order.
Then add one data row per line below it. Where a cell contains commas
inside quotes (e.g. a sentence with commas in it), that whole quoted
section is ONE cell — don't split it across columns.

### Tab: `artists`

This one only needs the header row plus one example row (placeholder
content — leave it or overwrite it, it doesn't matter):

```csv
id,name,discipline,placeId,bio,portraitCaption,projectIds
artist-example,Example Artist,Visual artist,portsmouth,"A short biography goes here. It can contain commas, like this, and it will still work.","Portrait, 2026",queer-at-sea
```

### Tab: `events`

This is real content — enter every row exactly as given (15 rows of data
plus the header):

```csv
id,title,type,strandId,locationIds,artistIds,projectIds,summary,blurb,bookingStatus,bookingUrl,ageGuidance,mode,dateStart,dateEnd,confirmed
ev-exhibition,Resonate,Exhibition,resonate,main,,,"New commissions from Resonate, Play Office's artist development programme, shown continuously throughout Memory Library.",Resonate artist commissions.,FREE,,,ongoing,2026-11-13,2026-11-21,TRUE
ev-film-programme,Film Programme,Screening,memory-library,cinema,,,"A continuous programme of moving-image work, showing throughout the day in the Cinema.",Moving-image screenings.,FREE,,,ongoing,2026-11-13,2026-11-21,TRUE
ev-queer-at-sea,Queer at Sea,Exhibition,resonate,main,,queer-at-sea,"An exhibition exploring queerness, coastal space and belonging, shown throughout the daily programme.",Exhibition on queerness and coastal life.,FREE,,,ongoing,2026-11-13,2026-11-21,FALSE
ev-past-makes-future,Past Makes Future,Special Event,past-makes-future,main,,,"A one-day conference and gathering bringing together international delegates, artists and heritage partners.",Conference and international presentations.,BOOKING REQUIRED,,,timed,,,TRUE
ev-bangladesh-presentation,Bangladesh — Artist Presentation,Talk,past-makes-future,main,,,"A presentation from Zihan Karim and Shohrab Jahan, part of Past Makes Future.",Artist presentation.,BOOKING REQUIRED,,,timed,,,TRUE
ev-cairo-presentation,Cairo — Artist Presentation,Talk,past-makes-future,main,,,"A presentation from Raneem Elhaddad and Ahmed Nader, part of Past Makes Future.",Artist presentation.,BOOKING REQUIRED,,,timed,,,TRUE
ev-engine-creativity,Portsmouth as an Engine for Creativity,Talk,past-makes-future,main,,,"A panel with Gemma Nichols, Steve Pitt, Arts Council England and University of Portsmouth, on sector value and infrastructure.",Panel discussion.,BOOKING REQUIRED,,,timed,,,TRUE
ev-pageant,Pageant,Performance,past-makes-future,main,,,"An evening performance closing Past Makes Future. Doors 19:30, performance from 20:00.",Evening performance.,BOOKING REQUIRED,,18+,timed,,,TRUE
ev-people-library,People Library,Participatory,people-library,main,,,"People, not books, as a browsable living collection. Drop in and borrow a person for twenty minutes.","Borrow a person, not a book.",DROP IN,,,timed,,,TRUE
ev-bangladesh-workshop,Bangladesh Workshop,Workshop,past-makes-future,main,,,"A workshop connected to Bangladesh, part of Memory Library's international exchange.",Workshop connected to Bangladesh.,BOOKING REQUIRED,,,timed,,,TRUE
ev-bangladesh-screening,Bangladesh Screening,Screening,past-makes-future,cinema,,,"A screening connected to Bangladesh, part of Memory Library's international exchange.",Screening connected to Bangladesh.,FREE,,,timed,,,TRUE
ev-egypt-workshop,Egypt Workshop,Workshop,we-shine,main,,,"A workshop connected to Egypt, part of Memory Library's international exchange.",Workshop connected to Egypt.,BOOKING REQUIRED,,,timed,,,TRUE
ev-lebanon-workshop,Lebanon Workshop,Workshop,we-shine,main,,,"A workshop connected to Lebanon, part of Memory Library's international exchange.",Workshop connected to Lebanon.,BOOKING REQUIRED,,,timed,,,TRUE
ev-we-shine-lates,We Shine,Special Event,we-shine,"main, cinema, exterior",,,"Boathouse 5 stays open into the evening as part of We Shine, with the exhibition continuing and the exterior projection running after dark.",Evening opening for We Shine.,FREE,,,timed,,,FALSE
```

### Tab: `occurrences`

Also real content — 20 rows of data plus the header:

```csv
id,eventId,date,startTime,endTime,locationId,note,confirmed
occ-people-library-1,ev-people-library,2026-11-13,18:00,22:00,main,,TRUE
occ-pmf-open,ev-past-makes-future,2026-11-14,13:00,18:00,main,Full running order on the Past Makes Future page,TRUE
occ-bangladesh,ev-bangladesh-presentation,2026-11-14,14:15,14:45,main,,TRUE
occ-cairo,ev-cairo-presentation,2026-11-14,14:45,15:15,main,,TRUE
occ-engine-creativity,ev-engine-creativity,2026-11-14,17:30,18:15,main,,TRUE
occ-pageant,ev-pageant,2026-11-14,20:00,22:30,main,,TRUE
occ-people-library-2,ev-people-library,2026-11-15,11:00,13:00,main,,TRUE
occ-bangladesh-workshop,ev-bangladesh-workshop,2026-11-15,14:00,15:30,main,,FALSE
occ-bangladesh-screening,ev-bangladesh-screening,2026-11-15,16:00,17:00,cinema,,FALSE
occ-people-library-16,ev-people-library,2026-11-16,11:00,13:00,main,,TRUE
occ-people-library-17,ev-people-library,2026-11-17,11:00,13:00,main,,TRUE
occ-people-library-18,ev-people-library,2026-11-18,11:00,13:00,main,,TRUE
occ-people-library-3,ev-people-library,2026-11-19,11:00,13:00,main,,TRUE
occ-we-shine-1,ev-we-shine-lates,2026-11-19,17:00,21:00,exterior,,FALSE
occ-people-library-4,ev-people-library,2026-11-20,11:00,13:00,main,,TRUE
occ-egypt-workshop,ev-egypt-workshop,2026-11-20,14:00,15:30,main,,FALSE
occ-we-shine-2,ev-we-shine-lates,2026-11-20,17:00,21:00,exterior,,FALSE
occ-people-library-5,ev-people-library,2026-11-21,11:00,13:00,main,,TRUE
occ-lebanon-workshop,ev-lebanon-workshop,2026-11-21,14:00,15:30,main,,FALSE
occ-we-shine-3,ev-we-shine-lates,2026-11-21,17:00,21:00,exterior,,FALSE
```

The easiest reliable way to get this in cleanly: create each tab, click
cell A1, then paste the whole CSV block for that tab — Google Sheets will
split it into columns and rows automatically, including handling the
quoted commas correctly. Don't retype it by hand.

## 3. Make it readable by link, and get each tab's CSV export URL

Don't use File → Share → Publish to web for this — it's a UI-only feature
with no API behind it, so it isn't something you can carry out through a
Drive/Sheets connector. Use this instead, which does the same job (a
stable public CSV link per tab that stays live as the sheet is edited) and
is fully doable through the Drive/Sheets API:

1. **Set the spreadsheet file's sharing to "Anyone with the link" → Viewer.**
   This is a normal Drive permission change (a `permissions.create` call
   with type `anyone`, role `reader`, if you're doing this via API) — not
   the Publish-to-web dialog.
2. **Get the spreadsheet's file ID** (the long id in its URL, or from the
   Drive API response when you created it).
3. **Get each tab's `gid`** (its internal sheet ID) — e.g. via the Sheets
   API (`spreadsheets.get`, reading `sheets[].properties.sheetId` for each
   of the three tabs), or by opening each tab in the Sheets UI and reading
   the number after `#gid=` in the address bar.
4. **Construct the CSV URL for each tab** using this exact pattern:

   ```
   https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/export?format=csv&gid=<GID>
   ```

   One URL per tab, using that tab's own `gid`. This works with no login
   because of the "Anyone with the link" permission from step 1 — a
   website can `fetch()` it directly.

## 4. Sharing

Only the spreadsheet's general access needs to change (to "Anyone with the
link" → Viewer, as above) — nothing needs publishing, and no other Drive
files are affected. Just don't revoke that link-sharing permission later,
since a live website reads from those URLs.

## 5. What to return

Reply with exactly this, filled in:

```
artists:      <url>
events:       <url>
occurrences:  <url>
```

Each `<url>` should be a full `.../export?format=csv&gid=...` link as
built in step 3. That's the entire deliverable — three URLs, clearly
labelled. I'll paste them into the website's config myself.
