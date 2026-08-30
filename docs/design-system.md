# Memory Library — design system & process notes

First working draft of the Memory Library website. Produced as a design-led
build: research → information architecture → design system → build → visual
QA → refine. This document records the decisions so a future contributor
(or a CMS integration) can pick it up without re-deriving them.

## 1. Skills used

This environment's available Claude Code skills are Artifact-focused
(`design`, `artifact-design`, `dataviz`, etc.) — built for publishing
claude.ai canvases, not for a real filesystem static site with its own git
remote. None applied directly. In their place:

- **Design system work** was done by hand (tokens → base → components),
  following the brief's own typographic/colour/grid specification.
- **Visual QA** was done with a real browser (Playwright driving the
  system Edge install) rather than judging from source — every page was
  rendered and screenshotted at desktop/laptop/tablet/mobile breakpoints,
  which is what caught the real bugs below (a broken `festivalDates()`
  reference, a CSS `order` bug that mis-placed grid children, a
  `position:sticky` overlap in the timetable, missing `<h1>`s, a dev-server
  query-string bug, and an over-stretched low-res photo).

## 2. Research → principles

Grounded in known conventions from contemporary art/cultural institution
sites (Serpentine, e-flux, biennale/festival programme sites) rather than
copying any one of them:

1. **Editorial list over card grid.** Programme and artist listings read as
   a numbered index/catalogue (rows, rules, mono metadata) — not a grid of
   identical cards.
2. **Type carries hierarchy, not colour.** Scale, spacing and line breaks
   do the work; weight range is kept to two (Regular/Medium).
3. **Metadata as its own register.** A monospace face (IBM Plex Mono) is
   used only for dates, times, locations, status and archive IDs —
   creating an "archival layer" without dating the whole site.
4. **Colour is sectioning, not branding.** Paper/foxed/blue/mint tones mark
   different sections the way different paper stock would in print; there
   are no coloured buttons or UI chrome.
5. **The programme must answer "what/when/where" in seconds.** Now/Next
   states are computed live from the same occurrence data that drives the
   full listings — never hand-maintained separately.
6. **Ongoing vs timed vs special-day are different data shapes,** not the
   same "event" forced into one mould — this is why the content model
   below splits Events from Occurrences.
7. **Mobile gets the list, not a shrunk desktop grid.** The Timetable view
   is still reachable on mobile (via horizontal scroll) but What's On is
   the default, mobile-first view.
8. **Real photography beats placeholder photography.** Where genuine
   images existed (see §5) they were used, correctly captioned and at a
   size that doesn't expose their native resolution; everywhere else a
   plain toned "plate" with a mono caption stands in rather than
   unrelated stock imagery.

## 3. Information architecture

Navigation: **Programme · Artists · Explore · About** + Search (matches
brief §53 — no separate "Projects" nav item; projects surface through
Artists/Programme/Explore).

Content model (`/data/*.json`, consumed client-side — see §6):

```
Programme Strand (Memory Library, Resonate, Past Makes Future, We Shine, People Library)
  └─ Event (title, type, strand, artists, projects, booking status, mode: ongoing|timed)
       └─ Occurrence (date, start/end time, location, status override)  — timed events only
Artist ── Project ── Place
Archive Item (ML-##### id, type, place, optional artist/project link, optional contributor)
Location (Entrance & Bar, Main Space, Cinema, Exterior) — the production
schedule tracks Main Space as two bays (left/right) for internal space
management, but the public site treats it as one location throughout.
```

`Event` vs `Occurrence` mirrors brief §38: an ongoing exhibition is one
`Event` with a date range and no exploded per-day rows; a recurring format
like *People Library* is one `Event` with several `Occurrence` rows.

Pages: Home, Programme (What's On + Timetable toggle, sharing one date-nav
and filter state), Artists (index), Artist (`artist.html?slug=`), Project
(`project.html?slug=`), Explore (search/filter across all six content
types), About.

## 4. Design system

