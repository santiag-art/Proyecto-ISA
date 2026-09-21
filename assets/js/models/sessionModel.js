/**
 * MODELO — Sesión de usuario (simulada en el navegador)
 * "Recordarme" guarda la sesión 7 días en localStorage; sin marcarlo, dura
 * mientras la pestaña esté abierta (sessionStorage).
 * IMPORTANTE: es una simulación académica. Una sesión real necesita un servidor
 * que emita y verifique tokens; nada del lado del cliente es realmente seguro.
 */
const SessionModel = {
  key: "isa-session",
  rememberDays: 7,

  get() {
    try {
      const raw = localStorage.getItem(this.key) || sessionStorage.getItem(this.key);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (session.expires && Date.now() > session.expires) {
        this.end();
        return null;
      }
      return session;
    } catch (_) {
      return null;
    }
  },

  isActive() {
    return this.get() !== null;
  },

  start({ usuario, nombre }, remember) {
    const session = {
      usuario,
      nombre,
      since: Date.now(),
      expires: remember ? Date.now() + this.rememberDays * 24 * 60 * 60 * 1000 : null,
    };
    this.end();
    try {
      (remember ? localStorage : sessionStorage).setItem(this.key, JSON.stringify(session));
    } catch (_) {
      /* almacenamiento bloqueado: no se puede recordar la sesión */
    }
    return session;
  },

  end() {
    try {
      localStorage.removeItem(this.key);
      sessionStorage.removeItem(this.key);
    } catch (_) {
      /* se ignora */
    }
  },
};
