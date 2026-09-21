/**
 * VISTA — Campaña principal (hero)
 * La campaña "cuenta / Y cuenta contigo." se conserva. El fondo es una línea de
 * transmisión dibujada en SVG: al cargar, los cables se "energizan" una sola vez.
 */
const HeroView = {
  /** Torre de transmisión de celosía centrada en x. Devuelve las marcas SVG y los puntos de anclaje de los cables. */
  _tower(x) {
    const base = 168;
    const top = 26;
    const halfAt = (y) => 4 + ((y - top) * 11) / (base - top); // semiancho del cuerpo a la altura y
    let braces = "";
    for (let y = base; y - 24 > top + 10; y -= 24) {
      const a = halfAt(y);
      const b = halfAt(y - 24);
      braces += `M${x - a} ${y}L${x + b} ${y - 24}M${x + a} ${y}L${x - b} ${y - 24}`;
    }
    const arms = [
      { y: 50, half: 36 },
      { y: 80, half: 28 },
    ];
    const armPaths = arms.map((a) => `M${x - a.half} ${a.y}H${x + a.half}`).join("");
    const insulators = arms
      .map((a) => `M${x - a.half} ${a.y}v7M${x + a.half} ${a.y}v7`)
      .join("");
    const body = `M${x - halfAt(base)} ${base}L${x - 4} ${top}L${x + 4} ${top}L${x + halfAt(base)} ${base}`;
    const anchors = arms.flatMap((a) => [
      { x: x - a.half, y: a.y + 7 },
      { x: x + a.half, y: a.y + 7 },
    ]);
    return {
      shape: `<path d="${body}${armPaths}${insulators}${braces}" fill="none" stroke-linejoin="round" />`,
      anchors,
    };
  },

  _powerLine() {
    const xs = [-60, 240, 540, 840, 1140];
    const towers = xs.map((x) => this._tower(x));
    let wires = "";
    for (let i = 0; i < towers.length - 1; i++) {
      towers[i].anchors.forEach((a, k) => {
        const b = towers[i + 1].anchors[k];
        const midX = (a.x + b.x) / 2;
        const sag = 34;
        wires += `<path class="wire-draw" pathLength="1" style="animation-delay:${(i * 0.18 + k * 0.05).toFixed(2)}s" d="M${a.x} ${a.y}Q${midX} ${a.y + sag * 2} ${b.x} ${b.y}" />`;
      });
    }
    return `
      <svg class="pointer-events-none absolute inset-x-0 bottom-0 h-[150px] w-full text-brand-navy/25 dark:text-white/20"
        viewBox="0 0 1080 170" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
        <g stroke="currentColor" stroke-width="2.2">${towers.map((t) => t.shape).join("")}</g>
        <g fill="none" stroke-width="1.6" class="text-brand-blue dark:text-blue-400" stroke="currentColor">${wires}</g>
      </svg>`;
  },

  render(hero) {
    return `
      <div class="relative overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
        <div class="pointer-events-none absolute inset-0"
          style="background: radial-gradient(640px circle at 12% 18%, rgba(16,185,129,.14), transparent 60%),
                            radial-gradient(640px circle at 92% 8%, rgba(30,136,229,.14), transparent 55%);"></div>

        <div class="relative max-w-[1100px] mx-auto px-6 pt-14 pb-40 sm:pb-44 text-center">
          <h1 class="sr-only">${Dom.escape(hero.srTitle)}</h1>
          <div class="flex items-center justify-center gap-3 flex-wrap" aria-hidden="true">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="#10B981" focusable="false">
              <path d="M12 21s-7.5-4.6-9.6-9.3C.8 8.1 2.7 4.5 6.3 4c2.1-.3 4 .8 5.7 2.7C13.7 4.8 15.6 3.7 17.7 4c3.6.5 5.5 4.1 3.9 7.7C19.5 16.4 12 21 12 21z" />
            </svg>
            <p class="font-display text-[56px] sm:text-[72px] md:text-[88px] font-extrabold text-brand-green leading-none tracking-tight">
              ${Dom.escape(hero.kicker)}
            </p>
          </div>

          <p class="mt-3 inline-block bg-brand-blue text-white text-lg md:text-2xl font-semibold px-8 py-2.5 rounded-full">
            ${Dom.escape(hero.highlight)}
          </p>

          <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <p class="inline-block border-2 border-brand-navy dark:border-white/30 rounded-full px-6 py-2.5 text-brand-navy dark:text-white font-medium text-sm md:text-base">
              ${Dom.escape(hero.notice)}
            </p>
            <a href="${Dom.escape(hero.ctaHref)}"
              class="inline-flex items-center gap-2 text-sm md:text-base font-semibold text-white bg-brand-navy hover:bg-brand-deep transition-colors px-6 py-2.5 rounded-full">
              ${Dom.escape(hero.ctaLabel)} <i data-lucide="arrow-down" class="h-4 w-4"></i>
            </a>
          </div>
        </div>

        ${this._powerLine()}
      </div>
    `;
  },
};
