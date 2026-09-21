/**
 * MODELO — Cifras de "¿Cómo estamos?"
 * Los valores se guardan como número para poder animar el conteo.
 * Son cifras de referencia tomadas del sitio de ISA ENERGÍA y pueden variar.
 */
const StatsModel = {
  operation: [
    { icon: "zap", value: 14684, label: "Kilómetros de circuito de alto voltaje en operación" },
    { icon: "map-pin", value: 414, label: "Municipios en los que operamos" },
    { icon: "building-2", value: 144, label: "Subestaciones en operación" },
  ],

  projects: [
    { icon: "zap", value: 484, label: "Kilómetros de circuitos en construcción" },
    { icon: "hard-hat", value: 21, label: "Proyectos en construcción" },
    { icon: "building-2", value: 23, label: "Subestaciones en construcción, ampliación o renovación" },
  ],

  getOperation() {
    return this.operation;
  },

  getProjects() {
    return this.projects;
  },
};
