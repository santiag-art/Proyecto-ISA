# ISA Energía — Proyecto web (MVC + Tailwind CSS)

Sitio inspirado en la página de **ISA ENERGÍA** (Interconexión Eléctrica, Colombia), hecho con
HTML, JavaScript plano y Tailwind por CDN, sin proceso de *build*. Se abre con doble clic en `index.html`.

> Proyecto académico con fines demostrativos. No es el sitio oficial de la compañía
> (oficial: https://colombia.isaenergia.com/).

## Qué incluye

| Página / sección | Descripción |
|---|---|
| `index.html` → Inicio | Campaña "cuenta" con una línea de transmisión SVG que se energiza al cargar. |
| Cifras | "¿Cómo estamos?" con números animados y bloque social (seguir / dejar de seguir). |
| **Red en operación** *(nuevo)* | Mapa esquemático SVG de Colombia: 13 subestaciones, dos capas (Red Central 1971 y Cuestecitas–Copey–Fundación 2025), panel de detalle y lista accesible por teclado. |
| **¿Cómo llega la energía a tu hogar?** *(nuevo)* | Pestañas accesibles: generación → transmisión → distribución → hogar. |
| **Nuestra historia** *(nuevo)* | Línea de tiempo 1967–2026 con enlaces "Ver en el mapa". |
| Calculadora de consumo *(mejorada)* | Cálculo en vivo, horas limitadas a 0–24, participación por equipo, consejo de ahorro y **guardar estimación**. |
| Sala de prensa *(mejorada)* | 5 noticias, filtro por categoría, búsqueda segura, artículo destacado y diálogo accesible. |
| `login.html` *(mejorada)* | Validación, cuenta de prueba, "Recordarme" real, bloqueo de 30 s tras 3 intentos fallidos. |
| `portal.html` *(nuevo)* | Panel protegido: estimaciones guardadas y cierre de sesión. |

**Cuenta de prueba:** usuario `demo`, contraseña `isa2026`.

## Arquitectura (MVC)

```
Proyecto-ISA/
├── index.html · login.html · portal.html
├── tests/models.test.js          → pruebas de los modelos (node tests/models.test.js)
└── assets/
    ├── css/styles.css            → solo lo que Tailwind no cubre (SVG del mapa, animaciones, ARIA)
    ├── img/favicon.svg
    └── js/
        ├── tailwind.config.js    → colores de marca y tipografías
        ├── models/               → datos y reglas; NO tocan el DOM
        ├── views/                → dibujan HTML a partir de datos; NO deciden qué pasa
        ├── controllers/          → conectan eventos, modelos y vistas
        ├── utils/                → Dom (escape/foco), Format, CountUp
        └── app.js · appLogin.js · appPortal.js   → puntos de entrada
```

Flujo típico: **evento → controlador → modelo (lógica) → vista (HTML)**.
Ejemplo: marcar la nevera → `CalculatorController` lee el formulario → `CalculatorModel.calculate()`
→ `CalculatorView.renderResults()`.

## Revisión del proyecto original

Problemas encontrados y corregidos:

1. **Inyección de HTML (XSS) en la búsqueda.** El mensaje "sin resultados" insertaba lo que escribía el usuario con `innerHTML`
   (comprobado: `<img src=x onerror=…>` ejecutaba código). Ahora todo texto dinámico pasa por `Dom.escape()`.
2. **El login aceptaba cualquier credencial** y no hacía nada al entrar. Ahora hay cuenta de prueba, sesión, redirección, "Recordarme" y bloqueo temporal.
3. **Menú sin destino:** todos los enlaces eran `#` (saltaban al inicio) y 6 tenían flecha sin submenú. Ahora hay submenús reales, resaltado por sección visible y aviso "próximamente" en lo que no existe.
4. **La barra de navegación se partía en dos líneas a 1280 px.** Los ítems sin sección se agruparon en "Más".
5. **Diálogo sin accesibilidad:** faltaban `role="dialog"`, `aria-modal`, atrapar el foco y devolverlo al cerrar.
6. **Horas sin límite en el modelo** (el `max` del HTML no impide escribir 50). Ahora `CalculatorModel` las limita a 0–24.
7. **Contraste insuficiente** en texto pequeño (`slate-400` sobre blanco, naranja y azul claro) y textos de 10–11 px.
8. **Lucide `@latest`** podía romper el sitio con una versión nueva: ahora `lucide@0`.
9. **Detalles:** un solo `<h1>` de una palabra ("cuenta"), sin `prefers-reduced-motion`, sin enlace "saltar al contenido", `localStorage` sin `try/catch`, carpeta residual literal `{models,views,controllers,utils}` dentro de `assets/js/`, y README que mencionaba un `.jsx` que no venía en el zip.

## Contenido y fuentes

- Las cifras de "¿Cómo estamos?" y las tres noticias base vienen del proyecto original.
- Los hitos de la historia, la Red Central (1971), la interconexión Cuestecitas–Copey–Fundación (270 km, 500 y 220 kV) y el cambio de marca a ISA ENERGÍA (2026) se redactaron con palabras propias a partir de prensa y comunicados públicos (ver "Fuente" en cada noticia).
- La silueta del mapa es simplificada y las posiciones son aproximadas; el mapa oficial está en el sitio de la compañía.
- La noticia de Valledupar se pasó a tiempo pasado porque el mantenimiento (30 de agosto de 2026) ya ocurrió.

## Límites conocidos

- La autenticación es **simulada en el navegador**: no hay servidor. Con un backend real habría que emitir y verificar tokens, guardar contraseñas con hash y limitar intentos en el servidor.
- Tailwind por CDN es cómodo para un proyecto académico, pero en producción se recomienda compilar el CSS.
- Requiere conexión a internet para cargar Tailwind, íconos y fuentes (sin fuentes se usa una tipografía del sistema).

## Cómo probar

```bash
node tests/models.test.js     # 24 pruebas de la lógica (sin dependencias)
```
Abre `index.html` en el navegador. Para probar el flujo completo: calcula un consumo → "Guardar estimación" →
`login.html` → "Usar la cuenta de prueba" → tu panel.