- **Identity type:** the logo is a fixed image asset
  (`/assets/logo/ml-logo-black.png` / `ml-logo-white.png`) — Futura PT
  Medium, used exactly as supplied, never recreated in CSS.
- **Display type placeholder:** `--font-display` is set to **Jost**
  (Google Fonts), a structurally close, freely-licensed stand-in for
  Futura PT for on-page display type (section titles, artist names,
  large statements). **This is a licensing placeholder** — swap it for
  licensed Futura PT Medium in `css/tokens.css` and `css/base.css`'s
  Google Fonts `<link>` when available. Never touch the logo files
  themselves.
- **Editorial type:** Archivo — a grotesque distinct enough from Jost/
  Futura to give the "geometric identity + editorial reading" contrast
  the brief asks for, while avoiding the generic-SaaS read of Inter.
- **Metadata type:** IBM Plex Mono.
- **Colour tokens:** `css/tokens.css` — Archive White / Library Black /
  Paper White / Charcoal as the core, Foxed Paper / Faded Ochre / Dust /
  Old Label as warm archival tones, Faded Blue / Desaturated Mint as the
  two institutional accent tones. Never all in use at once on one screen.
- **Grid:** 12-column, fluid margins (`--margin`), `--content-max: 1560px`.
  Ad-hoc editorial layouts use the `.grid` utility with explicit
  `grid-column` spans per element; these collapse to full-width stacks
  below 760px (see the `!important` override in `base.css` — needed
  because it must beat inline `style="grid-column"` attributes).
- **Motion:** transitions only on hover states (filter chips, timetable
  cells, link underline spacing); all durations zero out under
  `prefers-reduced-motion`.

## 5. Content status — what's real vs placeholder

As of the latest pass, the site was deliberately stripped back to **only
what's in the real production documents** (the multi-page running schedule
PDF and the Past Makes Future/Pageant sheet) plus explicit instructions
given directly. Nothing invented beyond that is left in `/data/*.json`.

**Real, sourced from the production schedule / explicit instruction:**

- Dates (13–21 Nov 2026, Boathouse 5), locations (Entrance & Bar, Main
  Space, Cinema, Exterior — the schedule tracks Main Space as two bays for
  internal space management, the public site treats it as one), and the
  standard/extended opening hours per day.
