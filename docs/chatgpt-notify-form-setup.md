# Task: create a "notify me" Google Form for the website

You have access to my Google Drive. Please create and configure a Google
Form exactly as specified below. It's a lightweight waitlist signup for a
few events on the Memory Library website that don't have a booking link
yet — the website will submit to this form quietly in the background (a
visitor never actually sees the Google Form itself), so the exact
structure below needs to match precisely for that to work.

## 1. Create the form

Create a new Google Form named **Memory Library - Notify Me**.

Add exactly two questions, in this order:

1. **Email address** — Short answer. Under the question's response
   validation (the ⋮ menu on the question, or the "..." at its
   bottom-right), turn on validation: Text > Email address. Mark it
   Required.
2. **Event** — Short answer. Mark it Required. (This one is filled in
   automatically by the website, not typed by a visitor — it just needs
   to exist as a real question for that to work.)

Leave every other form setting at its default. In particular, do **not**
turn on "Collect email addresses" in the form's Settings — that's a
different Google-account-based mechanism; the plain "Email address"
question above is what we want instead. Do not turn on "Limit to 1
response" either.

## 2. Link responses to a Sheet

In the form's **Responses** tab, click the green Sheets icon and create a
new linked spreadsheet (default name is fine). This is where every
signup will land as a row.

## 3. Get the pre-filled link

This is the important part — I need the exact field ids Google assigned
to the two questions.

1. Open the ⋮ (more) menu in the top-right of the form editor and choose
   **"Get pre-filled link"**.
2. On the preview that opens, type anything into both fields (e.g.
   `test@example.com` for Email, `test-event` for Event).
3. Click **"Get link"** at the top, then copy the link it gives you (it
   has a "Copy link" button — use that rather than retyping it).

## What to return

Just paste back that one pre-filled link in full (it'll look like
`https://docs.google.com/forms/d/e/.../viewform?usp=pp_url&entry.XXXXX=test@example.com&entry.YYYYY=test-event`)
plus the linked spreadsheet's share link. Nothing else needs doing.
