// Configuración del tema de Tailwind (CDN "Play").
// Centraliza la identidad visual: colores de marca y tipografías.
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0A2E6B",   // azul institucional principal
          deep: "#071F4A",   // azul profundo (banda del mapa, pie de página)
          blue: "#1E88E5",   // azul secundario (rellenos, botones)
          link: "#1565C0",   // azul para texto sobre fondo claro (contraste AA)
          green: "#10B981",  // verde energía / sostenibilidad
          leaf: "#047857",   // verde para texto sobre fondo claro (contraste AA)
          orange: "#F97316", // acento en líneas y rellenos
          ember: "#C2410C",  // naranja para texto sobre fondo claro (contraste AA)
          bg: "#F6F8FC",     // fondo general
          ink: "#1B2740",    // texto principal
          mist: "#EAF1FB",   // fondo suave para íconos
        },
      },
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 24px -12px rgba(10, 46, 107, 0.18)",
        pop: "0 18px 40px -16px rgba(7, 31, 74, 0.35)",
      },
    },
  },
};
