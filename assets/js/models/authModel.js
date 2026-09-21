/**
 * MODELO — Autenticación
 * Reglas de validación del formulario y verificación simulada de credenciales.
 * No hay backend: hay una cuenta de prueba y un bloqueo temporal tras varios
 * intentos fallidos (para mostrar cómo se defiende un formulario real).
 */
const AuthModel = {
  // Cuenta de demostración. En un sistema real las contraseñas jamás viajan ni se guardan así.
  users: [{ usuario: "demo", password: "isa2026", nombre: "Cliente Demo" }],

  maxAttempts: 3,
  lockSeconds: 30,
  latencyMs: 700,
  _attemptsKey: "isa-login-attempts",
  _lockKey: "isa-login-lock",

  demoAccount() {
    const { usuario, password } = this.users[0];
    return { usuario, password };
  },

  validate({ usuario, password }) {
    const errors = {};

    if (!usuario || usuario.trim().length < 3) {
      errors.usuario = "El usuario debe tener al menos 3 caracteres.";
    }

    if (!password) {
      errors.password = "Escribe tu contraseña.";
    } else if (password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    return { valid: Object.keys(errors).length === 0, errors };
  },

  /** Segundos que faltan para poder intentar de nuevo (0 si no hay bloqueo). */
  lockRemaining() {
    try {
      const until = Number(sessionStorage.getItem(this._lockKey) || 0);
      const left = Math.ceil((until - Date.now()) / 1000);
      return left > 0 ? left : 0;
    } catch (_) {
      return 0;
    }
  },

  _attempts() {
    try {
      return Number(sessionStorage.getItem(this._attemptsKey) || 0);
    } catch (_) {
      return 0;
    }
  },

  _setAttempts(n) {
    try {
      sessionStorage.setItem(this._attemptsKey, String(n));
    } catch (_) {
      /* se ignora */
    }
  },

  _lock() {
    try {
      sessionStorage.setItem(this._lockKey, String(Date.now() + this.lockSeconds * 1000));
    } catch (_) {
      /* se ignora */
    }
    this._setAttempts(0);
  },

  /** Verifica credenciales tras una pequeña espera que simula la red. */
  submit({ usuario, password }) {
    return new Promise((resolve) => {
      const locked = this.lockRemaining();
      if (locked > 0) {
        resolve({ ok: false, reason: "locked", seconds: locked });
        return;
      }

      setTimeout(() => {
        const name = usuario.trim().toLowerCase();
        const user = this.users.find((u) => u.usuario === name && u.password === password);

        if (user) {
          this._setAttempts(0);
          resolve({ ok: true, usuario: user.usuario, nombre: user.nombre });
          return;
        }

        const attempts = this._attempts() + 1;
        if (attempts >= this.maxAttempts) {
          this._lock();
          resolve({ ok: false, reason: "locked", seconds: this.lockSeconds });
        } else {
          this._setAttempts(attempts);
          resolve({ ok: false, reason: "credentials", attemptsLeft: this.maxAttempts - attempts });
        }
      }, this.latencyMs);
    });
  },
};
