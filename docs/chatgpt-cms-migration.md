# Migration task: merge the `projects` tab into `events`

This supersedes the "projects" tab work from before. After digging into
how the site actually uses this content, projects and events turned out
to be the same kind of thing in practice — every exhibition/artwork also
needs a date range, a location and a booking status to be useful to a
visitor, so keeping them in two tables just meant re-typing the same
title/artist/image twice and keeping two rows in sync by hand. They're
now one table. Every event can have its own full detail page (image,
long body copy, year) — it doesn't need a separate project row for that
anymore.

Please do the following, in order, on the **Memory Library CMS** sheet:

## 1. Add four columns to the `events` tab

Add these column headers (anywhere in the tab — column order doesn't
matter): `placeId`, `year`, `mediaCaption`, `body`. Leave them blank on
existing rows for now — the next step fills in the two that need it.

## 2. Update two existing event rows with their project content

These two already exist in `events` and already correspond to something
in the `projects` tab. Fill in these four cells on each:

**`ev-queer-at-sea`** row:
- `placeId`: `portsmouth`
- `year`: `2026`
- `mediaCaption`: `STILL — Queer at Sea`
- `body`: `Queer at Sea runs throughout Memory Library's daily programme, part of the ongoing exhibition in the Main Space.`

**`ev-people-library`** row:
- `placeId`: `portsmouth`
- `year`: `2026`
- `mediaCaption`: `STILL — People Library`
- `body`: `People Library is a participatory Memory Library project centred on personal and community memories. Audiences can meet and borrow a person for a conversation, turning lived experience into a shared, temporary archive.`

(Leave everything else on these two rows exactly as it is — title, type,
strandId, summary, blurb, bookingStatus, mode, dates, confirmed all stay
the same.)

## 3. Add five new rows to the `events` tab

These five projects don't have a matching event yet — add them as new
rows. All five: `locationIds` = `main`, `placeId` = `portsmouth`,
`artistIds` = blank, `year` = `2026`, `blurb` = same text as `summary`,
`bookingStatus` = `FREE`, `bookingUrl`/`imageUrl`/`ageGuidance` = blank,
`mode` = `ongoing`, `dateStart` = `2026-11-13`, `dateEnd` = `2026-11-21`.

```csv
id,title,type,strandId,summary,body,mediaCaption,confirmed
ev-memory-bar,Memory Bar,Sensory participatory artwork,memory-library,"A sensory artwork using taste, smell, storytelling and participation to explore memory.","Memory Bar returns as part of Memory Library, creating an intimate participatory space where sensory experiences, drinks and stories become prompts for remembering and sharing personal histories.",STILL — Memory Bar,TRUE
ev-empathy-index,Empathy Index,Digital artwork,memory-library,"A digital commission exploring empathy, connection and the ways technology can make relationships between people visible.","Empathy Index is being developed as a digital artwork within the wider Memory Library programme, using creative technology to explore connection, social relationships and empathy.",STILL — Empathy Index,FALSE
ev-international-open-studio,International Open Studio,Exhibition / open studio,past-makes-future,"An open studio bringing together visiting artists from international exchange programmes with Portsmouth audiences and artists.","International Open Studio presents work, process and research by visiting artists from Bangladesh, Cairo and Lebanon through informal showings and public exchange, connecting international practices with Portsmouth's cultural community.",STILL — International Open Studio,FALSE
ev-memory-donation,Memory Donation,Participatory artwork,memory-library,"A participatory project inviting people to contribute memories to the evolving Memory Library archive.","Memory Donation creates a route for audiences and communities to contribute their own memories, stories and fragments to Memory Library, treating participation itself as part of the artwork and archive.",STILL — Memory Donation,FALSE
ev-memory-box,Memory Box,Interactive installation,memory-library,"An interactive installation exploring how memories can be collected, held, encountered and shared.","Memory Box forms part of Memory Library's wider exploration of personal archives and shared memory, using an installation format to turn acts of remembering and collecting into a public experience.",STILL — Memory Box,FALSE
```

(Those columns above are just the ones with new values — remember each
new row also needs `locationIds=main`, `placeId=portsmouth`, `year=2026`,
`blurb`=same as `summary`, `bookingStatus=FREE`, `mode=ongoing`,
`dateStart=2026-11-13`, `dateEnd=2026-11-21` filled in too, per the intro
above.)

## 4. Delete the `projects` tab entirely

Once steps 2–3 are done, every row that was in `projects` now has an
equivalent in `events`. Right-click the `projects` tab → Delete.

## 5. Clean-up (optional but recommended)

The `projectIds` column on both the `artists` tab and the `events` tab is
no longer used by the site — safe to delete both columns, though leaving
them (empty or not) causes no harm.

---

No reply needed beyond confirming this is done, or flagging anything that
didn't match what's described here.
