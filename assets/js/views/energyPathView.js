/**
 * VISTA — Recorrido de la energía (planta → transmisión → distribución → hogar)
 * Pestañas accesibles: la línea que une las etapas se "llena" hasta la etapa elegida.
 */
const EnergyPathView = {
  _tab(step, index, activeIndex) {
    const active = index === activeIndex;
    const passed = index <= activeIndex;
    return `
      <button type="button" role="tab" id="energy-tab-${step.id}" data-energy-step="${step.id}"
        aria-selected="${active}" aria-controls="energy-panel" tabindex="${active ? 0 : -1}"
        class="energy-tab group relative z-10 flex flex-col items-center gap-2 text-center">
        <span class="energy-node grid h-14 w-14 place-items-center rounded-full border-2 transition-colors ${
          passed
            ? "bg-brand-navy border-brand-navy text-white dark:bg-brand-blue dark:border-brand-blue"
            : "bg-white border-slate-300 text-brand-navy dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
        }">
          <i data-lucide="${step.icon}" class="h-6 w-6"></i>
        </span>
        <span class="text-sm font-semibold ${active ? "text-brand-navy dark:text-white" : "text-slate-600 dark:text-slate-400"}">${Dom.escape(step.label)}</span>
      </button>`;
  },

  _panel(step) {
    return `
      <div class="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,300px)] md:items-start">
        <div>
          <h3 class="font-display text-xl sm:text-2xl font-bold text-brand-navy dark:text-white">${Dom.escape(step.title)}</h3>
          <p class="mt-3 max-w-[62ch] text-base leading-relaxed text-slate-700 dark:text-slate-300">${Dom.escape(step.text)}</p>
          ${step.note ? `<p class="mt-4 max-w-[62ch] border-l-4 border-brand-blue pl-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">${Dom.escape(step.note)}</p>` : ""}
          ${
            step.cta
              ? `<a href="${Dom.escape(step.cta.href)}" class="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep transition-colors">
                   ${Dom.escape(step.cta.label)} <i data-lucide="arrow-right" class="h-4 w-4"></i></a>`
              : ""
          }
        </div>
        <dl class="rounded-xl bg-brand-mist dark:bg-slate-800 p-5 text-sm">
          <dt class="text-slate-600 dark:text-slate-400">Nivel de tensión</dt>
          <dd class="mt-1 font-display text-lg font-bold text-brand-navy dark:text-white">${Dom.escape(step.voltage)}</dd>
          <dt class="mt-4 text-slate-600 dark:text-slate-400">Quién interviene</dt>
          <dd class="mt-1 font-medium text-brand-ink dark:text-slate-100">${Dom.escape(step.who)}</dd>
        </dl>
      </div>`;
  },

  render(steps, activeIndex) {
    return `
      <div class="max-w-[1160px] mx-auto px-5 sm:px-6 py-16 sm:py-20">
        <div class="max-w-2xl">
          <h2 class="font-display text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white">¿Cómo llega la energía a tu hogar?</h2>
          <p class="mt-3 text-base leading-relaxed text-slate-700 dark:text-slate-300">
            Entre la planta que genera la electricidad y tu enchufe hay cuatro etapas. ISA ENERGÍA trabaja en la segunda.
          </p>
        </div>

        <div class="mt-10">
          <div role="tablist" aria-label="Etapas del recorrido de la energía" class="relative grid grid-cols-4 gap-2">
            <div class="energy-wire" aria-hidden="true"><div class="energy-wire-fill" style="width:${(activeIndex / (steps.length - 1)) * 100}%"></div></div>
            ${steps.map((s, i) => this._tab(s, i, activeIndex)).join("")}
          </div>

          <div id="energy-panel" role="tabpanel" tabindex="0" aria-labelledby="energy-tab-${steps[activeIndex].id}"
            class="mt-8 rounded-2xl bg-white dark:bg-slate-800/60 p-6 sm:p-8 shadow-card ring-1 ring-slate-200/70 dark:ring-slate-700">
            ${this._panel(steps[activeIndex])}
          </div>
        </div>
      </div>
    `;
  },

  /** Cambia la etapa mostrada sin volver a dibujar toda la sección. */
  setActive(steps, activeIndex) {
    const step = steps[activeIndex];
    document.querySelectorAll("[data-energy-step]").forEach((tab, i) => {
      const active = i === activeIndex;
      const passed = i <= activeIndex;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      const node = tab.querySelector(".energy-node");
      node.className =
        "energy-node grid h-14 w-14 place-items-center rounded-full border-2 transition-colors " +
        (passed
          ? "bg-brand-navy border-brand-navy text-white dark:bg-brand-blue dark:border-brand-blue"
          : "bg-white border-slate-300 text-brand-navy dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200");
      const label = tab.querySelector("span:last-child");
      label.className = "text-sm font-semibold " + (active ? "text-brand-navy dark:text-white" : "text-slate-600 dark:text-slate-400");
    });
    const fill = document.querySelector(".energy-wire-fill");
    if (fill) fill.style.width = `${(activeIndex / (steps.length - 1)) * 100}%`;

    const panel = document.getElementById("energy-panel");
    panel.setAttribute("aria-labelledby", `energy-tab-${step.id}`);
    panel.innerHTML = this._panel(step);
    Dom.icons();
  },
};
