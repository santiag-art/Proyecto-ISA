/**
 * CONTROLADOR — Calculadora de consumo
 * Recalcula en vivo al cambiar cualquier campo y permite guardar la estimación.
 */
const CalculatorController = {
  _last: null,

  init() {
    document.getElementById("calc-root").innerHTML = CalculatorView.render(
      CalculatorModel.getAppliances(),
      CalculatorModel.tariffDefault
    );
    this._update();
    this._bind();
  },

  _selections() {
    return [...document.querySelectorAll("[data-appliance-check]:checked")].map((check) => {
      const id = check.dataset.applianceCheck;
      return { id, hours: document.getElementById(`hours-${id}`).value };
    });
  },

  _update() {
    const tariff = document.getElementById("calc-tariff").value;
    this._last = CalculatorModel.calculate(this._selections(), tariff);
    CalculatorView.renderResults(this._last);
    Dom.icons();
  },

  _reset() {
    document.querySelectorAll("[data-appliance-check]").forEach((check) => {
      check.checked = false;
      const hours = document.getElementById(`hours-${check.dataset.applianceCheck}`);
      hours.disabled = true;
      hours.value = CalculatorModel.getById(check.dataset.applianceCheck).defaultHours;
    });
    document.getElementById("calc-tariff").value = CalculatorModel.tariffDefault;
    CalculatorView.setWarning("");
    this._update();
  },

  _save() {
    if (!this._last || !this._last.items.length) return;
    const session = SessionModel.get();
    const saved = EstimateModel.add(session ? session.usuario : null, this._last);
    if (!saved) {
      ToastView.show("No se pudo guardar: el navegador bloqueó el almacenamiento.");
    } else if (session) {
      ToastView.show("Estimación guardada en tu panel.");
    } else {
      ToastView.show("Estimación guardada. Inicia sesión para verla en tu panel.");
    }
  },

  _bind() {
    const form = document.getElementById("calc-form");

    form.addEventListener("change", (e) => {
      const check = e.target.closest("[data-appliance-check]");
      if (check) {
        document.getElementById(`hours-${check.dataset.applianceCheck}`).disabled = !check.checked;
      }
      this._update();
    });

    form.addEventListener("input", (e) => {
      const hours = e.target.closest("[data-appliance-hours]");
      if (hours) {
        const { hours: safe, clamped } = CalculatorModel.sanitizeHours(hours.value);
        if (clamped) {
          hours.value = safe;
          CalculatorView.setWarning(`Las horas de uso van de 0 a ${CalculatorModel.maxHours} al día; ajustamos el valor.`);
        } else {
          CalculatorView.setWarning("");
        }
      }
      if (e.target.matches("[data-appliance-hours], #calc-tariff")) this._update();
    });

    form.addEventListener("submit", (e) => e.preventDefault());

    document.addEventListener("click", (e) => {
      if (e.target.closest("#calc-reset")) this._reset();
      else if (e.target.closest("#calc-save")) this._save();
    });
  },
};
