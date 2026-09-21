/**
 * MODELO — Navegación
 * Fuente de verdad del menú. Cada ítem puede:
 *  - apuntar a una sección/página (href),
 *  - abrir un submenú (children),
 *  - estar "soon: true" (sección del sitio original aún no incluida en esta versión).
 * `sections` lista los ids de sección que deben resaltar el ítem al hacer scroll.
 * No conoce el DOM: solo expone datos.
 */
const NavModel = {
  items: [
    { id: "inicio", label: "Inicio", href: "#inicio", sections: ["inicio", "cifras"] },
    {
      id: "compania",
      label: "Nuestra compañía",
      sections: ["red", "energia", "historia"],
      children: [
        { label: "Red en operación", href: "#red" },
        { label: "Cómo llega la energía a tu hogar", href: "#energia" },
        { label: "Nuestra historia", href: "#historia" },
      ],
    },
    {
      id: "sostenible",
      label: "Gestión sostenible",
      sections: [],
      children: [{ label: "Noticias de sostenibilidad", href: "#noticias", newsTag: "Sostenibilidad" }],
    },
    {
      id: "clientes",
      label: "Clientes",
      sections: ["calculadora"],
      children: [
        { label: "Calculadora de consumo", href: "#calculadora" },
        { label: "Portal de clientes", href: "login.html" },
      ],
    },
    {
      id: "prensa",
      label: "Sala de prensa",
      sections: ["noticias"],
      children: [
        { label: "Últimas noticias", href: "#noticias", newsTag: "" },
        { label: "Avisos de mantenimiento", href: "#noticias", newsTag: "Mantenimiento" },
      ],
    },
    // Secciones del sitio original que aún no existen en esta versión: se agrupan en "Más"
    // para que la barra quepa en pantallas de 1280 px sin partir las etiquetas.
    {
      id: "mas",
      label: "Más",
      sections: [],
      children: [
        { label: "Proveedores", soon: true },
        { label: "Aula virtual", soon: true },
        { label: "Transparencia", soon: true },
        { label: "Soluciones", soon: true },
      ],
    },
  ],

  /** Ids de sección que observa el scroll-spy (deben existir en index.html). */
  sectionIds: ["inicio", "cifras", "red", "energia", "historia", "calculadora", "noticias"],

  getItems() {
    return this.items;
  },

  /** Devuelve el id del ítem de menú que corresponde a una sección visible. */
  itemForSection(sectionId) {
    const found = this.items.find((i) => (i.sections || []).includes(sectionId));
    return found ? found.id : null;
  },
};
