/**
 * MODELO — Recorrido de la energía: de la planta al hogar
 * Cuatro etapas en orden. `voltage` resume el nivel de tensión de cada tramo.
 */
const EnergyPathModel = {
  steps: [
    {
      id: "generacion",
      label: "Generación",
      icon: "factory",
      voltage: "Se eleva antes de salir de la planta",
      who: "Plantas hidroeléctricas, térmicas, solares y eólicas",
      title: "La energía se produce en las plantas",
      text: "Las centrales convierten agua, gas, sol o viento en electricidad. Antes de salir, transformadores elevan su tensión: así viaja largas distancias con menos pérdidas.",
    },
    {
      id: "transmision",
      label: "Transmisión",
      icon: "radio-tower",
      voltage: "500 y 220 kV",
      who: "ISA ENERGÍA",
      title: "Torres y subestaciones cruzan el país",
      text: "Las líneas de alto voltaje llevan la energía desde donde se genera hasta donde se consume. Este es el trabajo de ISA ENERGÍA: transportarla con confiabilidad por el Sistema de Transmisión Nacional.",
      note: "XM, filial de ISA, coordina en tiempo real la operación del sistema interconectado.",
    },
    {
      id: "distribucion",
      label: "Distribución",
      icon: "cable",
      voltage: "Media y baja tensión",
      who: "Operadores de red locales",
      title: "Las redes locales la reparten",
      text: "En las subestaciones de cada región la tensión baja y los operadores de red la reparten por barrios, veredas y municipios.",
    },
    {
      id: "hogar",
      label: "Tu hogar",
      icon: "house",
      voltage: "120 V en tus enchufes",
      who: "Tú y tu medidor",
      title: "Llega a tus enchufes",
      text: "Un último transformador la deja en la tensión que usan tus electrodomésticos. Tu medidor registra el consumo, y esa cifra es la que puedes estimar en la calculadora.",
      cta: { label: "Estimar mi consumo", href: "#calculadora" },
    },
  ],

  getSteps() {
    return this.steps;
  },

  getById(id) {
    return this.steps.find((s) => s.id === id) || null;
  },
};
