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
