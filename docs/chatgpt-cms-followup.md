# Follow-up task: add image/link columns, two new tabs, verify schedule

This is a follow-up to the sheet you already set up ("Memory Library CMS",
with `artists`, `events` and `occurrences` tabs). Five changes needed.

## 1. Add columns to the `artists` tab

Add three new column headers, exactly named below, anywhere in that tab
(column order doesn't matter — the site reads columns by name, not
position). Leave them blank on existing rows for now.

- `photoUrl` — an artist's real headshot. To use it: upload the photo to a
  Google Drive folder, get its shareable link (Share → "Anyone with the
  link" → copy link), paste that link straight into the cell. Either of
  these link formats works: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
  or `https://drive.google.com/open?id=FILE_ID`. Leave blank and that
  artist keeps showing the site's placeholder image — nothing breaks.
- `portfolioUrl` — a link to the artist's own website/portfolio. Shown as
  a "Portfolio →" link on their page when present.
- `instagramUrl` — a link to their Instagram. Shown as "Instagram →" next
  to the portfolio link when present. Both are optional; leave blank if
  not applicable.

## 2. Add an `imageUrl` column to the `events` tab

One new column header named exactly `imageUrl`, anywhere in the `events`
tab. Same Drive-link format as above, same rule: blank is fine, an event
just won't show a photo in its expanded detail until one's added.

## 3. Add a new `pmf-sessions` tab — this one's more involved, please read carefully

This is a genuinely separate table from `events`/`occurrences`, not just
another column. It turns out the Past Makes Future page's detailed running
order (individual conference talks, panels, breaks, the Pageant lineup)
was never wired into the sheet at all — it lived only in a static file on
the site, so editing an event's title in the `events` tab had no effect on
it. This fixes that gap.

Add a fourth tab named exactly `pmf-sessions`, with header row `section,time,title,purpose,who`, and paste in this real running order exactly as given (21 rows):

```csv
section,time,title,purpose,who
conference,13:00,Open,,
conference,14:00,Welcome,"Outline of the day and housekeeping, TB presentation, intro Slido Q1",TB
conference,14:15,Bangladesh Presentation,,Zihan Karim & Shohrab Jahan
conference,14:30,Bangladesh Panel,Q&A,TB hosts
conference,14:45,Cairo Presentation,,Raneem Elhaddad & Ahmed Nader
conference,15:00,Cairo Panel,Q&A,TB hosts
conference,15:15,Lebanon Presentation,,Lara Kobeissi & TBC
conference,15:30,Lebanon Panel,Q&A,TB hosts
conference,15:45,Artist Profile Round Up,"Curated round-up and Slido Q2, Pageant reminder",Lisa BC & TB
conference,16:00,Break,,
conference,16:45,Resonate Artists Panel,Profiling artworks shown in the room,Three Resonate artists & TB
conference,17:15,Jersey Artist,Presentation,
conference,17:30,Portsmouth as an Engine for Creativity,Sector value and infrastructure,"Gemma Nichols, Steve Pitt, Arts Council England & University of Portsmouth"
conference,17:45,Reflections & Close,Slido Q3,TB
conference,18:00,Networking & Dinner,,
pageant,19:30,Doors Open,,Misha
pageant,20:00,Pageant Begins,,
pageant,20:45,Break,,Misha · Judges: CP, Mistly & TBC
pageant,21:30,KLONN — Headline,,
pageant,22:00,Ends,,
pageant,22:30,Close,,
```

`section` must be exactly `conference` or `pageant` (lowercase) — that's
what tells the site which half of the page a row belongs to. Row order
within each section is the display order, so keep them in this sequence.

## 4. Please double-check the `occurrences` tab against this

This tab drives every date and time on the live programme page, so it's
worth confirming it exactly matches what's below rather than assuming the
original paste took cleanly. If any row differs, fix it to match this
exactly (id, eventId, date, startTime, endTime, locationId, note,
confirmed):

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

Notes on what this represents, in case a mismatch needs judgement to
resolve: this is the real Memory Library programme running 13–21 Nov 2026
at Boathouse 5. People Library runs most days 11:00–13:00 (18:00–22:00 on
the opening day, 13 Nov). Past Makes Future (14 Nov) is a one-day
conference 13:00–18:00 with three talks inside it (Bangladesh, Cairo,
"Portsmouth as an Engine for Creativity") followed by Pageant 20:00–22:30
as a separate but same-day event. The Bangladesh workshop/screening are 15
Nov, Egypt workshop 20 Nov, Lebanon workshop 21 Nov (all still
provisional, `confirmed: FALSE`, hence unconfirmed times). We Shine
evening opening runs 19–21 Nov, 17:00–21:00, exterior location.

## 5. Add a new `projects` tab

Projects are exhibitions/artworks (distinct from `events`, which are
schedule listings — see the note at the very end about the difference).
Add a fifth tab named exactly `projects`, header row
`id,title,year,artistIds,strandId,placeId,type,intro,body,mediaCaption,mediaUrl,confirmed`,
with this one real row so far:

```csv
id,title,year,artistIds,strandId,placeId,type,intro,body,mediaCaption,mediaUrl,confirmed
queer-at-sea,Queer at Sea,2026,,resonate,portsmouth,Exhibition,"An exhibition exploring queerness, coastal space and belonging.","Queer at Sea runs throughout Memory Library's daily programme, part of the ongoing exhibition in the Main Space.",STILL — Queer at Sea,,FALSE
```

`mediaUrl` works the same as `photoUrl`/`imageUrl` elsewhere (a Drive
share link, blank for the placeholder image). `artistIds` is blank here —
fill it in with an artist's `id` (comma-separated if more than one) once
a specific artist is confirmed for this project.

---

**One thing worth flagging back to whoever's editing this sheet day to
day**: an artist's `projectIds` field should only ever contain ids from
the `projects` tab (exhibitions/artworks) — not ids from `events` or
`occurrences`. Those are a different, separate kind of link: to connect
an artist to something on the schedule (a talk, a workshop, a screening),
add that artist's id to the **event's own `artistIds` column** instead —
the artist's page automatically shows everything scheduled that way under
"On the programme," no need to edit anything on the artist row for that.
Putting an event/occurrence id into an artist's `projectIds` cell won't
crash the site (that's now handled gracefully), but it also won't do
anything — it'll just be ignored.

No reply needed beyond confirming all five changes are done (the three
artist columns, the events column, the new pmf-sessions tab, the new
projects tab, and that occurrences matches) — or noting what you had to
correct, if anything.
