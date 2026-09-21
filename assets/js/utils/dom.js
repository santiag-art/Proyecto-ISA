/**
 * UTILIDAD — Ayudas de DOM reutilizables por todas las capas.
 * Ninguna conoce datos del negocio: solo texto seguro, íconos, foco y scroll.
 */
const Dom = {
  /** Escapa texto antes de insertarlo con innerHTML (evita inyección de HTML/XSS). */
  escape(value) {
    return String(value ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[c]);
  },

  /** Convierte los <i data-lucide="..."> nuevos en SVG (si la librería cargó). */
  icons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  },

  prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  /** Desplazamiento suave hacia un id, respetando "menos movimiento". */
  scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: this.prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  },

  /** Elementos que pueden recibir foco dentro de un contenedor. */
  focusable(container) {
    return [
      ...container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      ),
    ].filter((el) => el.offsetParent !== null || el === document.activeElement);
  },

  /** Mantiene el foco dentro de un diálogo al pulsar Tab. */
  trapFocus(container, event) {
    if (event.key !== "Tab") return;
    const items = this.focusable(container);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  },
};
