/**
 * VISTA — Inicio de sesión
 */
const LoginView = {
  render(demo) {
    const inputBase =
      "w-full h-11 pl-9 border border-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-lg text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/25 aria-[invalid=true]:border-red-500";
    return `
      <div class="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-card p-8 sm:p-10 transition-colors duration-300">
        <div class="flex flex-col items-center mb-6">
          <span class="text-3xl italic font-display font-bold text-brand-navy dark:text-white">isa</span>
          <span class="text-[10px] tracking-[0.2em] font-medium text-brand-navy/80 dark:text-white/70">ENERGÍA</span>
        </div>

        <h1 class="font-display text-2xl font-bold text-brand-navy dark:text-white text-center mb-1">Inicio de sesión</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400 text-center mb-6">Ingresa tus credenciales para ver tu panel</p>

        <div class="mb-6 rounded-lg bg-brand-mist dark:bg-slate-900 px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
          <p><span class="font-semibold">Cuenta de prueba:</span> usuario <code class="font-mono">${Dom.escape(demo.usuario)}</code>, contraseña <code class="font-mono">${Dom.escape(demo.password)}</code>.</p>
          <button type="button" id="fill-demo" class="mt-1.5 font-semibold text-brand-link dark:text-blue-300 hover:underline">Usar la cuenta de prueba</button>
        </div>

        <form id="login-form" novalidate>
          <div class="mb-4">
            <label for="usuario" class="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">Usuario</label>
            <div class="relative">
              <i data-lucide="user" class="h-4 w-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"></i>
              <input id="usuario" name="usuario" type="text" placeholder="Ingresa tu usuario" autocomplete="username"
                aria-describedby="usuario-error" class="${inputBase} pr-3" />
            </div>
            <p id="usuario-error" data-error-for="usuario" class="text-sm text-red-700 dark:text-red-300 mt-1 hidden"></p>
          </div>

          <div class="mb-2">
            <label for="password" class="block text-sm font-medium text-slate-800 dark:text-slate-200 mb-1.5">Contraseña</label>
            <div class="relative">
              <i data-lucide="lock" class="h-4 w-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"></i>
              <input id="password" name="password" type="password" placeholder="Ingresa tu contraseña" autocomplete="current-password"
                aria-describedby="password-error" class="${inputBase} pr-11" />
              <button type="button" id="toggle-password" aria-label="Mostrar contraseña" aria-pressed="false"
                class="absolute right-1.5 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-md text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                <i data-lucide="eye" class="h-4 w-4" data-eye-on></i>
                <i data-lucide="eye-off" class="h-4 w-4 hidden" data-eye-off></i>
              </button>
            </div>
            <p id="password-error" data-error-for="password" class="text-sm text-red-700 dark:text-red-300 mt-1 hidden"></p>
          </div>

          <div class="flex items-center justify-between mb-6 mt-3">
            <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 select-none">
              <input type="checkbox" id="remember" class="rounded border-slate-400 text-brand-blue focus:ring-brand-blue/30" />
              Recordarme
            </label>
            <button type="button" data-soon class="text-sm text-brand-link dark:text-blue-300 hover:underline">¿Olvidaste tu contraseña?</button>
          </div>

          <div id="form-alert" role="alert" class="hidden mb-4 text-sm rounded-lg px-3 py-2"></div>

          <div class="flex gap-3">
            <button type="submit" id="submit-btn"
              class="flex-1 h-11 rounded-lg bg-brand-link text-white font-semibold text-sm transition hover:bg-brand-navy disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span id="submit-label">Entrar</span>
              <i data-lucide="loader-2" id="submit-spinner" class="h-4 w-4 animate-spin hidden"></i>
            </button>
            <button type="reset" class="h-11 px-5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition">
              Limpiar
            </button>
          </div>
        </form>

        <a href="index.html" class="mt-6 flex items-center justify-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-brand-navy dark:hover:text-white">
          <i data-lucide="arrow-left" class="h-3.5 w-3.5"></i> Volver al inicio
        </a>
      </div>
    `;
  },

  showFieldError(field, message) {
    const input = document.getElementById(field);
    const errorEl = document.querySelector(`[data-error-for="${field}"]`);
    if (input) input.setAttribute("aria-invalid", "true");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove("hidden");
    }
  },

  clearFieldError(field) {
    const input = document.getElementById(field);
    const errorEl = document.querySelector(`[data-error-for="${field}"]`);
    if (input) input.removeAttribute("aria-invalid");
    if (errorEl) errorEl.classList.add("hidden");
  },

  clearAllErrors() {
    ["usuario", "password"].forEach((f) => this.clearFieldError(f));
    this.hideAlert();
  },

  showAlert(message, type = "error") {
    const alertEl = document.getElementById("form-alert");
    alertEl.textContent = message;
    alertEl.className =
      "mb-4 text-sm rounded-lg px-3 py-2 " +
      (type === "error"
        ? "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
        : "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200");
  },

  hideAlert() {
    document.getElementById("form-alert").classList.add("hidden");
  },

  setLoading(isLoading) {
    const btn = document.getElementById("submit-btn");
    document.getElementById("submit-spinner").classList.toggle("hidden", !isLoading);
    document.getElementById("submit-label").textContent = isLoading ? "Ingresando…" : "Entrar";
    btn.disabled = isLoading;
  },

  /** Bloquea el botón mientras dura el bloqueo temporal y muestra la cuenta regresiva. */
  setLocked(seconds) {
    const btn = document.getElementById("submit-btn");
    const label = document.getElementById("submit-label");
    if (seconds > 0) {
      btn.disabled = true;
      label.textContent = `Espera ${seconds} s`;
    } else {
      btn.disabled = false;
      label.textContent = "Entrar";
    }
  },

  setPasswordVisible(visible) {
    const input = document.getElementById("password");
    const btn = document.getElementById("toggle-password");
    input.type = visible ? "text" : "password";
    btn.setAttribute("aria-pressed", String(visible));
    btn.setAttribute("aria-label", visible ? "Ocultar contraseña" : "Mostrar contraseña");
    btn.querySelector("[data-eye-on]").classList.toggle("hidden", visible);
    btn.querySelector("[data-eye-off]").classList.toggle("hidden", !visible);
  },
};
