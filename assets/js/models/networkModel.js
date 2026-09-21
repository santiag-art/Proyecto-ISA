/**
 * MODELO — Red de transmisión (mapa esquemático de Colombia)
 * Datos geográficos y de la red, y la proyección lat/lon → coordenadas del SVG.
 * No conoce el DOM. El contorno del país es una silueta simplificada y las
 * posiciones son aproximadas: sirven para ilustrar, no para medir distancias.
 */
const NetworkModel = {
  // Ventana del mapa: 50 px por grado de latitud/longitud (proyección equirrectangular).
  view: { width: 640, height: 870, latMax: 12.9, lonMin: -79.4, scale: 50 },

  /** [lat, lon] del contorno continental, en sentido horario desde la frontera con Panamá (Caribe). */
  outline: [
    [8.68, -77.36], [8.52, -77.27], [8.3, -77.05], [8.05, -76.95], [8.1, -76.72], [8.43, -76.78],
    [8.85, -76.43], [9.25, -76.08], [9.45, -75.72], [9.75, -75.62], [10.2, -75.58], [10.45, -75.52],
    [10.8, -75.27], [11.05, -74.87], [11.15, -74.5], [11.24, -74.21], [11.3, -74.0], [11.25, -73.57],
    [11.54, -72.91], [11.78, -72.44], [12.2, -72.15], [12.46, -71.68], [12.25, -71.35], [11.85, -71.32],
    // frontera con Venezuela
    [11.35, -72.02], [10.85, -72.5], [10.2, -72.88], [9.6, -72.95], [9.0, -73.1], [8.6, -72.4],
    [8.0, -72.3], [7.3, -72.15], [7.0, -71.9], [7.05, -70.8], [7.0, -70.0], [6.6, -68.9], [6.19, -67.48],
    [5.5, -67.6], [4.8, -67.8], [4.05, -67.8], [3.3, -67.5], [2.6, -67.2], [1.9, -67.1], [1.22, -66.85],
    // frontera con Brasil
    [1.1, -67.5], [1.0, -68.5], [0.85, -69.4], [0.4, -69.9], [-0.2, -69.8], [-1.35, -69.42], [-4.22, -69.94],
    // frontera con Perú
    [-3.75, -70.45], [-2.9, -70.3], [-2.3, -71.3], [-1.7, -72.5], [-1.1, -73.5], [-0.55, -74.3], [-0.13, -75.27],
    // frontera con Ecuador
    [0.2, -76.4], [0.35, -76.9], [0.65, -77.4], [0.83, -77.65], [0.95, -78.1], [1.05, -78.5], [1.2, -78.85],
    // costa del Pacífico
    [1.6, -79.03], [1.85, -78.75], [2.6, -78.05], [3.2, -77.5], [3.85, -77.2], [4.3, -77.4], [5.0, -77.4],
    [5.5, -77.55], [6.0, -77.4], [6.8, -77.7], [7.1, -77.85],
    // frontera con Panamá
    [7.25, -77.9], [7.8, -77.62], [8.15, -77.27], [8.4, -77.3],
  ],

  /** Referencias para orientarse (sin marcador de subestación). */
  cities: [
    { name: "Bogotá", lat: 4.71, lon: -74.07, side: "right-up" },
    { name: "Medellín", lat: 6.25, lon: -75.57, side: "left" },
    { name: "Cali", lat: 3.45, lon: -76.53, side: "left" },
  ],

  /** Rótulos de países y mares vecinos. */
  surroundings: [
    { text: "Venezuela", lat: 8.6, lon: -70.9 },
    { text: "Brasil", lat: -0.9, lon: -67.6 },
    { text: "Perú", lat: -2.7, lon: -73.4 },
    { text: "Ecuador", lat: -0.4, lon: -77.7 },
    { text: "Panamá", lat: 8.5, lon: -78.55 },
    { text: "Mar Caribe", lat: 12.4, lon: -75.6 },
    { text: "Océano Pacífico", lat: 2.2, lon: -79.05, vertical: true },
  ],

  /** Capas que el usuario puede encender o apagar sobre la base de subestaciones. */
  layers: [
    {
      id: "guajira",
      label: "Cuestecitas–Copey–Fundación",
      period: "2025",
      color: "#60A5FA",
      summary:
        "270 km en doble circuito a 500 y 220 kV. Conectó a La Guajira por primera vez a 500.000 voltios.",
    },
    {
      id: "central",
      label: "Red Central",
      period: "1971",
      color: "#FB923C",
      summary:
        "Primera gran interconexión de ISA: unió Guatapé, Yumbo y La Mesa con un punto común en La Esmeralda (1.075 km de circuito).",
    },
  ],

  /** Recorridos de cada capa, como listas de ids de subestaciones. */
  routes: [
    { layer: "guajira", branches: [["cuestecitas", "copey", "fundacion"]] },
    { layer: "central", branches: [["guatape", "esmeralda"], ["yumbo", "esmeralda"], ["lamesa", "esmeralda"]] },
  ],

  places: [
    { id: "cuestecitas", name: "Nueva Cuestecitas", dept: "La Guajira", lat: 11.1, lon: -72.68, layers: ["guajira"],
      blurb: "Subestación de 500 kV con tecnología GIS (encapsulada), la primera de su tipo en la región. Con ella, La Guajira se conectó por primera vez a 500.000 voltios." },
    { id: "copey", name: "Copey", dept: "Cesar", lat: 10.15, lon: -73.96, layers: ["guajira"],
      blurb: "Una de las tres subestaciones existentes que se ampliaron con la interconexión Cuestecitas–Copey–Fundación." },
    { id: "fundacion", name: "Fundación", dept: "Magdalena", lat: 10.52, lon: -74.19, layers: ["guajira"],
      blurb: "Extremo occidental de la interconexión Cuestecitas–Copey–Fundación, ampliado como parte del proyecto." },
    { id: "valledupar", name: "Valledupar", dept: "Cesar", lat: 10.46, lon: -73.25, layers: [],
      blurb: "Sus equipos tuvieron mantenimiento preventivo programado el 30 de agosto de 2026 para mantener la confiabilidad del servicio." },
    { id: "nbarranquilla", name: "Nueva Barranquilla", dept: "Atlántico", lat: 10.9, lon: -74.8, layers: [],
      blurb: "Nodo de la red de alto voltaje en el área de Barranquilla. En el mismo departamento, ISA construyó la subestación El Río y amplió Tebsa y Termoflores." },
    { id: "ternera", name: "Ternera", dept: "Bolívar", lat: 10.33, lon: -75.42, layers: [],
      blurb: "Punto de la red de alto voltaje en Cartagena, capital de Bolívar." },
    { id: "ocana", name: "Ocaña", dept: "Norte de Santander", lat: 8.25, lon: -73.35, layers: [],
      blurb: "Subestación de la red de alto voltaje en el nororiente del país." },
    { id: "sogamoso", name: "Sogamoso", dept: "Santander", lat: 7.1, lon: -73.53, layers: [],
      blurb: "Punto de conexión al Sistema de Transmisión Nacional en Santander (proyecto Conexión Sogamoso)." },
    { id: "guatape", name: "Guatapé", dept: "Antioquia", lat: 6.23, lon: -75.16, layers: ["central"],
      blurb: "Uno de los tres extremos de la Red Central que entró en operación en 1971." },
    { id: "esmeralda", name: "La Esmeralda", dept: "Caldas", lat: 4.98, lon: -75.6, layers: ["central"],
      blurb: "Punto común de la Red Central de 1971: hacia allí convergían las líneas desde Guatapé, Yumbo y La Mesa." },
    { id: "lamesa", name: "La Mesa", dept: "Cundinamarca", lat: 4.63, lon: -74.46, layers: ["central"],
      blurb: "Extremo de la Red Central de 1971 hacia Cundinamarca, en la zona de Bogotá." },
    { id: "yumbo", name: "Yumbo", dept: "Valle del Cauca", lat: 3.58, lon: -76.49, layers: ["central"],
      blurb: "Extremo sur de la Red Central de 1971, en el Valle del Cauca." },
    { id: "jamondino", name: "Jamondino", dept: "Nariño", lat: 1.15, lon: -77.3, layers: [],
      blurb: "Subestación del sur del país, cerca de la frontera con Ecuador y punto de la interconexión eléctrica entre ambos países." },
  ],

  /** lat/lon → {x, y} en el sistema de coordenadas del SVG. */
  project(lat, lon) {
    const { latMax, lonMin, scale } = this.view;
    return {
      x: Math.round((lon - lonMin) * scale * 10) / 10,
      y: Math.round((latMax - lat) * scale * 10) / 10,
    };
  },

  /** Atributo `d` del contorno del país. */
  outlinePath() {
    return (
      this.outline
        .map(([lat, lon], i) => {
          const { x, y } = this.project(lat, lon);
          return `${i ? "L" : "M"}${x} ${y}`;
        })
        .join(" ") + " Z"
    );
  },

  getPlaces() {
    return this.places;
  },

  getPlace(id) {
    return this.places.find((p) => p.id === id) || null;
  },

  getLayers() {
    return this.layers;
  },

  getLayer(id) {
    return this.layers.find((l) => l.id === id) || null;
  },

  /** Recorridos de una capa como listas de puntos proyectados. */
  getRoutePoints(layerId) {
    const route = this.routes.find((r) => r.layer === layerId);
    if (!route) return [];
    return route.branches.map((ids) =>
      ids.map((id) => {
        const p = this.getPlace(id);
        return this.project(p.lat, p.lon);
      })
    );
  },
};
