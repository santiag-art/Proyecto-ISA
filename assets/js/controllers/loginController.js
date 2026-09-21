/**
 * CONTROLADOR — Inicio de sesión
 * Valida el formulario, verifica credenciales con AuthModel, gestiona el bloqueo
 * temporal y, si todo sale bien, abre la sesión y lleva al panel.
 */
const LoginController = {
  _lockTimer: null,

  init() {
    if (SessionModel.isActive()) {
      window.location.replace("portal.html");
      return;
    }
    document.getElementById("login-root").innerHTML = LoginView.render(AuthModel.demoAccount());
    Dom.icons();
    this._bind();
    this._resumeLock();
  },

  _values() {
    return {
      usuario: document.getElementById("usuario").value,
      password: document.getElementById("password").value,
    };
  },

  /** Si el usuario recarga durante un bloqueo, se retoma la cuenta regresiva. */
  _resumeLock() {
    const left = AuthModel.lockRemaining();
    if (left > 0) this._startLockCountdown(left);
  },

  _startLockCountdown(seconds) {
    clearInterval(this._lockTimer);
    LoginView.showAlert(`Demasiados intentos fallidos. Podrás intentarlo de nuevo en ${seconds} segundos.`, "error");
    LoginView.setLocked(seconds);
    this._lockTimer = setInterval(() => {
      const left = AuthModel.lockRemaining();
      LoginView.setLocked(left);
      if (left <= 0) {
        clearInterval(this._lockTimer);
        LoginView.hideAlert();
      }
    }, 500);
  },

  _bind() {
    const form = document.getElementById("login-form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      LoginView.clearAllErrors();

      const values = this._values();
      const check = AuthModel.validate(values);
      if (!check.valid) {
        Object.entries(check.errors).forEach(([field, msg]) => LoginView.showFieldError(field, msg));
        document.getElementById(Object.keys(check.errors)[0]).focus();
        return;
      }

      LoginView.setLoading(true);
      const result = await AuthModel.submit(values);

      if (result.ok) {
        const remember = document.getElementById("remember").checked;
        SessionModel.start({ usuario: result.usuario, nombre: result.nombre }, remember);
        EstimateModel.adoptGuest(result.usuario);
        LoginView.showAlert(`Bienvenido, ${result.nombre}. Entrando a tu panel…`, "success");
        setTimeout(() => window.location.assign("portal.html"), 700);
        return;
      }

      LoginView.setLoading(false);
      if (result.reason === "locked") {
        this._startLockCountdown(result.seconds);
      } else {
        const n = result.attemptsLeft;
        LoginView.showAlert(`Usuario o contraseña incorrectos. Te ${n === 1 ? "queda 1 intento" : `quedan ${n} intentos`}.`, "error");
      }
    });

    form.addEventListener("reset", () => {
      LoginView.clearAllErrors();
      LoginView.setPasswordVisible(false);
    });

    // Al escribir, se limpia el error de ese campo
    ["usuario", "password"].forEach((id) => {
      document.getElementById(id).addEventListener("input", () => LoginView.clearFieldError(id));
    });

    document.getElementById("toggle-password").addEventListener("click", () => {
      const visible = document.getElementById("password").type === "password";
      LoginView.setPasswordVisible(visible);
    });

    document.getElementById("fill-demo").addEventListener("click", () => {
      const demo = AuthModel.demoAccount();
      document.getElementById("usuario").value = demo.usuario;
      document.getElementById("password").value = demo.password;
      LoginView.clearAllErrors();
      document.getElementById("submit-btn").focus();
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-soon]")) ToastView.show("La recuperación de contraseña no está disponible en esta versión del proyecto.");
    });
  },
};
