/**
 * CONTROLADOR — Tema (claro / oscuro)
 * Aplica el tema al <html> y escucha el botón. Los íconos sol/luna se alternan
 * solo con CSS (clases dark:), sin volver a dibujarlos.
 * Se usa en index.html, login.html y portal.html.
 */
const ThemeController = {
  init() {
    this._apply(ThemeModel.get());

    document.addEventListener("click", (e) => {
      if (!e.target.closest("#theme-toggle")) return;
      this._apply(ThemeModel.toggle());
    });
  },

  _apply(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
  },
};
