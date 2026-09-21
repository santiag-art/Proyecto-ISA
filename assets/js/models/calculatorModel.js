/**
 * MODELO — Calculadora de consumo energético
 * Estima el gasto mensual según los electrodomésticos y sus horas de uso.
 * No conoce el DOM: solo expone datos y la lógica de cálculo.
 * Las potencias son valores típicos de referencia, no de un equipo específico.
 */
const CalculatorModel = {
  tariffDefault: 850, // COP por kWh (referencia editable por el usuario)
  maxHours: 24,
  daysPerMonth: 30,

  appliances: [
    { id: "nevera", label: "Nevera", icon: "refrigerator", watts: 150, defaultHours: 24,
      tip: "Revisa que las puertas cierren bien, no la abras más de lo necesario y mantenla lejos de fuentes de calor." },
    { id: "tv", label: "Televisor", icon: "tv", watts: 120, defaultHours: 4,
      tip: "Apágalo en lugar de dejarlo en espera y baja el brillo de la pantalla." },
    { id: "lavadora", label: "Lavadora", icon: "washing-machine", watts: 500, defaultHours: 1,
      tip: "Lava con la carga completa y, si la ropa lo permite, con agua fría." },
    { id: "aire", label: "Aire acondicionado", icon: "wind", watts: 1000, defaultHours: 3,
      tip: "Usa una temperatura moderada, cierra puertas y ventanas y mantén limpios los filtros." },
    { id: "computador", label: "Computador", icon: "laptop", watts: 200, defaultHours: 6,
      tip: "Activa la suspensión automática y desconecta el cargador cuando no lo uses." },
    { id: "bombillos", label: "Bombillos LED", icon: "lightbulb", watts: 10, defaultHours: 5,
      tip: "Ya son de bajo consumo: basta con apagarlos al salir de la habitación." },
    { id: "microondas", label: "Microondas", icon: "microwave", watts: 1200, defaultHours: 0.5,
      tip: "Calienta solo lo que vas a consumir: los tiempos cortos hacen la diferencia." },
    { id: "ducha", label: "Ducha eléctrica", icon: "shower-head", watts: 4500, defaultHours: 0.3,
      tip: "Es el equipo que más potencia demanda: acortar unos minutos cada ducha se nota en la factura." },
  ],

  getAppliances() {
    return this.appliances;
  },

  getById(id) {
    return this.appliances.find((a) => a.id === id) || null;
  },

  /** Limita las horas a [0, 24]. `clamped` indica si hubo que corregir el valor. */
  sanitizeHours(value) {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return { hours: 0, clamped: value !== "" && value !== null && value !== undefined };
    if (n > this.maxHours) return { hours: this.maxHours, clamped: true };
    return { hours: n, clamped: false };
  },

  /** Tarifa válida (> 0) o la de referencia. */
  sanitizeTariff(value) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : this.tariffDefault;
  },

  /**
   * selections: [{ id, hours }] — solo los electrodomésticos marcados por el usuario.
   * tariff: precio del kWh en COP.
   * Devuelve los ítems ordenados de mayor a menor consumo, con su participación (%).
   */
  calculate(selections, tariff) {
    const price = this.sanitizeTariff(tariff);

    const items = selections
      .map(({ id, hours }) => {
        const appliance = this.getById(id);
        if (!appliance) return null;
        const h = this.sanitizeHours(hours).hours;
        const kwhDay = (appliance.watts * h) / 1000;
        return { ...appliance, hours: h, kwhDay, kwhMonth: kwhDay * this.daysPerMonth, costMonth: kwhDay * this.daysPerMonth * price };
      })
      .filter(Boolean)
      .sort((a, b) => b.kwhDay - a.kwhDay);

    const kwhDay = items.reduce((sum, i) => sum + i.kwhDay, 0);
    const kwhMonth = kwhDay * this.daysPerMonth;
    const costMonth = kwhMonth * price;

    items.forEach((i) => {
      i.share = kwhDay > 0 ? (i.kwhDay / kwhDay) * 100 : 0;
    });

    const top = items.length && items[0].kwhDay > 0 ? items[0] : null;
    return { items, kwhDay, kwhMonth, costMonth, tariff: price, top };
  },
};
