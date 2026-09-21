/**
 * MODELO — Línea de tiempo de ISA
 * Hitos tomados de fuentes públicas (prensa y comunicados de ISA).
 * `layer` enlaza un hito con una capa del mapa de la red (ver NetworkModel).
 */
const TimelineModel = {
  events: [
    {
      year: "1967",
      title: "Nace ISA para unir las redes eléctricas del país",
      text: "El presidente Carlos Lleras Restrepo impulsó la creación de la empresa para interconectar los sistemas eléctricos de las regiones, que entonces funcionaban por separado.",
    },
    {
      year: "1971",
      title: "Entra en operación la Red Central",
      text: "Conectó las subestaciones de Guatapé, Yumbo y La Mesa con un punto común en La Esmeralda, con 1.075 km de circuito. Fue el primer paso hacia la integración nacional del sector eléctrico.",
      layer: "central",
    },
    {
      year: "1976",
      title: "La sede se traslada de Bogotá a Medellín",
      text: "La junta directiva decidió el cambio en 1976 y la asamblea de accionistas lo avaló un año después.",
    },
    {
      year: "1992",
      title: "El sector eléctrico se abre a la inversión privada",
      text: "Entre 1992 y 1994, leyes y decretos permitieron la participación de generadores independientes y separaron el transporte de energía de otras actividades.",
    },
    {
      year: "2001",
      title: "ISA sale a la Bolsa de Valores de Colombia",
      text: "La compañía se listó para conseguir recursos que financiaran su expansión.",
    },
    {
      year: "2014",
      title: "Nace Intercolombia",
      text: "ISA creó una filial dedicada a administrar, operar y mantener sus activos de transporte de energía en Colombia.",
    },
    {
      year: "2021",
      title: "Ecopetrol adquiere el control de ISA",
      text: "El 20 de agosto de 2021, Ecopetrol compró la participación mayoritaria (51,4 %) que tenía el Ministerio de Hacienda.",
    },
    {
      year: "2025",
      title: "La Guajira llega a 500.000 voltios",
      text: "El grupo ISA entregó la interconexión Cuestecitas–Copey–Fundación, con 270 km de líneas en doble circuito y la nueva subestación Nueva Cuestecitas.",
      layer: "guajira",
    },
    {
      year: "2026",
      title: "Intercolombia se convierte en ISA ENERGÍA",
      text: "La empresa adopta la marca global de ISA y asume la administración de los activos de transmisión de Transelca.",
    },
  ],

  getAll() {
    return this.events;
  },
};
