import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(value: unknown) {
  return DOMPurify.sanitize(String(value || ""));
}
