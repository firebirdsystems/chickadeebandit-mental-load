import { describe, it, expect } from "vitest";
import { CATEGORIES, catLabel, isMe, computeBalance, cardsByCategory } from "../src/logic.js";

describe("catLabel", () => {
  it("resolves a known category", () => expect(catLabel("meals")).toBe("Meals & Food"));
  it("falls back to Other for unknown", () => expect(catLabel("nope")).toBe("Other"));
});

describe("isMe", () => {
  it("matches the current member id", () => expect(isMe("m1", "m1")).toBe(true));
  it("treats the demo owner as me", () => expect(isMe("demo-1", null)).toBe(true));
  it("is false otherwise", () => expect(isMe("m2", "m1")).toBe(false));
});

describe("computeBalance", () => {
  const cards = [
    { owner_id: "m1", category: "home" },
    { owner_id: "m1", category: "meals" },
    { owner_id: "p1", category: "kids" },
    { owner_id: "", category: "other" },
  ];
  it("counts me, partner, and unassigned", () => {
    expect(computeBalance(cards, "m1")).toEqual({ meCount: 2, pCount: 1, openCount: 1, total: 4 });
  });
  it("uses total 1 for an empty list to avoid divide-by-zero", () => {
    expect(computeBalance([], "m1").total).toBe(1);
  });
});

describe("cardsByCategory", () => {
  const cards = [
    { id: "1", category: "home" },
    { id: "2", category: "meals" },
    { id: "3", category: "home" },
  ];
  it("groups non-empty categories in CATEGORIES order", () => {
    const groups = cardsByCategory(cards);
    expect(groups.map(g => g.cat.value)).toEqual(["home", "meals"]);
    expect(groups[0].items.map(i => i.id)).toEqual(["1", "3"]);
  });
  it("omits empty categories", () => {
    expect(cardsByCategory([]).length).toBe(0);
  });
});

describe("CATEGORIES", () => {
  it("ends with Other as the fallback", () => {
    expect(CATEGORIES[CATEGORIES.length - 1].value).toBe("other");
  });
});
