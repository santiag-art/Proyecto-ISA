/**
 * VISTA — "¿Cómo estamos?" (cifras de operación/proyectos + bloque social)
 */
const StatsView = {
  _statBlock(stat) {
    return `
      <div class="flex items-start gap-4">
        <div class="w-14 h-14 shrink-0 rounded-xl bg-brand-mist dark:bg-slate-800 flex items-center justify-center">
          <i data-lucide="${stat.icon}" class="h-6 w-6 text-brand-navy dark:text-blue-300" stroke-width="1.75"></i>
        </div>
        <div>
          <p class="stat-value text-[28px] font-display font-bold text-brand-ember dark:text-orange-400 leading-none"
             data-count-to="${stat.value}">${Format.number(stat.value, 0)}</p>
          <p class="text-sm text-brand-navy/85 dark:text-slate-300 mt-1.5 leading-snug max-w-[220px]">${Dom.escape(stat.label)}</p>
        </div>
      </div>`;
  },

  _followClasses(following) {
    return (
      "w-full flex items-center justify-center gap-1.5 text-sm font-medium rounded-md py-2 border transition-colors " +
      (following
        ? "bg-brand-link text-white border-brand-link"
        : "text-brand-link dark:text-blue-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800")
    );
  },

  _socialBlock(page) {
    return `
      <div class="bg-[#F3F6FA] dark:bg-slate-800 rounded-xl p-4 h-fit">
        <div class="flex gap-2 mb-3 text-sm">
          <span class="flex items-center gap-1.5 bg-brand-navy text-white px-3 py-1 rounded-full">
            <i data-lucide="facebook" class="h-3.5 w-3.5"></i> Facebook
          </span>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
          <div class="flex items-center gap-2.5 mb-3">
            <div class="w-10 h-10 rounded bg-brand-navy flex items-center justify-center text-white text-xs font-bold">ISA</div>
            <div>
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">${Dom.escape(page.name)}</p>
              <p id="social-followers" class="text-xs text-slate-600 dark:text-slate-400">${Format.number(page.followers, 0)} seguidores</p>
            </div>
          </div>
          <button id="follow-toggle" type="button" aria-pressed="${page.following}" class="${this._followClasses(page.following)}">
            <i data-lucide="thumbs-up" class="h-3.5 w-3.5"></i>
            <span id="follow-label">${page.following ? "Siguiendo" : "Seguir página"}</span>
          </button>
        </div>
      </div>`;
  },

  render(operation, projects, page) {
    return `
      <div class="max-w-[1100px] mx-auto px-6 py-14">
        <h2 class="text-center font-display text-brand-navy dark:text-white text-2xl sm:text-3xl font-bold mb-10">¿Cómo estamos?</h2>

        <div class="grid grid-cols-1 md:grid-cols-[1fr_1fr_260px] gap-10">
          <div>
            <h3 class="text-brand-link dark:text-blue-300 font-semibold mb-5">Red en operación</h3>
            <div class="space-y-7">${operation.map((s) => this._statBlock(s)).join("")}</div>
            <a href="#red" class="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-link dark:text-blue-300 hover:underline">
              Ver la red en el mapa <i data-lucide="arrow-right" class="h-3.5 w-3.5"></i>
            </a>
          </div>

          <div>
            <h3 class="text-brand-link dark:text-blue-300 font-semibold mb-5">Proyectos en ejecución</h3>
            <div class="space-y-7">${projects.map((s) => this._statBlock(s)).join("")}</div>
          </div>

          ${this._socialBlock(page)}
        </div>
        <p class="mt-10 text-center text-xs text-slate-600 dark:text-slate-400">Cifras de referencia del sitio de ISA ENERGÍA; pueden variar con las actualizaciones de la compañía.</p>
      </div>
    `;
  },

  /** Actualiza solo el botón/contador de seguidores tras un cambio (evita re-render completo) */
  updateFollowButton(page) {
    const btn = document.getElementById("follow-toggle");
    const label = document.getElementById("follow-label");
    const followers = document.getElementById("social-followers");
    if (!btn || !label || !followers) return;

    followers.textContent = `${Format.number(page.followers, 0)} seguidores`;
    label.textContent = page.following ? "Siguiendo" : "Seguir página";
    btn.setAttribute("aria-pressed", String(page.following));
    btn.className = this._followClasses(page.following);
  },
};
