// --- Safe XSS String Escaper (Prevents database text injections breaking layouts) ---
export function escapeHTML(str) {
  if (!str) return "";
  return str
    .toString()
    .replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[tag] || tag,
    );
}