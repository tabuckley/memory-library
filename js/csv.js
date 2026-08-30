// Minimal RFC4180-ish CSV parser for Google Sheets "publish to web" exports.
// Handles quoted fields containing commas, newlines and escaped ("") quotes,
// which Sheets produces for any bio/summary text that itself contains a comma.

export function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  // Normalise line endings so \r\n inside/outside quotes behaves the same.
  const input = text.replace(/\r\n/g, "\n");

  for (let i = 0; i < input.length; i++) {
    const c = input[i];

    if (inQuotes) {
      if (c === '"') {
        if (input[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') { inQuotes = true; continue; }
    if (c === ",") { row.push(field); field = ""; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; continue; }
    field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }

  const filtered = rows.filter((r) => r.some((cell) => cell.trim() !== ""));
  if (!filtered.length) return [];

  const headers = filtered[0].map((h) => h.trim());
  return filtered.slice(1).map((r) => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (r[i] ?? "").trim(); });
    return obj;
  });
}
