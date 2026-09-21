/**
 * CONTROLADOR — Página de inicio
 * Orquesta el arranque: dibuja cada sección con su vista y activa los controladores
 * de cada módulo. Aquí quedan las piezas pequeñas (seguir página, boletín, volver arriba).
 */
const HomeController = {
  init() {
    const session = SessionModel.get();

    document.getElementById("nav-root").innerHTML = NavView.render(NavModel.getItems(), session);
    document.getElementById("hero-root").innerHTML = HeroView.render(HeroModel.get());
    document.getElementById("stats-root").innerHTML = StatsView.render(
      StatsModel.getOperation(),
      StatsModel.getProjects(),
      SocialModel.load()
    );
    document.getElementById("history-root").innerHTML = TimelineView.render(TimelineModel.getAll(), (id) =>
      NetworkModel.getLayer(id)
    );
    document.getElementById("footer-root").innerHTML = FooterView.render();

    MapController.init();
    EnergyController.init();
    CalculatorController.init();
    NewsController.init();
    NavController.init();

    Dom.icons();
    CountUp.init();

    this._bindFollow();
    this._bindNewsletter();
    this._bindBackToTop();
  },

  _bindFollow() {
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#follow-toggle")) return;
      StatsView.updateFollowButton(SocialModel.toggleFollow());
    });
  },

  _bindNewsletter() {
    document.addEventListener("submit", (e) => {
      if (e.target.id !== "newsletter-form") return;
      e.preventDefault();
      const email = document.getElementById("newsletter-email").value;
      FooterView.showNewsletterMessage(NewsletterModel.subscribe(email));
    });
  },

  _bindBackToTop() {
    const btn = document.getElementById("back-to-top");
    const toggle = () => {
      const show = window.scrollY > 500;
      btn.classList.toggle("opacity-0", !show);
      btn.classList.toggle("pointer-events-none", !show);
      btn.classList.toggle("translate-y-3", !show);
      btn.tabIndex = show ? 0 : -1;
    };
    window.addEventListener("scroll", toggle, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: Dom.prefersReducedMotion() ? "auto" : "smooth" }));
    toggle();
  },
};
