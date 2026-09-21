/**
 * VISTA — Mapa esquemático de la red (SVG interactivo)
 * Dibuja el país, las capas, los marcadores, el panel de detalle y la lista accesible.
 * No decide qué se selecciona ni qué capas están activas: eso es del controlador.
 */
const NetworkMapView = {
  _layerToggle(layer, active) {
    return `
      <button type="button" data-layer-toggle="${layer.id}" aria-pressed="${active}"
        class="layer-toggle inline-flex items-center gap-2.5 rounded-full border border-white/25 px-4 py-2 text-sm text-white/85 hover:bg-white/10 transition-colors">
        <span class="h-[3px] w-6 rounded-full" style="background:${layer.color}"></span>
        <span>${Dom.escape(layer.label)} <span class="text-white/60">· ${Dom.escape(layer.period)}</span></span>
      </button>`;
  },

  _svg(d) {
    const { view } = d;

    const surroundings = d.surroundings
      .map((s) =>
        s.vertical
          ? `<text class="map-neighbor" transform="translate(${s.x} ${s.y}) rotate(-90)" text-anchor="middle">${Dom.escape(s.text)}</text>`
          : `<text class="map-neighbor" x="${s.x}" y="${s.y}" text-anchor="middle">${Dom.escape(s.text)}</text>`
      )
      .join("");

    const cities = d.cities
      .map((c) => {
        const dx = c.side === "left" ? -7 : 7;
        const dy = c.side === "right-up" ? -6 : 4;
        const anchor = c.side === "left" ? "end" : "start";
        return `
          <circle cx="${c.x}" cy="${c.y}" r="2.5" class="map-city" />
          <text class="map-city-label" x="${c.x + dx}" y="${c.y + dy}" text-anchor="${anchor}">${Dom.escape(c.name)}</text>`;
      })
      .join("");

    const layers = d.layers
      .map((l) => {
        const branches = d.routes[l.id] || [];
        const dAttr = branches.map((pts) => pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ")).join(" ");
        return `
          <g class="map-layer${d.activeLayers.includes(l.id) ? "" : " is-off"}" data-layer="${l.id}">
            <path class="map-route" pathLength="1" d="${dAttr}" stroke="${l.color}" stroke-width="7" opacity="0.28" />
            <path class="map-route" pathLength="1" d="${dAttr}" stroke="${l.color}" stroke-width="2.4" />
          </g>`;
      })
      .join("");

    const markers = d.places
      .map(
        (p) => `
        <g class="map-marker" data-place="${p.id}" transform="translate(${p.x} ${p.y})" tabindex="0" role="button" aria-pressed="false"
          aria-label="${Dom.escape(p.name)}, ${Dom.escape(p.dept)}">
          <circle class="ring" r="10" />
          <circle class="hit" r="20" />
          <circle class="dot" r="5.5" />
        </g>`
      )
      .join("");

    return `
      <svg id="network-map" class="map-svg block h-auto w-full" viewBox="0 0 ${view.width} ${view.height}" role="group"
        aria-label="Mapa esquemático de Colombia con subestaciones destacadas de ISA ENERGÍA">
        <path d="${d.outlinePath}" class="map-country" />
        ${surroundings}
        ${layers}
        ${cities}
        ${markers}
        <g id="map-tip" class="map-tip" hidden pointer-events="none">
          <rect rx="6" ry="6"></rect>
          <text></text>
        </g>
      </svg>`;
  },

  _listItem(place, selected) {
    return `
      <li>
        <button type="button" data-place="${place.id}" ${selected ? 'aria-current="true"' : ""}
          class="map-list-item flex w-full items-baseline justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
            selected ? "bg-white text-brand-navy" : "text-white/85 hover:bg-white/10"
          }">
          <span class="font-medium">${Dom.escape(place.name)}</span>
          <span class="text-xs ${selected ? "text-brand-navy/70" : "text-white/60"}">${Dom.escape(place.dept)}</span>
        </button>
      </li>`;
  },

  render(d) {
    return `
      <div class="max-w-[1160px] mx-auto px-5 sm:px-6 py-16 sm:py-20">
        <div class="max-w-2xl">
          <h2 class="font-display text-3xl font-bold">Red en operación</h2>
          <p class="mt-3 text-base leading-relaxed text-white/80">
            Recorre algunas de las subestaciones que mantienen conectado al país. Enciende una capa para ver
            cómo creció la red, desde la primera interconexión de 1971 hasta La Guajira a 500.000 voltios.
          </p>
        </div>

        <div class="mt-9 grid items-start gap-8 lg:grid-cols-[minmax(0,540px)_minmax(0,1fr)]">
          <div>
            <div class="mb-4 flex flex-wrap gap-2" role="group" aria-label="Capas del mapa">
              ${d.layers.map((l) => this._layerToggle(l, d.activeLayers.includes(l.id))).join("")}
            </div>
            <div class="rounded-2xl bg-[#061a3d] p-2 ring-1 ring-white/10 sm:p-3">
              ${this._svg(d)}
            </div>
            <p class="mt-3 text-xs leading-relaxed text-white/65">
              Silueta simplificada y posiciones aproximadas, con fines ilustrativos. El mapa oficial está en
              <a class="underline hover:text-white" href="https://colombia.isaenergia.com/isaintercolombia/red-en-operacion/" target="_blank" rel="noopener noreferrer">colombia.isaenergia.com</a>.
            </p>
          </div>

          <div class="space-y-6">
            <div id="map-detail" aria-live="polite" class="min-h-[200px] rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10 sm:p-6"></div>
            <div>
              <h3 class="mb-3 text-sm font-semibold text-white/80">Subestaciones destacadas (${d.places.length})</h3>
              <ul id="map-list" class="grid gap-1 sm:grid-cols-2">
                ${d.places.map((p) => this._listItem(p, false)).join("")}
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /** Panel de detalle: sin selección muestra la guía y las capas; con selección, los datos de la subestación. */
  renderDetail(place, layers, activeLayers) {
    const panel = document.getElementById("map-detail");
    if (!panel) return;

    if (!place) {
      panel.innerHTML = `
        <h3 class="font-display text-lg font-semibold">Elige una subestación</h3>
        <p class="mt-2 text-sm leading-relaxed text-white/80">
          Toca un punto del mapa o un nombre de la lista para ver sus datos. Con el teclado, usa Tab para moverte por los puntos y Enter para abrirlos.
        </p>
        <dl class="mt-5 space-y-4">
          ${layers
            .map(
              (l) => `
            <div class="flex gap-3">
              <span class="mt-2 h-[3px] w-6 shrink-0 rounded-full" style="background:${l.color}"></span>
              <div>
                <dt class="text-sm font-semibold">${Dom.escape(l.label)} <span class="font-normal text-white/60">· ${Dom.escape(l.period)}</span></dt>
                <dd class="mt-0.5 text-sm leading-relaxed text-white/75">${Dom.escape(l.summary)}</dd>
              </div>
            </div>`
            )
            .join("")}
        </dl>`;
      return;
    }

    const memberOf = place.layers
      .map((id) => layers.find((l) => l.id === id))
      .filter(Boolean)
      .map((l) => {
        const on = activeLayers.includes(l.id);
        return `
          <button type="button" data-layer-toggle="${l.id}" aria-pressed="${on}"
            class="layer-toggle inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1.5 text-xs text-white/85 hover:bg-white/10">
            <span class="h-[3px] w-4 rounded-full" style="background:${l.color}"></span>
            ${Dom.escape(l.label)} · ${Dom.escape(l.period)}
          </button>`;
      })
      .join("");

    panel.innerHTML = `
      <p class="text-sm text-white/70">${Dom.escape(place.dept)}</p>
      <h3 class="font-display mt-0.5 text-2xl font-bold leading-tight">${Dom.escape(place.name)}</h3>
      <p class="mt-3 text-[15px] leading-relaxed text-white/85">${Dom.escape(place.blurb)}</p>
      ${memberOf ? `<div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="Capas donde aparece">${memberOf}</div>` : ""}
      <button type="button" data-clear-selection class="mt-5 text-sm font-medium text-white/80 underline underline-offset-4 hover:text-white">Quitar selección</button>`;
  },

  /** Marca el marcador y el ítem de la lista seleccionados. */
  markSelected(id) {
    document.querySelectorAll(".map-marker").forEach((m) => m.setAttribute("aria-pressed", String(m.dataset.place === id)));
    document.querySelectorAll("#map-list [data-place]").forEach((btn) => {
      const on = btn.dataset.place === id;
      if (on) btn.setAttribute("aria-current", "true");
      else btn.removeAttribute("aria-current");
      btn.classList.toggle("bg-white", on);
      btn.classList.toggle("text-brand-navy", on);
      btn.classList.toggle("text-white/85", !on);
      btn.classList.toggle("hover:bg-white/10", !on);
      const dept = btn.querySelector("span:last-child");
      if (dept) {
        dept.classList.toggle("text-brand-navy/70", on);
        dept.classList.toggle("text-white/60", !on);
      }
    });
  },

  /** Enciende o apaga una capa (y refleja el estado en todos sus botones). */
  setLayerVisible(id, visible) {
    const group = document.querySelector(`.map-layer[data-layer="${id}"]`);
    if (group) {
      group.classList.toggle("is-off", !visible);
      if (visible && !Dom.prefersReducedMotion()) {
        group.classList.remove("drawing");
        void group.getBoundingClientRect(); // reinicia la animación de dibujo
        group.classList.add("drawing");
      }
    }
    document.querySelectorAll(`[data-layer-toggle="${id}"]`).forEach((b) => b.setAttribute("aria-pressed", String(visible)));
  },

  /** Muestra una etiqueta flotante junto a un marcador. */
  showTip(place, x, y, viewWidth) {
    const tip = document.getElementById("map-tip");
    if (!tip) return;
    const text = tip.querySelector("text");
    const rect = tip.querySelector("rect");
    text.textContent = place.name;
    tip.removeAttribute("hidden");

    const box = text.getBBox();
    const padX = 8;
    const padY = 5;
    const w = box.width + padX * 2;
    const h = box.height + padY * 2;
    const left = Math.min(Math.max(x - w / 2, 4), viewWidth - w - 4);
    const top = y - h - 14 < 4 ? y + 14 : y - h - 14;

    rect.setAttribute("x", left);
    rect.setAttribute("y", top);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    text.setAttribute("x", left + padX);
    text.setAttribute("y", top + padY + box.height * 0.78);
  },

  hideTip() {
    const tip = document.getElementById("map-tip");
    if (tip) tip.setAttribute("hidden", "");
  },
};
