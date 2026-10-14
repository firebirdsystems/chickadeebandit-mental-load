// Pure, testable logic extracted from index.html.
// No DOM, no network — safe to import from Node for unit tests.

export const CATEGORIES = [
  { value: "home", label: "Home & Household" },
  { value: "meals", label: "Meals & Food" },
  { value: "kids", label: "Kids & Caregiving" },
  { value: "finances", label: "Money & Bills" },
  { value: "social", label: "Social & Family" },
  { value: "health", label: "Health & Appointments" },
  { value: "admin", label: "Admin & Errands" },
  { value: "other", label: "Other" },
];

export function catLabel(v) {
  return (CATEGORIES.find(c => c.value === v) ?? CATEGORIES[CATEGORIES.length - 1]).label;
}

export function isMe(id, meId) {
  return id === meId || id === "demo-1";
}

// Who is carrying what: counts of cards owned by me, by partner, and unassigned.
export function computeBalance(cards, meId) {
  const meCount = cards.filter(c => c.owner_id && isMe(c.owner_id, meId)).length;
  const pCount = cards.filter(c => c.owner_id && !isMe(c.owner_id, meId)).length;
  const openCount = cards.filter(c => !c.owner_id).length;
  const total = cards.length || 1;
  return { meCount, pCount, openCount, total };
}

// Non-empty category groups in CATEGORIES order.
export function cardsByCategory(cards) {
  return CATEGORIES
    .map(cat => ({ cat, items: cards.filter(c => c.category === cat.value) }))
    .filter(g => g.items.length);
}

/**
 * Fields the in-app search matches against (see hub-sdk `searchMatch`).
 * Notes and category count as well as the title — the point of the
 * app is naming invisible work, and the detail lives in the notes.
 */
export function searchableFields(item) {
  return [item.title, item.category, item.notes, item.owner_name];
}

/**
 * The line a failed write shows, from the error's status — never the hub's
 * text. "Try again" only where trying again can work. `found` is the caller's
 * re-read after a write that changed nothing (true: the row is still there).
 */
export function failureLine(e, { action, thing, found } = {}) {
  if (e?.forUser) return e.message;
  if (e?.code === "UNIQUE_CONSTRAINT" || /UNIQUE constraint failed/i.test(String(e?.message ?? ""))) return `That ${thing} already exists.`;
  if (e?.status === 403) return `You don’t have permission to ${action}.`;
  if (e?.status === 507) return "The household’s storage is full — free up space first.";
  if (e?.status === 429) return "Too many tries — wait a minute and try again.";
  if (found === false || (found === undefined && e?.status === 404)) return `This ${thing} has been removed.`;
  if (found === true) return `You don’t have permission to ${action}.`;
  if (e?.status === 409) return `This ${thing} was changed by someone else — check it first.`;
  return `Couldn’t ${action} — try again.`;
}

/**
 * "Retry after a lost response" (app-template guide): whether a failed create
 * must be read back by its pinned id before anything is said — no status, a
 * 400, a 5xx other than 507, or a UNIQUE answer (a retry of a create that
 * landed collides on its own pinned id). A refusal the hub named is known.
 */
export function readBackFirst(e) {
  if (e?.forUser) return false;
  if (e?.code === "UNIQUE_CONSTRAINT" || /UNIQUE constraint failed/i.test(String(e?.message ?? ""))) return true;
  const s = e?.status;
  return s == null || s === 400 || (s >= 500 && s !== 507);
}

/** Whether a stored row differs from what the form now holds (compared as text, null as empty). */
export function storedDiffers(row, fields) {
  return Object.keys(fields).some((k) => String(row?.[k] ?? "") !== String(fields[k] ?? ""));
}
