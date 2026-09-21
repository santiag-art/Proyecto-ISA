/**
 * MODELO — Tema (claro / oscuro)
 * Recuerda la preferencia en localStorage y, si no hay ninguna guardada,
 * respeta la del sistema operativo. Si el almacenamiento está bloqueado, sigue funcionando.
 */
const ThemeModel = {
  key: "isa-theme",

  get() {
    try {
      const saved = localStorage.getItem(this.key);
      if (saved === "dark" || saved === "light") return saved;
    } catch (_) {
      /* almacenamiento bloqueado */
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  },

  set(theme) {
    try {
      localStorage.setItem(this.key, theme);
    } catch (_) {
      /* se ignora */
    }
    return theme;
  },

  toggle() {
    return this.set(this.get() === "dark" ? "light" : "dark");
  },
};
