# Correction task: remove content pulled from the wrong Drive files

Ignore the previous version of this brief — it asked you to migrate five
"projects" (Memory Bar, Empathy Index, International Open Studio, Memory
Donation, Memory Box) from the `projects` tab into `events`. Those five
are **not real Memory Library content** — they were pulled from other,
unrelated projects in the Drive, not Memory Library's own materials. They
must not appear anywhere in this sheet or on the site. Sorry for the
back-and-forth — please undo/avoid that migration and do this instead.

The only two rows in the `projects` tab that are real are `queer-at-sea`
and `people-library` — and both already exist as real rows in the
`events` tab anyway (`ev-queer-at-sea`, `ev-people-library`), so nothing
from `projects` actually needs migrating into `events` at all.

## 1. Delete the `projects` tab entirely

Right-click the `projects` tab → Delete. None of its content needs to
move anywhere first — the two real entries are already duplicated in
`events`, and the other five were never real to begin with.

## 2. Check the `events` tab for contamination too

If any of these five ever got added as rows in the `events` tab, or if
`ev-queer-at-sea` / `ev-people-library` picked up new column values
(`placeId`, `year`, `mediaCaption`, `body`) sourced from that same bad
batch, remove/blank those out too. When in doubt about whether a value on
those two rows is genuine Memory Library content or something pulled in
by mistake, leave the cell blank rather than guessing — blank is always
safe (the site just shows less, never wrong info).

## 3. Going forward: only use the schedule document already shared

Please don't pull additional content from Drive for this project unless
it's explicitly pointed to. The real, authoritative source for Memory
Library's programme is the schedule document already shared earlier in
this process — not a general Drive search.

## 4. Clean-up (still applies, optional)

The `projectIds` column on both the `artists` tab and the `events` tab is
unused by the site — safe to delete both columns.

---

Reply confirming the `projects` tab is deleted and `events` doesn't
contain any of the five wrong entries (or the placeId/year/mediaCaption/
body values on the two real rows, unless you're confident those specific
values are genuine).
