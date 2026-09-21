/**
 * CONTROLADOR — Sala de prensa
 * Búsqueda, filtro por categoría y diálogo del artículo (con manejo de foco).
 */
const NewsController = {
  _query: "",
  _tag: "",
  _opener: null,

  init() {
    document.getElementById("news-root").innerHTML = NewsView.render(ArticlesModel.getTags(), this._tag);
    this._refresh();
    this._bind();
  },

  /** API pública: la usan la búsqueda del encabezado y los enlaces del menú. */
  setQuery(query) {
    this._query = query;
    this._refresh();
    const n = ArticlesModel.search(this._query, this._tag).length;
    NavView.setSearchStatus(query.trim() ? `${n} ${n === 1 ? "resultado" : "resultados"}` : "");
  },

  setTag(tag) {
    this._tag = tag || "";
    NewsView.renderChips(ArticlesModel.getTags(), this._tag);
    this._refresh();
  },

  _refresh() {
    NewsView.renderResults(ArticlesModel.search(this._query, this._tag), this._query, this._tag);
  },

  _clear() {
    this._query = "";
    this._tag = "";
    const input = document.getElementById("search-input");
    if (input) input.value = "";
    NavView.setSearchStatus("");
    NewsView.renderChips(ArticlesModel.getTags(), this._tag);
    this._refresh();
  },

  _open(id, opener) {
    const article = ArticlesModel.getById(id);
    if (!article) return;
    this._opener = opener;
    const dialog = NewsView.renderModal(article);
    if (dialog) dialog.querySelector("[data-close-modal]").focus();
  },

  _close() {
    const modal = document.getElementById("article-modal");
    if (modal.classList.contains("hidden")) return;
    NewsView.renderModal(null);
    if (this._opener && document.contains(this._opener)) this._opener.focus();
    this._opener = null;
  },

  _bind() {
    document.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-filter-tag]");
      if (chip) {
        this.setTag(chip.dataset.filterTag);
        return;
      }
      if (e.target.closest("[data-clear-news]")) {
        this._clear();
        return;
      }
      const opener = e.target.closest("[data-open-article]");
      if (opener) {
        this._open(opener.dataset.openArticle, opener);
        return;
      }
      if (e.target.closest("[data-close-modal]")) this._close();
    });

    document.addEventListener("keydown", (e) => {
      const modal = document.getElementById("article-modal");
      if (modal.classList.contains("hidden")) return;
      if (e.key === "Escape") {
        this._close();
        return;
      }
      const dialog = modal.querySelector('[role="dialog"]');
      if (dialog) Dom.trapFocus(dialog, e);
    });
  },
};
