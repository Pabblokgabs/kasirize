/**
 * Creates a clean URL slug from a task title or identifier.
 * Example: "Stock Audit & Shelf Restocking" -> "stock-audit-&-shelf-restocking"
 */
export function taskToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-&]/g, "");
}
