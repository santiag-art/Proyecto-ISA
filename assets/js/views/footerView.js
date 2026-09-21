/**
 * VISTA — Pie de página
 */
const FooterView = {
  render() {
    const year = new Date().getFullYear();
    return `
      <div class="bg-brand-deep text-white/85">
        <div class="max-w-[1160px] mx-auto px-5 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
          <div>
            <span class="text-xl italic font-display font-bold text-white">isa</span>
            <p class="text-[10px] tracking-[0.2em] mt-0.5 mb-3">ENERGÍA</p>
            <p class="text-white/75 leading-relaxed">
              Conectamos el país transportando energía confiable, segura y sostenible.
            </p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3">Explora</h4>
            <ul class="space-y-2 text-white/75">
              <li><a href="#red" class="hover:text-white">Red en operación</a></li>
              <li><a href="#historia" class="hover:text-white">Nuestra historia</a></li>
              <li><a href="#calculadora" class="hover:text-white">Calculadora de consumo</a></li>
              <li><a href="#noticias" class="hover:text-white">Sala de prensa</a></li>
              <li><a href="login.html" class="hover:text-white">Iniciar sesión</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3">Sitio oficial</h4>
            <p class="text-white/75 leading-relaxed mb-3">Para trámites, servicios y comunicados oficiales, visita el sitio de la compañía.</p>
            <a href="https://colombia.isaenergia.com/" target="_blank" rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 font-medium text-white underline underline-offset-4 hover:text-white/90">
              colombia.isaenergia.com <i data-lucide="external-link" class="h-3.5 w-3.5"></i>
            </a>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3">Boletín de noticias</h4>
            <p class="text-white/75 mb-3 leading-relaxed">Recibe las novedades del sector energético.</p>
            <form id="newsletter-form" class="flex items-center gap-1.5" novalidate>
              <label for="newsletter-email" class="sr-only">Correo electrónico</label>
              <input id="newsletter-email" type="email" placeholder="tu@correo.com" autocomplete="email"
                class="min-w-0 flex-1 h-10 px-4 rounded-full text-sm text-slate-800 outline-none focus:ring-2 focus:ring-brand-blue/60" />
              <button type="submit" aria-label="Suscribirme al boletín"
                class="shrink-0 grid h-10 w-10 place-items-center rounded-full bg-brand-blue hover:bg-blue-600 transition-colors">
                <i data-lucide="send" class="h-4 w-4"></i>
              </button>
            </form>
            <p id="newsletter-message" role="status" class="text-sm mt-2 min-h-[1.25rem]"></p>
          </div>
        </div>
        <div class="border-t border-white/10 py-4 px-5 text-center text-xs text-white/70">
          © ${year} · Proyecto académico con fines demostrativos, inspirado en ISA ENERGÍA. No es el sitio oficial de la compañía.
        </div>
      </div>
    `;
  },

  /** Muestra el resultado de la suscripción al boletín */
  showNewsletterMessage(result) {
    const el = document.getElementById("newsletter-message");
    if (!el) return;
    el.textContent = result.message;
    el.className = "text-sm mt-2 min-h-[1.25rem] " + (result.ok ? "text-emerald-300" : "text-red-200");
    if (result.ok) document.getElementById("newsletter-email").value = "";
  },
};
