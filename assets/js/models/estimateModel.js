/**
 * MODELO — Estimaciones guardadas
 * Guarda en el navegador (localStorage) las estimaciones de la calculadora.
 * Cada usuario tiene su propia lista; sin sesión se usa la lista "invitado",
 * que pasa al usuario cuando inicia sesión.
 */
const EstimateModel = {
  maxSaved: 20,
  guestKey: "invitado",

  _key(user) {
    return `isa-estimates:${user || this.guestKey}`;
  },

  _read(user) {
    try {
      const data = JSON.parse(localStorage.getItem(this._key(user)) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (_) {
      return [];
    }
  },

  _write(user, list) {
    try {
      localStorage.setItem(this._key(user), JSON.stringify(list));
      return true;
    } catch (_) {
      return false;
    }
  },

  list(user) {
    return this._read(user);
  },

  /** Agrega una estimación (la más reciente primero). Devuelve la lista actualizada o null si no se pudo guardar. */
  add(user, result) {
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      createdAt: Date.now(),
      kwhMonth: result.kwhMonth,
      costMonth: result.costMonth,
      tariff: result.tariff,
      items: result.items.map((i) => ({ id: i.id, label: i.label, hours: i.hours })),
    };
    const list = [entry, ...this._read(user)].slice(0, this.maxSaved);
    return this._write(user, list) ? list : null;
  },

  remove(user, id) {
    const list = this._read(user).filter((e) => e.id !== id);
    this._write(user, list);
    return list;
  },

  /** Pasa las estimaciones de "invitado" a la cuenta que acaba de iniciar sesión. */
  adoptGuest(user) {
    const guest = this._read(null);
    if (!guest.length) return 0;
    const merged = [...guest, ...this._read(user)]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, this.maxSaved);
    this._write(user, merged);
    try {
      localStorage.removeItem(this._key(null));
    } catch (_) {
      /* se ignora */
    }
    return guest.length;
  },
};