- Ongoing activity: **Resonate** (the schedule's actual name for the daily
  Main Space exhibition — originally mislabelled "Memory Library:
  Exhibition" here, corrected), **Film Programme** (Cinema, daily), and
  **Queer at Sea** (exhibition title and "runs on Resonate's hours" given
  directly; its longer description is still a light, hedged gloss on the
  title alone).
- **People Library** — Main Space, 11:00–13:00 every standard day plus
  13 Nov 18:00–22:00, taken directly from the schedule (this also caught a
  real gap: 16/17/18 Nov were missing until a later pass).
- **Past Makes Future** (conference) and **Pageant** — the full running
  order in `data/past-makes-future.json`, including real presenter names
  (Zihan Karim, Shohrab Jahan, Raneem Elhaddad, Ahmed Nader, Lara Kobeissi,
  Gemma Nichols, Steve Pitt, Misha, KLONN, etc.) transcribed from the
  sheet. Unconfirmed names are shown as "TBC" rather than invented.
- **Bangladesh Workshop/Screening, Egypt Workshop, Lebanon Workshop** —
  real activities from the schedule; exact times aren't given so the
  occurrence times are marked `"confirmed": false` while the event's
  existence is `true`.
- **We Shine** (renamed from "We Shine Lates") — the Thu–Sat 19–21 Nov
  evening extension shown in the schedule.
- Three photographs (`assets/img/boathouse-*.jpg`,
  `resonate-session.jpg`) are real, cropped from the brief deck.
- The Resonate and Past Makes Future logos (`assets/logo/resonate-*.png`,
  `assets/logo/pmf-*.png`) are real supplied marks, converted to
  monochrome to match the site's palette.

**Explicitly removed, not real:** the invented "Empathy Index" commission,
Launch Night (confirmed invite-only — removed from the public data files
entirely, not just hidden in the UI, since `/data/*.json` is fetchable
directly), and an earlier full cast of invented Resonate artists and their
projects (Nusrat Jahan/Cloth Memory, Youssef El-Masry/Static Archive, Léa
Khoury/Salt Line, Nathan Sultana/Quarry Light, Élise Le Brun/Tideline
Recordings, Dan Prosser/People Library Sessions) along with the archive
records that referenced them. `artists.json` and most of `projects.json`
are currently empty as a result — `artists.html` and `artist.html` show a
plain "will be announced" state rather than crashing on empty data, and
the homepage's Selected Work section now features Queer at Sea alone.
This is the correct state until real artist/commission data exists —
resist the temptation to re-fill it with more placeholder people.

## 6. Interaction system (Draft 2)

Added after a critique pass — the first draft was functionally complete but
had no motion/interaction language, and most imagery was a flat colour
swatch rather than an actual placeholder photograph. Both are addressed
together, deliberately kept restrained (some sections still don't move at
all — see `.reveal` usage per page):

- **Placeholder photography** (`assets/img/placeholder/*.jpg`, generated,
  not real): soft toned gradient+grain images, one per palette tone
  (blue/mint/foxed/dust), landscape and portrait. `js/data.js`'s
  `placeholderSrc()`/`plateImg()` picks one deterministically per
  artist/project id (same id always renders the same image — this matters
  for the view-transition continuity below). They're deliberately abstract
  so nobody mistakes one for real documentation, but they're genuine
  photographic images, not `<div style="background:color">` — scale, crop
  and hover behaviour can be judged for real ahead of commissioned photography.
- **Cross-document View Transitions** (`css/motion.css`, opt-in via
  `@view-transition { navigation: auto }`, no JS): a project/artist image
  shares a `view-transition-name` (via `vtName()`) between its index/teaser
  position and its detail-page hero, so the browser morphs that element
  across the navigation instead of hard-cutting. Chromium-only today;
  everywhere else this is a no-op plain navigation. Chrome sometimes logs
  "Transition was skipped" to the console when it can't complete the morph
  (timing, fast synthetic clicks, etc.) — cosmetic, navigation still
  succeeds, nothing to fix.
- **Scroll-entry choreography** (`js/reveal.js`, `.reveal` class): one-shot
  fade+rise on first intersection, `prefers-reduced-motion` skips it
  entirely. Applied selectively per page, not globally.
- **De-badged status/filter UI**: status text, filter chips and access tags
  were bordered pill buttons in draft 1 — that reads as generic UI
  component library, not "quiet metadata." They're now plain inline type
  (underline or dot-separator) using the same on/dim language as the
  primary nav.
- **Programme rows expand in place** (`programme-page.js`): a synopsis and
  "more detail" link reveal via a CSS grid-rows trick (`0fr` → `1fr`) rather
  than every row being a bare link straight to another page.
- **Sliding active-state indicator** (`js/slider.js`): shared by the date-nav
  and the What's On/Timetable toggle — a single positioned element animates
  between states instead of the underline snapping.
- **Time-based recession**: past occurrences on the selected Programme day
  quietly fade (`.prog-row--past`) as the live clock passes them — reads
  as "time" as a theme and is functionally useful for orientation, not
  just decorative.
- **Timetable strand-linking**: hovering/focusing a timetable block quietly
  highlights other blocks from the same programme strand on screen.

## 7. Running it

Static site, no build step. `npm start` (`npx serve .`) or any static
host. `serve.json` disables clean-URL redirects — the default `serve`
behaviour strips query strings on redirect, which would silently break
every `?slug=`, `?date=`, `?q=` deep link. Data lives in `/data/*.json`
and is fetched client-side (`js/data.js`) — swapping that module for real
API calls is the only change a future CMS integration needs; the render
code doesn't care where the data came from.
