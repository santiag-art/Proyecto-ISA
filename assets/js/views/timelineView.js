/**
 * VISTA — Línea de tiempo (historia de ISA)
 * Una lista ordenada: el orden cronológico es parte del contenido.
 */
const TimelineView = {
  _event(ev, layer) {
    return `
      <li class="relative pl-7 sm:pl-9">
        <span class="absolute -left-[9px] top-2 h-4 w-4 rounded-full border-4 border-brand-blue bg-white dark:bg-slate-900" aria-hidden="true"></span>
        <p class="font-display text-2xl font-bold text-brand-navy dark:text-white">${Dom.escape(ev.year)}</p>
        <h3 class="mt-1 text-base font-semibold text-brand-ink dark:text-slate-100">${Dom.escape(ev.title)}</h3>
        <p class="mt-1.5 max-w-[60ch] text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">${Dom.escape(ev.text)}</p>
        ${
          layer
            ? `<button type="button" data-show-layer="${layer.id}"
                 class="mt-3 inline-flex items-center gap-2 rounded-full border border-brand-link/40 px-3.5 py-1.5 text-sm font-medium text-brand-link dark:text-blue-300 dark:border-blue-300/40 hover:bg-brand-mist dark:hover:bg-slate-800 transition-colors">
                 <i data-lucide="map-pin" class="h-3.5 w-3.5"></i> Ver en el mapa
               </button>`
            : ""
        }
      </li>`;
  },

  render(events, findLayer) {
    return `
      <div class="max-w-[1160px] mx-auto px-5 sm:px-6 py-16 sm:py-20 grid gap-10 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[300px_minmax(0,1fr)]">
        <div class="md:sticky md:top-24 md:self-start">
          <h2 class="font-display text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white">Nuestra historia</h2>
          <p class="mt-3 text-base leading-relaxed text-slate-700 dark:text-slate-300">
            De unir las redes de las regiones en 1967 a operar bajo la marca ISA ENERGÍA en 2026.
          </p>
        </div>
        <ol class="ml-2 space-y-9 border-l-2 border-brand-navy/15 dark:border-white/15">
          ${events.map((e) => this._event(e, e.layer ? findLayer(e.layer) : null)).join("")}
        </ol>
      </div>
    `;
  },
};
