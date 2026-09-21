/**
 * VISTA — Portal de clientes (panel tras iniciar sesión)
 */
const PortalView = {
  _estimate(e) {
    const chips = e.items
      .map((i) => `<li class="rounded-full bg-brand-mist dark:bg-slate-700 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200">${Dom.escape(i.label)} · ${Format.number(i.hours)} h</li>`)
      .join("");
    return `
      <li class="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm text-slate-600 dark:text-slate-400">${Format.dateTime(e.createdAt)}</p>
            <p class="mt-1 font-display text-xl font-bold text-brand-navy dark:text-white tabular-nums">${Format.cop(e.costMonth)}<span class="text-sm font-normal text-slate-600 dark:text-slate-400"> al mes</span></p>
            <p class="text-sm text-slate-700 dark:text-slate-300 tabular-nums">${Format.number(e.kwhMonth)} kWh · tarifa ${Format.cop(e.tariff)}/kWh</p>
          </div>
          <button type="button" data-delete-estimate="${Dom.escape(e.id)}" aria-label="Eliminar estimación del ${Dom.escape(Format.dateTime(e.createdAt))}"
            class="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-600 hover:bg-red-50 hover:text-red-700 dark:text-slate-300 dark:hover:bg-red-950 dark:hover:text-red-300">
            <i data-lucide="trash-2" class="h-4 w-4"></i>
          </button>
        </div>
        <ul class="mt-3 flex flex-wrap gap-1.5">${chips}</ul>
      </li>`;
  },

  _estimatesList(estimates) {
    if (!estimates.length) {
      return `
        <div class="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-8 text-center">
          <i data-lucide="calculator" class="mx-auto mb-3 h-8 w-8 text-slate-400"></i>
          <p class="text-base text-slate-800 dark:text-slate-100">Aún no tienes estimaciones guardadas.</p>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">Calcula tu consumo y pulsa “Guardar estimación”: aparecerá aquí.</p>
          <a href="index.html#calculadora" class="mt-4 inline-flex rounded-full bg-brand-link px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy transition-colors">Ir a la calculadora</a>
        </div>`;
    }
    return `<ul class="space-y-3">${estimates.map((e) => this._estimate(e)).join("")}</ul>`;
  },

  render(session, estimates) {
    const first = Dom.escape((session.nombre || session.usuario).split(" ")[0]);
    return `
      <header class="bg-brand-navy text-white">
        <div class="max-w-[1100px] mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <a href="index.html" aria-label="ISA Energía, volver al inicio" class="flex flex-col leading-none select-none">
            <span class="text-2xl italic font-display font-bold tracking-tight">isa</span>
            <span class="text-[10px] tracking-[0.2em] font-medium mt-0.5">ENERGÍA</span>
          </a>
          <div class="flex items-center gap-2">
            <button id="theme-toggle" type="button" aria-label="Cambiar entre tema claro y oscuro" class="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10">
              <i data-lucide="moon" class="h-[18px] w-[18px] dark:hidden"></i>
              <i data-lucide="sun" class="h-[18px] w-[18px] hidden dark:block"></i>
            </button>
            <button id="logout" type="button" class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition-colors">
              <i data-lucide="log-out" class="h-4 w-4"></i> Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main id="contenido" class="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h1 class="font-display text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white">Hola, ${first}</h1>
        <p class="mt-2 text-base text-slate-700 dark:text-slate-300">Este es tu panel de cliente. Sesión iniciada el ${Dom.escape(Format.dateTime(session.since))}.</p>

        <div class="mt-9 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section aria-labelledby="est-title" class="rounded-2xl bg-white dark:bg-slate-800/60 p-5 sm:p-6 shadow-card ring-1 ring-slate-200/70 dark:ring-slate-700">
            <h2 id="est-title" class="font-display text-xl font-bold text-brand-navy dark:text-white">Mis estimaciones guardadas</h2>
            <div id="estimates-list" class="mt-5">${this._estimatesList(estimates)}</div>
          </section>

          <aside aria-label="Accesos rápidos" class="rounded-2xl bg-white dark:bg-slate-800/60 p-5 sm:p-6 shadow-card ring-1 ring-slate-200/70 dark:ring-slate-700">
            <h2 class="font-display text-lg font-bold text-brand-navy dark:text-white">Accesos rápidos</h2>
            <ul class="mt-4 space-y-1 text-sm">
              <li><a class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-brand-ink dark:text-slate-100 hover:bg-brand-mist dark:hover:bg-slate-700" href="index.html#calculadora"><i data-lucide="calculator" class="h-4 w-4"></i> Calculadora de consumo</a></li>
              <li><a class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-brand-ink dark:text-slate-100 hover:bg-brand-mist dark:hover:bg-slate-700" href="index.html#red"><i data-lucide="map-pin" class="h-4 w-4"></i> Red en operación</a></li>
              <li><a class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-brand-ink dark:text-slate-100 hover:bg-brand-mist dark:hover:bg-slate-700" href="index.html#noticias"><i data-lucide="newspaper" class="h-4 w-4"></i> Sala de prensa</a></li>
            </ul>
          </aside>
        </div>
      </main>
    `;
  },

  renderEstimates(estimates) {
    const box = document.getElementById("estimates-list");
    if (box) box.innerHTML = this._estimatesList(estimates);
    Dom.icons();
  },
};
