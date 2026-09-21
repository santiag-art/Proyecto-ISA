/**
 * CONTROLADOR — Navegación
 * Submenús de escritorio, menú móvil, panel de búsqueda, avisos "próximamente"
 * y resaltado del ítem activo según la sección visible (scroll-spy).
 */
const NavController = {
  init() {
    this._bindDropdowns();
    this._bindMobileMenu();
    this._bindSearch();
    this._bindLinks();
    this._bindScrollSpy();
  },

  _closeDropdowns(except = null) {
    document.querySelectorAll("[data-dropdown]").forEach((dd) => {
      if (dd === except) return;
      const toggle = dd.querySelector("[data-dropdown-toggle]");
      toggle.setAttribute("aria-expanded", "false");
      dd.querySelector("[id^='menu-']").hidden = true;
    });
  },

  _bindDropdowns() {
    document.addEventListener("click", (e) => {
      const toggle = e.target.closest("[data-dropdown-toggle]");
      if (toggle) {
        const dd = toggle.closest("[data-dropdown]");
        const open = toggle.getAttribute("aria-expanded") === "true";
        this._closeDropdowns(dd);
        toggle.setAttribute("aria-expanded", String(!open));
        dd.querySelector("[id^='menu-']").hidden = open;
        return;
      }
      if (!e.target.closest("[data-dropdown]") || e.target.closest("[id^='menu-'] a")) this._closeDropdowns();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const openToggle = document.querySelector('[data-dropdown-toggle][aria-expanded="true"]');
      if (openToggle) {
        this._closeDropdowns();
        openToggle.focus();
      }
    });
  },

  _setMobile(open) {
    const toggle = document.getElementById("mobile-menu-toggle");
    const menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    toggle.querySelector("[data-icon-open]").classList.toggle("hidden", open);
    toggle.querySelector("[data-icon-close]").classList.toggle("hidden", !open);
    menu.hidden = !open;
  },

  _bindMobileMenu() {
    document.addEventListener("click", (e) => {
      if (e.target.closest("#mobile-menu-toggle")) {
        const open = document.getElementById("mobile-menu-toggle").getAttribute("aria-expanded") === "true";
        this._setMobile(!open);
      } else if (e.target.closest("[data-close-menu]")) {
        this._setMobile(false);
      }
    });
    window.matchMedia("(min-width: 1280px)").addEventListener("change", (m) => {
      if (m.matches) this._setMobile(false);
    });
  },

  _setSearch(open) {
    const toggle = document.getElementById("search-toggle");
    const panel = document.getElementById("search-panel");
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
    if (open) document.getElementById("search-input").focus();
    else toggle.focus();
  },

  _bindSearch() {
    document.addEventListener("click", (e) => {
      if (e.target.closest("#search-toggle")) {
        const open = document.getElementById("search-toggle").getAttribute("aria-expanded") === "true";
        this._setSearch(!open);
      } else if (e.target.closest("#search-close")) {
        this._setSearch(false);
      }
    });

    document.addEventListener("input", (e) => {
      if (e.target.id === "search-input") NewsController.setQuery(e.target.value);
    });

    document.addEventListener("submit", (e) => {
      if (e.target.id !== "search-form") return;
      e.preventDefault();
      Dom.scrollToId("noticias");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.getElementById("search-toggle")?.getAttribute("aria-expanded") === "true") {
        this._setSearch(false);
      }
    });
  },

  _bindLinks() {
    document.addEventListener("click", (e) => {
      const soon = e.target.closest("[data-soon]");
      if (soon && soon.dataset.soon) {
        ToastView.show(`“${soon.dataset.soon}” aún no está disponible en esta versión del proyecto.`);
        return;
      }
      const tagLink = e.target.closest("[data-news-tag]");
      if (tagLink) NewsController.setTag(tagLink.dataset.newsTag);
    });
  },

  /** Marca el ítem del menú cuya sección está en pantalla. */
  _bindScrollSpy() {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const itemId = NavModel.itemForSection(entry.target.id);
          document.querySelectorAll("#desktop-nav [data-nav-id]").forEach((el) => {
            if (el.dataset.navId === itemId) el.setAttribute("aria-current", "true");
            else el.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    NavModel.sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  },
};
