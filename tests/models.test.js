/**
 * Pruebas de la capa MODELO (sin navegador, sin dependencias).
 * Ejecutar:  node tests/models.test.js
 * Los modelos son scripts globales; aquí se cargan en un contexto aislado (vm)
 * con un almacenamiento falso.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const fakeStorage = () => {
  const data = {};
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => (data[k] = String(v)),
    removeItem: (k) => delete data[k],
    clear: () => Object.keys(data).forEach((k) => delete data[k]),
  };
};

const ctx = {
  console,
  localStorage: fakeStorage(),
  sessionStorage: fakeStorage(),
  window: { matchMedia: () => ({ matches: false }) },
  setTimeout: (fn) => fn(), // sin esperas reales
};
vm.createContext(ctx);

const root = path.join(__dirname, "..", "assets", "js");
const load = (rel, exportName) =>
  vm.runInContext(`${fs.readFileSync(path.join(root, rel), "utf8")}\nthis.${exportName} = ${exportName};`, ctx, { filename: rel });

load("utils/dom.js", "Dom");
["calculatorModel:CalculatorModel", "articlesModel:ArticlesModel", "networkModel:NetworkModel", "timelineModel:TimelineModel",
 "authModel:AuthModel", "estimateModel:EstimateModel", "sessionModel:SessionModel", "newsletterModel:NewsletterModel",
 "navModel:NavModel", "energyPathModel:EnergyPathModel"].forEach((p) => {
  const [file, name] = p.split(":");
  load(`models/${file}.js`, name);
});

let passed = 0;
const tests = [];
const test = (name, fn) => tests.push([name, fn]);

const { Dom, CalculatorModel: Calc, ArticlesModel: News, NetworkModel: Net, TimelineModel: Time, AuthModel: Auth,
  EstimateModel: Est, SessionModel: Session, NewsletterModel: Newsletter, NavModel: Nav, EnergyPathModel: Energy } = ctx;

test("escape neutraliza HTML", () => assert.strictEqual(Dom.escape('<img onerror="x">'), "&lt;img onerror=&quot;x&quot;&gt;"));

test("ducha 0,3 h a 4500 W = 1,35 kWh/día", () => {
  const r = Calc.calculate([{ id: "ducha", hours: 0.3 }], 850);
  assert.ok(Math.abs(r.kwhDay - 1.35) < 1e-9);
  assert.ok(Math.abs(r.kwhMonth - 40.5) < 1e-9);
  assert.ok(Math.abs(r.costMonth - 40.5 * 850) < 1e-6);
});
test("limita las horas a 24 y marca la corrección", () => {
  assert.deepStrictEqual({ ...Calc.sanitizeHours(50) }, { hours: 24, clamped: true });
  assert.deepStrictEqual({ ...Calc.sanitizeHours(-3) }, { hours: 0, clamped: true });
  assert.deepStrictEqual({ ...Calc.sanitizeHours(5) }, { hours: 5, clamped: false });
});
test("tarifa inválida usa la de referencia", () => assert.strictEqual(Calc.sanitizeTariff("abc"), Calc.tariffDefault));
test("ordena por consumo y las participaciones suman 100", () => {
  const r = Calc.calculate([{ id: "tv", hours: 4 }, { id: "nevera", hours: 24 }, { id: "ducha", hours: 0.3 }], 850);
  assert.strictEqual(r.items[0].id, "nevera");
  assert.ok(Math.abs(r.items.reduce((s, i) => s + i.share, 0) - 100) < 1e-9);
  assert.strictEqual(r.top.id, "nevera");
});
test("sin selección no hay resultados", () => {
  const r = Calc.calculate([], 850);
  assert.strictEqual(r.items.length, 0);
  assert.strictEqual(r.top, null);
});

test("ordena de más reciente a más antigua", () => {
  const dates = News.getAll().map((a) => a.date);
  assert.deepStrictEqual(Array.from(dates), [...dates].sort().reverse());
});
test("busca sin distinguir mayúsculas y combina con la categoría", () => {
  assert.strictEqual(News.search("GUAJIRA").length, 2);
  assert.strictEqual(News.search("guajira", "Proyectos").length, 2);
  assert.strictEqual(News.search("guajira", "Mantenimiento").length, 0);
});
test("consulta con HTML no rompe la búsqueda", () => assert.strictEqual(News.search("<script>").length, 0));

test("la proyección cae dentro de la ventana del mapa", () => {
  [...Net.places, ...Net.cities].forEach((p) => {
    const { x, y } = Net.project(p.lat, p.lon);
    assert.ok(x > 0 && x < Net.view.width && y > 0 && y < Net.view.height, p.name);
  });
});
test("las rutas solo usan subestaciones existentes", () => {
  Net.routes.forEach((r) => r.branches.flat().forEach((id) => assert.ok(Net.getPlace(id), id)));
});
test("los ids de capa de los lugares existen", () => {
  Net.places.forEach((p) => p.layers.forEach((l) => assert.ok(Net.getLayer(l), l)));
});

test("la línea de tiempo está en orden cronológico", () => {
  const years = Time.getAll().map((e) => Number(e.year));
  assert.deepStrictEqual(Array.from(years), [...years].sort((a, b) => a - b));
});
test("los hitos con capa apuntan a una capa real", () => {
  Time.getAll().filter((e) => e.layer).forEach((e) => assert.ok(Net.getLayer(e.layer), e.layer));
});
test("el menú resuelve la sección activa", () => assert.strictEqual(Nav.itemForSection("red"), "compania"));
test("el recorrido tiene 4 etapas", () => assert.strictEqual(Energy.getSteps().length, 4));

test("valida usuario y contraseña", () => {
  assert.strictEqual(Auth.validate({ usuario: "ab", password: "123" }).valid, false);
  assert.strictEqual(Auth.validate({ usuario: "demo", password: "isa2026" }).valid, true);
});
test("la cuenta de prueba entra", async () => {
  const r = await Auth.submit({ usuario: " DEMO ", password: "isa2026" });
  assert.strictEqual(r.ok, true);
});
test("tres fallos bloquean el acceso", async () => {
  ctx.sessionStorage.clear();
  for (let i = 0; i < 2; i++) assert.strictEqual((await Auth.submit({ usuario: "demo", password: "mala-clave" })).reason, "credentials");
  assert.strictEqual((await Auth.submit({ usuario: "demo", password: "mala-clave" })).reason, "locked");
  assert.ok(Auth.lockRemaining() > 0);
  assert.strictEqual((await Auth.submit({ usuario: "demo", password: "isa2026" })).reason, "locked");
});
test("sesión: inicia, recuerda y termina", () => {
  ctx.localStorage.clear(); ctx.sessionStorage.clear();
  Session.start({ usuario: "demo", nombre: "Cliente Demo" }, false);
  assert.strictEqual(Session.get().usuario, "demo");
  assert.strictEqual(ctx.localStorage.getItem("isa-session"), null); // sin "recordarme" no va a localStorage
  Session.end();
  assert.strictEqual(Session.isActive(), false);
});
test("sesión vencida se descarta", () => {
  ctx.localStorage.setItem("isa-session", JSON.stringify({ usuario: "x", expires: Date.now() - 1000 }));
  assert.strictEqual(Session.get(), null);
});

test("guarda, migra de invitado a usuario y elimina", () => {
  ctx.localStorage.clear();
  const result = Calc.calculate([{ id: "nevera", hours: 24 }], 850);
  Est.add(null, result);
  assert.strictEqual(Est.list(null).length, 1);
  assert.strictEqual(Est.adoptGuest("demo"), 1);
  assert.strictEqual(Est.list(null).length, 0);
  const [e] = Est.list("demo");
  assert.strictEqual(Est.remove("demo", e.id).length, 0);
});
test("respeta el máximo de estimaciones guardadas", () => {
  ctx.localStorage.clear();
  const result = Calc.calculate([{ id: "tv", hours: 1 }], 850);
  for (let i = 0; i < Est.maxSaved + 5; i++) Est.add("demo", result);
  assert.strictEqual(Est.list("demo").length, Est.maxSaved);
});
test("boletín valida y detecta duplicados", () => {
  ctx.localStorage.clear();
  assert.strictEqual(Newsletter.subscribe("malo").ok, false);
  assert.strictEqual(Newsletter.subscribe("a@b.co").ok, true);
  assert.strictEqual(Newsletter.subscribe("A@B.co").ok, false);
});

(async () => {
  for (const [name, fn] of tests) {
    try {
      await fn();
      passed++;
      console.log("  ok  ", name);
    } catch (e) {
      console.error("  FAIL", name, "\n      ", e.message);
      process.exitCode = 1;
    }
  }
  console.log(`\n${passed}/${tests.length} pruebas pasaron.`);
})();
