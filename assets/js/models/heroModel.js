/**
 * MODELO — Campaña principal (hero)
 */
const HeroModel = {
  data: {
    srTitle: "ISA ENERGÍA: cuenta contigo",
    kicker: "cuenta",
    highlight: "Y cuenta contigo.",
    notice: "El fenómeno El Niño ya está ocurriendo.",
    ctaLabel: "Conoce cómo cuidamos el servicio",
    ctaHref: "#cifras",
  },

  get() {
    return this.data;
  },
};
