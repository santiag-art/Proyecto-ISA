/**
 * UTILIDAD — Anima los números de [data-count-to] cuando entran en pantalla.
 * El HTML ya trae el valor final (si algo falla o el usuario prefiere menos
 * movimiento, se ve el número correcto); aquí solo se anima desde 0.
 */
const CountUp = {
  init(root = document) {
    const targets = root.querySelectorAll("[data-count-to]");
    if (!targets.length) return;
    if (Dom.prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    targets.forEach((el) => (el.textContent = "0"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          this._animate(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    targets.forEach((el) => observer.observe(el));
  },

  _animate(el) {
    const to = Number(el.dataset.countTo);
    const duration = 1200;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cúbico
      el.textContent = Format.number(Math.round(to * eased), 0);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  },
};
