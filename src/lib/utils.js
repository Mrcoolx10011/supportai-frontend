import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a URL for a given page name.
 * @param {string} pageName - The name of the page (e.g., "Dashboard", "Tickets?status=open").
 * @returns {string} The formatted URL for the page.
 */
export function createPageUrl(pageName) {
  // In a client-side rendered app, this might just return the pageName itself
  // or prepend a base path if necessary.
  // For example: `/app/${pageName}` or `/${pageName}`.
  // The base44 platform handles the actual routing, so a direct string is usually enough.

  // This implementation assumes pageName directly maps to a route.
  // If you have a more complex routing structure (e.g., `/dashboard/tickets`),
  // you might need a mapping object or more advanced parsing.
  return `/${pageName.toLowerCase().replace(/\s+/g, '')}`; // Example: "Dashboard" -> "/dashboard"
}

// Add other utility functions here as needed.
// For example, a debounce function, formatters, etc.