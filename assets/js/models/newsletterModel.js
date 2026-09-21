/**
 * MODELO — Boletín informativo
 * Valida el correo y simula el registro (no hay backend real).
 * Los correos suscritos se recuerdan en el navegador para detectar duplicados.
 */
const NewsletterModel = {
  key: "isa-newsletter",

  _read() {
    try {
      return JSON.parse(localStorage.getItem(this.key) || "[]");
    } catch (_) {
      return [];
    }
  },

  _write(list) {
    try {
      localStorage.setItem(this.key, JSON.stringify(list));
    } catch (_) {
      /* almacenamiento bloqueado: la suscripción vale solo en esta visita */
    }
  },

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((email || "").trim());
  },

  subscribe(email) {
    const clean = (email || "").trim().toLowerCase();
    if (!this.isValidEmail(clean)) {
      return { ok: false, message: "Escribe un correo válido, por ejemplo nombre@dominio.com." };
    }
    const list = this._read();
    if (list.includes(clean)) {
      return { ok: false, message: "Ese correo ya está suscrito al boletín." };
    }
    list.push(clean);
    this._write(list);
    return { ok: true, message: "Listo: te enviaremos las próximas noticias." };
  },
};
