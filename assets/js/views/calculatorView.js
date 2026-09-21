/**
 * VISTA — Calculadora de consumo energético
 * Dibuja el formulario y el panel de resultados a partir de CalculatorModel.
 * No decide cómo se calcula: eso es del modelo; ni cuándo: eso es del controlador.
 */
const CalculatorView = {
  _row(a) {
    return `
      <div class="calc-row flex items-center gap-3 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2.5 transition-colors hover:border-brand-blue/60 has-[:checked]:border-brand-blue has-[:checked]:bg-brand-blue/5">
        <label class="flex flex-1 min-w-0 cursor-pointer items-center gap-3">
          <input type="checkbox" data-appliance-check="${a.id}"
            class="h-4 w-4 shrink-0 rounded border-slate-400 text-brand-blue focus:ring-brand-blue/30" />
          <i data-lucide="${a.icon}" class="h-[18px] w-[18px] shrink-0 text-brand-navy dark:text-blue-300"></i>
          <span class="min-w-0 text-sm text-slate-800 dark:text-slate-100">${Dom.escape(a.label)}
            <span class="block text-xs text-slate-600 dark:text-slate-400">${a.watts} W</span>
          </span>
        </label>
        <div class="flex shrink-0 items-center gap-1.5">
          <label for="hours-${a.id}" class="sr-only">Horas de uso al día: ${Dom.escape(a.label)}</label>
          <input id="hours-${a.id}" type="number" inputmode="decimal" min="0" max="24" step="0.5" value="${a.defaultHours}"
            data-appliance-hours="${a.id}" disabled
            class="h-9 w-16 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-center text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-brand-blue disabled:cursor-not-allowed disabled:opacity-45" />
          <span class="text-xs text-slate-600 dark:text-slate-400">h/día</span>
        </div>
      </div>`;
  },

  render(appliances, tariffDefault) {
    return `
      <div class="max-w-[1160px] mx-auto px-5 sm:px-6 py-16 sm:py-20">
        <div class="max-w-2xl">
          <h2 class="font-display text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white">Calculadora de consumo</h2>
          <p class="mt-3 text-base leading-relaxed text-slate-700 dark:text-slate-300">
            Marca los electrodomésticos que usas y ajusta las horas al día: el resultado se actualiza al instante.
          </p>
        </div>

        <div class="mt-9 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <form id="calc-form" class="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70 dark:bg-slate-800/60 dark:ring-slate-700 sm:p-6" novalidate>
            <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <label for="calc-tariff" class="text-sm text-slate-700 dark:text-slate-300">Tarifa (COP por kWh)</label>
                <input id="calc-tariff" type="number" inputmode="numeric" min="1" value="${tariffDefault}"
                  class="h-9 w-24 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-center text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-brand-blue" />
              </div>
              <button type="button" id="calc-reset" class="text-sm font-medium text-brand-link dark:text-blue-300 hover:underline">Restablecer</button>
            </div>
            <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              ${appliances.map((a) => this._row(a)).join("")}
            </div>
            <p id="calc-warning" role="status" class="mt-3 min-h-[1.25rem] text-sm text-red-700 dark:text-red-300"></p>
          </form>

          <div id="calc-results" aria-live="polite" class="rounded-2xl bg-brand-navy p-6 text-white shadow-pop lg:sticky lg:top-24"></div>
        </div>
      </div>
    `;
  },

  /** Panel de resultados. `result` viene de CalculatorModel.calculate(). */
  renderResults(result) {
    const panel = document.getElementById("calc-results");
    if (!panel) return;

    if (!result || result.items.length === 0) {
      panel.innerHTML = `
        <h3 class="font-display text-lg font-semibold">Tu consumo estimado</h3>
        <p class="mt-3 text-sm leading-relaxed text-white/80">
          Marca al menos un electrodoméstico para ver cuánta energía consume al mes y cuánto costaría.
        </p>`;
      return;
    }

    const bars = result.items
      .map(
        (i) => `
        <li>
          <div class="flex items-center justify-between gap-3 text-sm">
            <span class="flex items-center gap-2"><i data-lucide="${i.icon}" class="h-4 w-4 text-white/70"></i>${Dom.escape(i.label)}</span>
            <span class="tabular-nums text-white/80">${Format.number(i.share, 0)} %</span>
          </div>
          <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div class="h-full rounded-full bg-brand-orange transition-[width] duration-500" style="width:${i.share.toFixed(1)}%"></div>
          </div>
        </li>`
      )
      .join("");

    panel.innerHTML = `
      <h3 class="font-display text-lg font-semibold">Tu consumo estimado</h3>
      <p class="mt-4 text-sm text-white/75">Costo aproximado al mes</p>
      <p class="font-display text-[34px] font-bold leading-tight text-white tabular-nums">${Format.cop(result.costMonth)}</p>
      <p class="mt-1 text-sm text-white/80 tabular-nums">${Format.number(result.kwhMonth)} kWh al mes · ${Format.number(result.kwhDay)} kWh al día</p>

      <h4 class="mt-6 text-sm font-semibold text-white/90">Quién consume más</h4>
      <ul class="mt-3 space-y-3">${bars}</ul>

      ${
        result.top
          ? `<div class="mt-6 rounded-xl bg-white/10 p-4 text-sm leading-relaxed">
               <p class="font-semibold">Para ahorrar: ${Dom.escape(result.top.label)}</p>
               <p class="mt-1 text-white/85">${Dom.escape(result.top.tip)}</p>
             </div>`
          : ""
      }

      <button type="button" id="calc-save"
        class="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-mist transition-colors">
        <i data-lucide="bookmark" class="h-4 w-4"></i> Guardar estimación
      </button>
      <p class="mt-4 text-xs leading-relaxed text-white/65">
        Estimación de referencia con ${Format.cop(result.tariff)}/kWh y potencias típicas. El valor real depende de tu operador, tu equipo y la franja horaria.
      </p>`;
  },

  setWarning(text) {
    const el = document.getElementById("calc-warning");
    if (el) el.textContent = text;
  },
};
