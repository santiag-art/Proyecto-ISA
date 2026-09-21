/**
 * UTILIDAD — Formato de números, moneda y fechas en español de Colombia.
 */
const Format = {
  number(n, maxDigits = 1) {
    return Number(n).toLocaleString("es-CO", { maximumFractionDigits: maxDigits });
  },

  cop(n) {
    return Number(n).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  },

  /** "2026-08-12" -> "12 de agosto de 2026" (se fuerza mediodía para evitar saltos de zona horaria) */
  date(iso, options = { day: "numeric", month: "long", year: "numeric" }) {
    return new Date(`${iso}T12:00:00`).toLocaleDateString("es-CO", options);
  },

  dateTime(ms) {
    return new Date(ms).toLocaleString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  },
};
