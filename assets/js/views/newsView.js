/**
 * VISTA — Sala de prensa / noticias
 * Incluye el estado "sin resultados" y el modal de artículo (accesible).
 * Todo texto dinámico pasa por Dom.escape: la búsqueda del usuario nunca se inserta como HTML.
 */
const NewsView = {
  _visual(article, size) {
    const box = size === "lg" ? "min-h-[200px] md:min-h-full" : "h-40";
    const icon = size === "lg" ? "h-14 w-14" : "h-9 w-9";
    return `
      <div class="relative flex ${box} items-center justify-center" style="background: linear-gradient(135deg, ${article.accent}22, ${article.accent}55);">
        <i data-lucide="${article.icon}" class="${icon}" style="color:${article.accent}" stroke-width="1.5"></i>
      </div>`;
  },

  _meta(article) {
    return `
      <p class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <span class="font-semibold" style="color:${article.accentText || article.accent}">${Dom.escape(article.tag)}</span>
        <span aria-hidden="true">·</span>
        <time datetime="${article.date}">${Format.date(article.date, { day: "numeric", month: "short", year: "numeric" })}</time>
      </p>`;
  },

  _featured(a) {
    return `
      <article class="grid overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-200/70 dark:bg-slate-800/70 dark:ring-slate-700 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        ${this._visual(a, "lg")}
        <div class="flex flex-col p-6 sm:p-8">
          ${this._meta(a)}
          <h3 class="mt-2 font-display text-xl sm:text-2xl font-bold leading-snug text-brand-navy dark:text-white">${Dom.escape(a.title)}</h3>
          <p class="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">${Dom.escape(a.excerpt)}</p>
          <button type="button" data-open-article="${a.id}" class="mt-5 inline-flex items-center gap-2 self-start text-sm font-semibold text-brand-link dark:text-blue-300 hover:underline">
            Leer artículo <i data-lucide="arrow-right" class="h-4 w-4"></i>
          </button>
        </div>
      </article>`;
  },

  _card(a) {
    return `
      <article class="flex flex-col overflow-hidden rounded-xl bg-white shadow-card ring-1 ring-slate-200/70 dark:bg-slate-800/70 dark:ring-slate-700">
        ${this._visual(a, "sm")}
        <div class="flex flex-1 flex-col p-5">
          ${this._meta(a)}
          <h3 class="mt-2 font-display text-[15px] font-bold leading-snug text-brand-navy dark:text-white">${Dom.escape(a.title)}</h3>
          <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">${Dom.escape(a.excerpt)}</p>
          <button type="button" data-open-article="${a.id}" class="mt-4 inline-flex items-center gap-2 self-start text-sm font-semibold text-brand-link dark:text-blue-300 hover:underline">
            Leer artículo <i data-lucide="arrow-right" class="h-4 w-4"></i>
          </button>
        </div>
      </article>`;
  },

  _empty(query, tag) {
    const what = query
      ? `No encontramos noticias para “${Dom.escape(query)}”${tag ? ` en ${Dom.escape(tag)}` : ""}.`
      : `No hay noticias en la categoría ${Dom.escape(tag)}.`;
    return `
      <div class="flex flex-col items-center py-14 text-center text-slate-700 dark:text-slate-300">
        <i data-lucide="search-x" class="mb-3 h-9 w-9 text-slate-400"></i>
        <p class="text-base">${what}</p>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">Prueba con otra palabra o quita los filtros.</p>
        <button type="button" data-clear-news class="mt-4 rounded-full border border-brand-link/40 px-4 py-2 text-sm font-semibold text-brand-link dark:text-blue-300 dark:border-blue-300/40 hover:bg-brand-mist dark:hover:bg-slate-800">
          Ver todas las noticias
        </button>
      </div>`;
  },

  _chips(tags, activeTag) {
    const chip = (label, value, active) => `
      <button type="button" data-filter-tag="${Dom.escape(value)}" aria-pressed="${active}"
        class="rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
          active
            ? "border-brand-navy bg-brand-navy text-white dark:border-brand-blue dark:bg-brand-blue"
            : "border-slate-300 text-brand-navy hover:bg-white dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        }">${Dom.escape(label)}</button>`;
    return `
      <div class="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
        ${chip("Todas", "", !activeTag)}
        ${tags.map((t) => chip(t, t, activeTag === t)).join("")}
      </div>`;
  },

  /** Resultados (cuadrícula o estado vacío) + contador; la cabecera y los chips se dibujan una sola vez. */
  renderResults(articles, query, tag) {
    const root = document.getElementById("news-results");
    if (!root) return;

    if (articles.length === 0) {
      root.innerHTML = this._empty(query, tag);
    } else {
      const [first, ...rest] = articles;
      root.innerHTML = `
        ${this._featured(first)}
        ${rest.length ? `<div class="mt-5 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">${rest.map((a) => this._card(a)).join("")}</div>` : ""}`;
    }

    const count = document.getElementById("news-count");
    if (count) {
      count.textContent = `${articles.length} ${articles.length === 1 ? "noticia" : "noticias"}`;
    }
    Dom.icons();
  },

  renderChips(tags, activeTag) {
    const slot = document.getElementById("news-chips");
    if (slot) slot.innerHTML = this._chips(tags, activeTag);
  },

  render(tags, activeTag) {
    return `
      <div class="max-w-[1160px] mx-auto px-5 sm:px-6 py-16 sm:py-20">
        <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 class="font-display text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white">Sala de prensa</h2>
          <p id="news-count" role="status" class="text-sm text-slate-600 dark:text-slate-400"></p>
        </div>
        <div id="news-chips" class="mb-6">${this._chips(tags, activeTag)}</div>
        <div id="news-results"></div>
      </div>
    `;
  },

  /** Diálogo de artículo completo. Devuelve el elemento del diálogo para gestionar el foco. */
  renderModal(article) {
    const modal = document.getElementById("article-modal");
    if (!article) {
      modal.classList.add("hidden");
      modal.innerHTML = "";
      modal.removeAttribute("role");
      document.body.classList.remove("overflow-hidden");
      return null;
    }

    const paragraphs = article.content
      .map((p) => `<p class="mt-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">${Dom.escape(p)}</p>`)
      .join("");

    modal.innerHTML = `
      <div class="modal-backdrop absolute inset-0" data-close-modal></div>
      <div class="relative flex h-full items-center justify-center p-4">
        <div role="dialog" aria-modal="true" aria-labelledby="modal-title"
          class="modal-panel relative max-h-full w-full max-w-xl overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 shadow-2xl">
          <div class="relative flex h-32 items-center justify-center" style="background: linear-gradient(135deg, ${article.accent}22, ${article.accent}55);">
            <i data-lucide="${article.icon}" class="h-10 w-10" style="color:${article.accent}" stroke-width="1.5"></i>
            <button type="button" data-close-modal aria-label="Cerrar artículo"
              class="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-brand-navy hover:bg-white">
              <i data-lucide="x" class="h-4 w-4"></i>
            </button>
          </div>
          <div class="p-6">
            ${this._meta(article)}
            <h3 id="modal-title" class="mt-2 font-display text-xl font-bold leading-snug text-brand-navy dark:text-white">${Dom.escape(article.title)}</h3>
            ${paragraphs}
            ${
              article.source
                ? `<p class="mt-5 text-sm text-slate-600 dark:text-slate-400">Fuente:
                     <a class="font-medium text-brand-link dark:text-blue-300 underline" href="${Dom.escape(article.source.url)}" target="_blank" rel="noopener noreferrer">${Dom.escape(article.source.label)}</a></p>`
                : ""
            }
            ${
              article.layer
                ? `<button type="button" data-show-layer="${article.layer}" data-close-modal
                     class="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-link/40 px-4 py-2 text-sm font-medium text-brand-link dark:text-blue-300 dark:border-blue-300/40 hover:bg-brand-mist dark:hover:bg-slate-700">
                     <i data-lucide="map-pin" class="h-4 w-4"></i> Ver en el mapa</button>`
                : ""
            }
          </div>
        </div>
      </div>`;
    modal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
    Dom.icons();
    return modal.querySelector('[role="dialog"]');
  },
};
