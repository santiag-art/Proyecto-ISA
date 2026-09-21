/**
 * CONTROLADOR — Recorrido de la energía (pestañas)
 */
const EnergyController = {
  _index: 0,

  init() {
    const steps = EnergyPathModel.getSteps();
    document.getElementById("energy-root").innerHTML = EnergyPathView.render(steps, this._index);
    this._bind(steps);
  },

  _go(steps, index, focus = false) {
    this._index = (index + steps.length) % steps.length;
    EnergyPathView.setActive(steps, this._index);
    if (focus) document.getElementById(`energy-tab-${steps[this._index].id}`).focus();
  },

  _bind(steps) {
    document.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-energy-step]");
      if (!tab) return;
      this._go(steps, steps.findIndex((s) => s.id === tab.dataset.energyStep));
    });

    document.addEventListener("keydown", (e) => {
      if (!e.target.closest("[data-energy-step]")) return;
      const moves = { ArrowRight: 1, ArrowLeft: -1 };
      if (e.key in moves) {
        e.preventDefault();
        this._go(steps, this._index + moves[e.key], true);
      } else if (e.key === "Home") {
        e.preventDefault();
        this._go(steps, 0, true);
      } else if (e.key === "End") {
        e.preventDefault();
        this._go(steps, steps.length - 1, true);
      }
    });
  },
};
