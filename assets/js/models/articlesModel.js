/**
 * MODELO — Artículos / Sala de prensa
 * Datos de cada noticia y lógica de búsqueda + filtro por categoría.
 * `content` es una lista de párrafos. Las notas con `source` se redactaron
 * (parafraseadas) a partir de publicaciones reales; las demás vienen del proyecto base.
 */
const ArticlesModel = {
  items: [
    {
      id: "guajira-red-electrica",
      tag: "Proyectos",
      title: "ISA ENERGÍA culmina en La Guajira proyecto clave para una red eléctrica más fuerte",
      excerpt:
        "Para garantizar la seguridad del Sistema Interconectado Nacional (SIN) durante la intervención, fue necesaria una interrupción programada del servicio en sectores urbanos y rurales del municipio.",
      content: [
        "Para garantizar la seguridad del Sistema Interconectado Nacional (SIN) durante la intervención, fue necesario realizar una interrupción programada del servicio en sectores urbanos y rurales del municipio.",
        "El proyecto fortalece la capacidad de transporte de energía en el departamento y reduce el riesgo de afectaciones ante eventos climáticos extremos, beneficiando a miles de familias de la región Caribe.",
      ],
      accent: "#F97316",
      accentText: "#C2410C",
      icon: "zap",
      date: "2026-08-12",
    },
    {
      id: "pacto-global-sostenibilidad",
      tag: "Sostenibilidad",
      title: "ISA ENERGÍA recibe reconocimiento de Pacto Global por su aporte al desarrollo sostenible",
      excerpt:
        "La iniciativa fortalece la seguridad alimentaria y la resiliencia de comunidades campesinas y pescadoras del departamento de Bolívar.",
      content: [
        "La iniciativa de ISA ENERGÍA fortalece la seguridad alimentaria y la resiliencia de comunidades campesinas y pescadoras del departamento de Bolívar.",
        "El reconocimiento de Pacto Global destaca los programas de acompañamiento técnico, acceso a agua para riego y fortalecimiento organizativo que la compañía ha impulsado junto a las comunidades vecinas a su infraestructura.",
      ],
      accent: "#059669",
      accentText: "#047857",
      icon: "leaf",
      date: "2026-07-28",
    },
    {
      id: "mantenimiento-valledupar",
      tag: "Mantenimiento",
      title: "Mantenimiento en equipos de la subestación Valledupar",
      excerpt:
        "Los trabajos se desarrollaron el domingo 30 de agosto entre las 6:00 y las 8:00 de la mañana y podían generar afectaciones del servicio en sectores de Valledupar.",
      content: [
        "Los trabajos se desarrollaron el domingo 30 de agosto entre las 6:00 y las 8:00 de la mañana y podían generar afectaciones en el servicio de energía en sectores de Valledupar.",
        "El mantenimiento preventivo busca garantizar la confiabilidad de los equipos de la subestación y prevenir interrupciones no programadas en los próximos meses.",
      ],
      accent: "#2563EB",
      accentText: "#1D4ED8",
      icon: "wrench",
      date: "2026-08-30",
    },
    {
      id: "isa-energia-nueva-marca",
      tag: "Compañía",
      title: "Intercolombia adopta la marca ISA ENERGÍA y asume los activos de Transelca",
      excerpt:
        "Desde 2026 la empresa opera bajo la identidad global de ISA y administra, opera y mantiene también los activos de transmisión de Transelca.",
      content: [
        "A partir de 2026, Intercolombia pasó a llamarse ISA ENERGÍA, una identidad que ya usaban las filiales de ISA en Brasil, Chile y Perú y que responde a la estrategia ISA2040.",
        "Con el cambio, la compañía asume además la administración, operación y mantenimiento de los activos de transmisión de Transelca, que se suman a los que ya gestionaba desde 2014.",
        "Según el comunicado (cifras a enero de 2026), ISA ENERGÍA está presente en más de 400 municipios, con cerca de 14.000 kilómetros de líneas, 120 subestaciones y 735 trabajadores.",
      ],
      accent: "#0A2E6B",
      accentText: "#0A2E6B",
      icon: "building-2",
      date: "2026-01-13",
      source: {
        label: "ISA Intercolombia",
        url: "https://colombia.isaenergia.com/isaintercolombia/2026/01/13/intercolombia-se-convierte-en-isa-energia-y-asume-la-administracion-de-los-activos-de-transelca/",
      },
    },
    {
      id: "guajira-500kv",
      tag: "Proyectos",
      title: "La Guajira se conecta por primera vez a 500.000 voltios",
      excerpt:
        "El grupo ISA entregó la interconexión Cuestecitas–Copey–Fundación: 270 kilómetros de líneas en doble circuito y una nueva subestación encapsulada.",
      content: [
        "La interconexión Cuestecitas–Copey–Fundación, adjudicada por la UPME al grupo ISA, incluye 270 kilómetros de líneas de transmisión en doble circuito a 500 y 220 kV.",
        "La obra amplió tres subestaciones existentes (Fundación, Copey y Cuestecitas) y sumó Nueva Cuestecitas, una subestación de 500 kV con tecnología GIS (aislada en gas) que es la primera de su tipo en la región.",
        "Con ella, La Guajira queda conectada por primera vez a un nivel de tensión de 500.000 voltios y se integra plenamente al Sistema de Transmisión Nacional.",
      ],
      accent: "#1E88E5",
      accentText: "#1565C0",
      icon: "radio-tower",
      date: "2025-10-17",
      layer: "guajira",
      source: {
        label: "Publimetro",
        url: "https://www.publimetro.co/noticias/2025/10/17/en-la-guajira-si-se-puede-isa-entrega-megaproyecto-que-impulsa-la-transicion-energetica-del-pais/",
      },
    },
  ],

  /** Noticias ordenadas de la más reciente a la más antigua. */
  getAll() {
    return [...this.items].sort((a, b) => b.date.localeCompare(a.date));
  },

  getById(id) {
    return this.items.find((a) => a.id === id) || null;
  },

  /** Lista de categorías únicas, para los chips de filtro */
  getTags() {
    return [...new Set(this.items.map((a) => a.tag))];
  },

  /** Filtra por texto (título, extracto, categoría, contenido) y, opcionalmente, por categoría */
  search(query, tag) {
    const q = (query || "").trim().toLowerCase();
    return this.getAll().filter((a) => {
      const matchesTag = !tag || a.tag === tag;
      const haystack = [a.title, a.excerpt, a.tag, ...a.content].join(" ").toLowerCase();
      return matchesTag && (!q || haystack.includes(q));
    });
  },
};
