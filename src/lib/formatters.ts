/**
 * Formatting utility functions for Folio app.
 */

/**
 * Formats a date string ("YYYY-MM-DD" or ISO) into a clean French display format.
 * Example: "2026-11-26" -> "26 nov. 2026"
 */
export function prettyDisplayDate(dateStr: string): string {
  if (!dateStr) return "";

  try {
    // Handle YYYY-MM-DD directly without timezone offset errors
    const parts = dateStr.split("T")[0].split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-indexed month
      const day = parseInt(parts[2], 10);
      const dateObj = new Date(year, month, day);

      return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(dateObj);
    }

    const dateObj = new Date(dateStr);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(dateObj);
  } catch {
    return dateStr;
  }
}

/**
 * Formats a number into French Euro currency display.
 * Example: 12500.5 -> "12 500,50 €"
 */
export function formatCurrency(amount: number, digits: number = 2): string {
  return `${amount.toLocaleString("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} €`;
}

/**
 * Formats a number into signed percentage display.
 * Example: 12.5 -> "+12,50%"
 */
export function formatPercent(percent: number, digits: number = 2): string {
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent.toFixed(digits).replace(".", ",")}%`;
}
