/**
 * CONTROLADOR — Mapa de la red
 * Arma los datos para la vista, gestiona la selección de subestaciones,
 * las capas activas y la animación de dibujo de las líneas.
 */
const MapController = {
  _selected: null,
  _active: [],

  init() {
    this._active = NetworkModel.getLayers().map((l) => l.id);
    document.getElementById("map-root").innerHTML = NetworkMapView.render(this._viewData());
    NetworkMapView.renderDetail(null, NetworkModel.getLayers(), this._active);
    this._armDrawAnimation();
    this._bind();
  },

  _viewData() {
    const project = (o) => ({ ...o, ...NetworkModel.project(o.lat, o.lon) });
    const layers = NetworkModel.getLayers();
    return {
      view: NetworkModel.view,
      outlinePath: NetworkModel.outlinePath(),
      surroundings: NetworkModel.surroundings.map(project),
      cities: NetworkModel.cities.map(project),
      places: NetworkModel.getPlaces().map(project),
      layers,
      routes: Object.fromEntries(layers.map((l) => [l.id, NetworkModel.getRoutePoints(l.id)])),
      activeLayers: this._active,
    };
  },

  /** Las líneas se "energizan" una vez, cuando el mapa entra en pantalla. */
  _armDrawAnimation() {
    const svg = document.getElementById("network-map");
    if (!svg || Dom.prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    svg.dataset.armed = "";
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        svg.classList.add("is-drawn");
        observer.disconnect();
      },
      { threshold: 0.35 }
    );
    observer.observe(svg);
  },

  select(id) {
    this._selected = id;
    const place = id ? NetworkModel.getPlace(id) : null;
    NetworkMapView.markSelected(id);
    NetworkMapView.renderDetail(place, NetworkModel.getLayers(), this._active);
    this._restoreTip();
  },

  setLayer(id, visible) {
    this._active = visible ? [...new Set([...this._active, id])] : this._active.filter((l) => l !== id);
    NetworkMapView.setLayerVisible(id, visible);
  },

  /** Desde la línea de tiempo o una noticia: enciende la capa y lleva al mapa. */
  focusLayer(id) {
    if (!NetworkModel.getLayer(id)) return;
    this.setLayer(id, true);
    Dom.scrollToId("red");
  },

  _tipFor(id) {
    const place = NetworkModel.getPlace(id);
    if (!place) return;
    const { x, y } = NetworkModel.project(place.lat, place.lon);
    NetworkMapView.showTip(place, x, y, NetworkModel.view.width);
  },

  _restoreTip() {
    if (this._selected) this._tipFor(this._selected);
    else NetworkMapView.hideTip();
  },

  _bind() {
    document.addEventListener("click", (e) => {
      const toggle = e.target.closest("[data-layer-toggle]");
      if (toggle) {
        const id = toggle.dataset.layerToggle;
        this.setLayer(id, toggle.getAttribute("aria-pressed") !== "true");
        return;
      }
      const show = e.target.closest("[data-show-layer]");
      if (show) {
        this.focusLayer(show.dataset.showLayer);
        return;
      }
      if (e.target.closest("[data-clear-selection]")) {
        this.select(null);
        return;
      }
      const place = e.target.closest("#red [data-place]");
      if (place) this.select(place.dataset.place);
    });

    const svg = document.getElementById("network-map");
    svg.addEventListener("keydown", (e) => {
      const marker = e.target.closest(".map-marker");
      if (marker && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        this.select(marker.dataset.place);
      }
    });

    const showTip = (e) => {
      const marker = e.target.closest?.(".map-marker");
      if (marker) this._tipFor(marker.dataset.place);
    };
    const hideTip = (e) => {
      if (e.target.closest?.(".map-marker")) this._restoreTip();
    };
    svg.addEventListener("pointerover", showTip);
    svg.addEventListener("pointerout", hideTip);
    svg.addEventListener("focusin", showTip);
    svg.addEventListener("focusout", hideTip);
  },
};
