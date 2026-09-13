# Memory Library — static site copy

This is every piece of copy on the site that is **not** editable via the Google
Sheet CMS (that covers `artists`, `events`, `occurrences`, `pmf-sessions` only —
see `docs/cms-setup.md`). Everything below is hardcoded directly into the site's
HTML/JSON files, so changing it means editing those files directly (ask Claude,
or edit by hand if you're comfortable with the codebase).

For each block: the current text, where it lives, and a length guide so a
rewrite still fits the design — none of this is a strict character-count limit
enforced by code, but going far past the guide risks the text wrapping awkwardly
or overflowing its column on smaller screens.

## House style — apply to any rewrite

- **No em dashes (—).** Use a comma, or a hyphen with spaces around it ( - ).
- UK English spelling (organisation, colour, programme not "program", etc.).
- Plain, accessible language — this is a free public programme aimed at "a
  broad public: residents, families, young people, artists and people who may
  not usually engage with digital art." Avoid jargon and art-world/marketing
  hype ("immersive," "unforgettable," "cutting-edge," "unique").
- Warm and direct, not salesy. Sentence case in the source text even where the
  design displays it in Uppercase — the uppercase look on headings/labels is
  done in CSS (`text-transform: uppercase`), so type them normally.
- Don't invent facts (names, numbers, dates, claims) that aren't already here.

---

## index.html — Homepage

**Hero meta** (small text over the hero video)
> Portsmouth / 2026
> Boathouse 5 / Portsmouth Historic Dockyard
Two short address fragments, not sentences. Keep each under ~6 words.

**Statement intro** (`.t-intro`, grid-column span 7, large intro-size text)
> An evolving programme of exhibitions, artworks, talks, workshops, screenings, performances, artist development and international exchange exploring memory, place, heritage, technology and connection.
One sentence. Current is ~30 words / 205 characters — keep close to that; this is the single largest piece of text on the homepage above the fold.

**Fact strip labels + values** (Where / When / Produced by / Curated by)
> Where: Boathouse 5, Portsmouth Historic Dockyard
> When: November 2026
> Produced by: Play Office
> Curated by: Thomas Buckley
Each value must fit in a narrow column (2-3 word budget) — these are facts, not sentences.

**"A new public space for memory" section** (`.t-title` heading + `.t-body`)
> A new public space for memory
Heading, ~5 words max, this exact size heading appears nowhere else so it can be distinctive.
> Memory Library brings heritage, creative technology, artist development and international exchange into one visible, accessible programme, asking how a city can use digital culture to remember, care and connect.
One sentence, ~30 words / 195 characters. Followed by a fixed link "About the programme →" (don't change the link label without telling Claude — it's a real link, not prose).

**Past Makes Future teaser**
> Sat 14 Nov 2026 (date label, don't change unless the date changes)
> Past Makes Future (title, fixed to match the strand name)
> An international artist conference and gathering, plus Pageant, a separate evening event on the same day.
One sentence, ~19 words / 115 characters, sits beside a photo at roughly a 4:3 ratio so don't let it run much longer or it'll overflow the photo's height.

**Artists & exchange teaser**
> Artists & exchange (heading, ~3 words)
> Memory Library brings together artists and collaborators from Portsmouth, Bangladesh, Cairo, Lebanon, Malta and Jersey through Resonate, Play Office's artist development programme.
One sentence, ~24 words / 155 characters.

**Leave a Memory teaser** (on a black background section)
> Have a memory, object or photograph connected to Portsmouth?
Heading phrased as a question, ~9 words. This exact sentence is reused verbatim on the About page too — if you change it, change both (see below), they're currently kept identical on purpose.
> Memory Library is built from the everyday stories of the people who make up this city. Bring yours with you, or get in touch ahead of time.
Two sentences, ~26 words / 155 characters.

**Supported by** — logo strip, one alt-text label per logo, not really "copy" to rewrite. Currently: Arts Council England (has a required funding-credit alt text, see About page section below for the exact wording), British Council, Portsmouth Creates, Portsmouth Historic Quarter.

---

## about.html — About page

**Page heading + intro** (`.t-display` h1 + `.t-intro`)
> Personal memory and shared heritage
Heading, ~5 words, this is the biggest heading on the site (bigger than the homepage's), so keep it short and punchy.
> Memory Library explores the relationship between personal memory and shared heritage. It is interested in the everyday experiences that traditional heritage systems often overlook - local places, nightlife, shops, technology, music, domestic objects, routines, photographs, personal stories.
Two sentences, ~38 words / 240 characters, second sentence ends in a list — that's a deliberate rhythm, feel free to swap the list items but keep the "X, Y, Z, ..." shape.

**Second paragraph** (`.t-body`, narrower column)
> When individual experiences are placed alongside one another, they begin to reveal a broader shared history. Memory Library explores this through contemporary art, participation, immersive technology, digital culture and artist development, bringing new commissions, workshops, talks and international exchange to Boathouse 5.
Two sentences, ~44 words / 270 characters.

**Photo caption**
> Play Office artist development session
~5 words, describes the photo directly above the About page's "At a glance" section.

**At a glance** — six short fact fields in one row (Location / Dates / Format / Lead organisation / Curated by / Public context). Each value is 2-3 words max, e.g. "10-day public pop-up", "We Shine, Portsmouth's light festival". These are facts, not sentences — don't turn any of them into a sentence, the layout only has room for a short phrase.

**Play Office section** (heading "Play Office", labelled "Produced by")
> Play Office works across immersive technology, digital art, participation, heritage and artist development. Memory Library builds on Play Office's existing programmes, bringing years of artist development, public engagement and international exchange into one visible, ambitious public programme at Boathouse 5.
Two sentences, ~40 words / 255 characters.
> Through Resonate, Play Office's artist development programme, new commissions are supported from research through to public presentation, several of which are shown for the first time at Memory Library.
One sentence, ~28 words / 180 characters.

**International exchange**
> Memory Library connects Portsmouth to a wider network of places through artist exchange and collaboration.
One sentence, ~15 words / 95 characters — this is a `.t-intro` size line so keep it short, it's meant to read almost like a subheading.
Below it: Portsmouth, Bangladesh, Cairo, Lebanon, Malta, Jersey as a row of place names (1-2 words each, not sentences).

**Audience & access**
> Memory Library is for a broad public - residents, families, young people, artists and people who may not usually engage with digital art. It aims to make emerging technology tactile, social and accessible.
Two sentences, ~33 words / 200 characters.
Tag row (not sentences, short labels only): Free access / Plain English / Tactile interaction / Low digital confidence routes / Non-digital routes / Underrepresented communities.
> This website targets WCAG 2.2 AA. If you need information in a different format, or have an access question about visiting Boathouse 5, contact the Memory Library team via Play Office.
Small print, two sentences, ~30 words / 185 characters.

**Partners & funders** — logo strips only. One alt text is a required funding-credit line, keep this one close to exact wording since funders often require specific phrasing: "Arts Council England - Supported using public funding by Arts Council England, Lottery Funded."

**Contribute / Leave a Memory teaser** — same two blocks as the homepage's version (see above); currently identical wording on purpose.

---

## memory.html — Leave a Memory page

**Page heading + intro**
> Leave a Memory
Heading, fixed as the page's identity — see below if you want this page retitled instead of just its body copy changed.
> Memory Library is built from the everyday experiences, objects and stories of the people who make up Portsmouth. If you have a memory, photograph or object connected to the city, we'd like it to be part of the exhibition.
Two sentences, ~37 words / 230 characters.

**What we're looking for**
> The everyday experiences that traditional heritage systems often overlook - local places, nightlife, shops, technology, music, domestic objects, routines, photographs, personal stories. Nothing is too ordinary.
Two sentences, ~26 words / 165 characters. Same "everyday experiences ... overlook" list as the About page — kept consistent on purpose.

**How it works** (this is the section just rewritten around the People Library concept — sculptures, sometimes staffed by local charities/community groups, otherwise self-directed)
> Bring it with you and leave it at the People Library, a collection of sculptures within the exhibition that you interact with directly to leave your memory - no need to book, just drop in.
> Sometimes you'll find people from local charities and community groups there to talk to as well, but otherwise it's entirely self-directed.
> Memories shared this way become part of the physical exhibition and archive at Boathouse 5, not a database on this website.
Three short paragraphs, ~30/22/20 words each. "People Library" is a real link to that event's page — keep it as a distinct phrase if you rewrite around it.

**Can't make it in person?**
> Contact the Memory Library team via Play Office.
One short sentence, ~8 words.

---

## programme.html — Programme page

**Page intro**
> Programme (h1, fixed)
> Exhibitions, talks, workshops, screenings and performances. 13-21 November 2026, Boathouse 5.
One short sentence, ~11 words / 80 characters — sits in a narrow side column next to a large heading, don't let it run to more than ~2 lines.

## artists.html — Artists page

**Page intro**
> Artists (h1, fixed)
> Artists and collaborators from Portsmouth and Memory Library's international exchange - Bangladesh, Cairo, Lebanon, Malta and Jersey.
One sentence, ~16 words / 105 characters, same narrow-column constraint as Programme's intro above.

## past-makes-future.html

No hardcoded body copy on this page — everything (the conference agenda, Pageant card, running order) comes from the `pmf-sessions` tab and the `ev-past-makes-future` / `ev-pageant` rows on the `events` tab, both CMS-editable already.

---

## Header & footer (appear on every page)

**Nav labels** (site header): Programme / Artists / About / Leave a Memory — 1-2 words each, these are also URLs' visual identity, changing them changes what every page's nav says.

**Footer columns:**
- Visit: address block (Boathouse 5 / Portsmouth Historic Dockyard / Portsmouth, PO1 3LJ) - factual, don't touch unless the address changes.
- Programme: What's On / Timetable / Artists (links, 1-2 words each)
- About: About Memory Library / Play Office / Access (links, 1-3 words each)
- Take part: "Have a memory connected to Portsmouth? We'd love to hear it." (~11 words) + "Leave a memory →" link

**Footer bottom line:**
> Memory Library · Produced by Play Office · Curated by Thomas Buckley
> Boathouse 5 · November 2026
Fixed-format credit lines, mono font, very tight — don't extend these into sentences.

---

## Bundled JSON descriptions (code-sourced, not sheet-editable — these need Claude to edit)

**Strand descriptions** (`data/strands.json`) — shown on the site wherever a strand is referenced:
- Memory Library (umbrella): "The full programme: exhibitions, artworks, talks, workshops, screenings, performances and exchange exploring memory, place, heritage, technology and connection." (~20 words)
- Resonate: "Play Office's artist development programme. Work made through Resonate runs throughout Memory Library." (~13 words)
- Past Makes Future: "An international artist conference and gathering, plus Pageant, a separate evening event on the same day." (~18 words)
- We Shine: "Memory Library becomes a new hub within We Shine, Portsmouth's light festival, the daytime exhibition continues while Boathouse 5 opens into the evening." (~24 words)
- People Library: "A recurring participatory strand: sculptures, like the sofa, where you can sit and chat or leave a memory. Drop in and explore." (~22 words)
All one or two sentences, ~15-25 words each — these appear as small supporting text, not headlines.

**Location descriptions** (`data/locations.json`, the physical spaces inside Boathouse 5):
- Entrance & Bar: "Arrival, ticketing, bar and the first encounter with the programme." (~11 words)
- Main Space: "Boathouse 5's main hall - exhibition, talks, presentations and performance." (~10 words)
- Cinema: "Screenings and moving-image work." (~4 words)
- Exterior: "The dock frontage outside Boathouse 5 - evening projection and We Shine activity." (~13 words)
Very short, fragment-style descriptions (not full sentences) — keep that style, ~4-13 words each.

**Place descriptions** (`data/places.json`, the international exchange partners):
- Portsmouth: "Home of Play Office and Boathouse 5. Memory Library begins from Portsmouth's own overlooked and everyday heritage." (~17 words)
- Bangladesh / Cairo: "International exchange partner city, connected through artist presentation and collaboration." (~10 words, identical wording for both currently)
- Lebanon / Malta / Jersey: "International exchange partner, part of Memory Library's wider network of places." (~11 words, identical wording for all three currently)
These three are currently generic/repeated placeholders (Bangladesh and Cairo share one sentence, Lebanon/Malta/Jersey share another) — genuinely good candidates for real, distinct copy about each place's actual connection to the programme if you have that information to give ChatGPT.

**Opening hours notes** (`data/opening-hours.json`) — short labels only, e.g. "Past Makes Future", "We Shine", "We Shine - closing night". 1-4 words, not sentences.
