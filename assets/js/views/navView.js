/**
 * VISTA — Navegación
 * Dibuja el encabezado a partir de NavModel: menú de escritorio con submenús,
 * menú móvil con acordeones nativos (<details>), panel de búsqueda y botón de sesión.
 * No decide qué pasa al hacer clic: eso es del controlador.
 */
const NavView = {
  _chevron: '<i data-lucide="chevron-down" class="h-3.5 w-3.5 opacity-70 transition-transform group-aria-expanded/dd:rotate-180"></i>',

  /** Enlace (o botón "próximamente") dentro de un submenú. */
  _childLink(c, mobile) {
    const label = Dom.escape(c.label);
    const cls = mobile
      ? "block w-full py-2.5 pl-4 text-left text-sm text-white/80 hover:text-white"
      : "block w-full rounded-lg px-3 py-2 text-left text-sm text-brand-ink dark:text-slate-100 hover:bg-brand-mist dark:hover:bg-slate-700";
    if (c.soon) return `<button type="button" data-soon="${label}" class="${cls}">${label}</button>`;
    const tag = c.newsTag !== undefined ? `data-news-tag="${Dom.escape(c.newsTag)}"` : "";
    return `<a href="${Dom.escape(c.href)}" ${tag} ${mobile ? "data-close-menu" : ""} class="${cls}">${label}</a>`;
  },

  _desktopItem(item) {
    const label = Dom.escape(item.label);

    if (item.children) {
      const menuId = `menu-${item.id}`;
      const links = item.children.map((c) => this._childLink(c, false)).join("");
      return `
        <div class="relative" data-dropdown>
          <button type="button" data-nav-id="${item.id}" data-dropdown-toggle aria-expanded="false" aria-haspopup="true" aria-controls="${menuId}"
            class="nav-link group/dd">
            ${label} ${this._chevron}
          </button>
          <div id="${menuId}" hidden
            class="absolute left-0 top-full mt-1 min-w-[270px] rounded-xl bg-white dark:bg-slate-800 p-2 shadow-pop border border-slate-200 dark:border-slate-700">
            ${links}
          </div>
        </div>`;
    }

    if (item.soon) {
      return `<button type="button" data-nav-id="${item.id}" data-soon="${label}" class="nav-link">${label}</button>`;
    }

    return `<a href="${Dom.escape(item.href)}" data-nav-id="${item.id}" class="nav-link">${label}</a>`;
  },

  _mobileItem(item) {
    const label = Dom.escape(item.label);
    const base = "flex items-center justify-between py-3 border-b border-white/10 text-[15px] text-white/90";

    if (item.children) {
      const links = item.children.map((c) => this._childLink(c, true)).join("");
      return `
        <details class="border-b border-white/10 group/m">
          <summary class="flex cursor-pointer list-none items-center justify-between py-3 text-[15px] text-white/90 [&::-webkit-details-marker]:hidden">
            ${label} <i data-lucide="chevron-down" class="h-4 w-4 opacity-70 transition-transform group-open/m:rotate-180"></i>
          </summary>
          <div class="pb-2">${links}</div>
        </details>`;
    }

    if (item.soon) {
      return `<button type="button" data-soon="${label}" class="${base} w-full text-left">${label}</button>`;
    }

    return `<a href="${Dom.escape(item.href)}" data-close-menu class="${base}">${label}</a>`;
  },

  _account(session) {
    if (session) {
      const first = Dom.escape((session.nombre || session.usuario).split(" ")[0]);
      return `
        <a href="portal.html"
          class="hidden sm:inline-flex items-center gap-2 text-[13px] font-semibold bg-white/10 hover:bg-white/20 transition-colors pl-3 pr-4 py-2 rounded-full">
          <i data-lucide="user" class="h-4 w-4"></i> Hola, ${first}
        </a>`;
    }
    return `
      <a href="login.html"
        class="hidden sm:inline-flex items-center text-[13px] font-semibold bg-brand-blue hover:bg-blue-600 transition-colors px-4 py-2 rounded-full whitespace-nowrap">
        Iniciar sesión
      </a>`;
  },

  render(items, session) {
    const mobileAccount = session
      ? `<a href="portal.html" class="mt-4 block text-center bg-white/10 rounded-full py-2.5 text-sm font-semibold">Hola, ${Dom.escape((session.nombre || session.usuario).split(" ")[0])} · Mi panel</a>`
      : `<a href="login.html" class="mt-4 block text-center bg-brand-blue rounded-full py-2.5 text-sm font-semibold">Iniciar sesión</a>`;

    return `
      <div class="w-full bg-brand-navy text-white sticky top-0 z-40 shadow-sm">
        <div class="max-w-[1400px] mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#inicio" aria-label="ISA Energía, ir al inicio" class="flex flex-col leading-none select-none shrink-0">
            <span class="text-2xl italic font-display font-bold tracking-tight">isa</span>
            <span class="text-[10px] tracking-[0.2em] font-medium mt-0.5">ENERGÍA</span>
          </a>

          <nav id="desktop-nav" aria-label="Principal" class="hidden xl:flex items-center">
            ${items.map((i) => this._desktopItem(i)).join("")}
          </nav>

          <div class="flex shrink-0 items-center gap-1">
            <button id="search-toggle" type="button" aria-label="Buscar noticias" aria-expanded="false" aria-controls="search-panel"
              class="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 transition-colors">
              <i data-lucide="search" class="h-[18px] w-[18px]"></i>
            </button>

            <button id="theme-toggle" type="button" aria-label="Cambiar entre tema claro y oscuro"
              class="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 transition-colors">
              <i data-lucide="moon" class="h-[18px] w-[18px] dark:hidden"></i>
              <i data-lucide="sun" class="h-[18px] w-[18px] hidden dark:block"></i>
            </button>

            ${this._account(session)}

            <button id="mobile-menu-toggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-menu"
              class="xl:hidden grid h-10 w-10 place-items-center rounded-md hover:bg-white/10">
              <i data-lucide="menu" class="h-5 w-5" data-icon-open></i>
              <i data-lucide="x" class="h-5 w-5 hidden" data-icon-close></i>
            </button>
          </div>
        </div>

        <div id="search-panel" hidden class="border-t border-white/10 bg-brand-deep">
          <form id="search-form" role="search" class="max-w-[1400px] mx-auto flex flex-wrap items-center gap-x-4 gap-y-2 px-4 sm:px-6 py-3">
            <label for="search-input" class="sr-only">Buscar en la sala de prensa</label>
            <div class="flex min-w-[220px] flex-1 items-center gap-2 rounded-full bg-white px-4 py-2 text-slate-800">
              <i data-lucide="search" class="h-4 w-4 text-slate-500 shrink-0"></i>
              <input id="search-input" type="search" autocomplete="off" placeholder="Buscar en la sala de prensa"
                class="w-full bg-transparent text-sm outline-none placeholder:text-slate-500" />
            </div>
            <p id="search-status" role="status" class="text-sm text-white/75 min-h-[1.25rem]"></p>
            <button type="submit" class="text-sm font-semibold bg-brand-blue hover:bg-blue-600 transition-colors rounded-full px-4 py-2">Ver resultados</button>
            <button type="button" id="search-close" aria-label="Cerrar búsqueda" class="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10">
              <i data-lucide="x" class="h-4 w-4"></i>
            </button>
          </form>
        </div>

        <div id="mobile-menu" hidden class="xl:hidden border-t border-white/10 px-4 sm:px-6 pb-5 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav aria-label="Principal (móvil)" class="flex flex-col">
            ${items.map((i) => this._mobileItem(i)).join("")}
          </nav>
          ${mobileAccount}
        </div>
      </div>
    `;
  },

  setSearchStatus(text) {
    const el = document.getElementById("search-status");
    if (el) el.textContent = text;
  },
};
