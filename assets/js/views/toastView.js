/**
 * VISTA — Avisos breves (toasts)
 * Un contenedor con role="status" para que los lectores de pantalla anuncien el mensaje.
 */
const ToastView = {
  _root() {
    let root = document.getElementById("toast-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "toast-root";
      root.setAttribute("role", "status");
      root.setAttribute("aria-live", "polite");
      root.className = "pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4";
      document.body.appendChild(root);
    }
    return root;
  },

  show(message, { duration = 3600 } = {}) {
    const toast = document.createElement("div");
    toast.className =
      "toast pointer-events-auto max-w-md rounded-full bg-brand-ink px-5 py-3 text-sm font-medium text-white shadow-pop ring-1 ring-white/10 dark:bg-white dark:text-brand-ink";
    toast.textContent = message;
    this._root().appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  },
};
