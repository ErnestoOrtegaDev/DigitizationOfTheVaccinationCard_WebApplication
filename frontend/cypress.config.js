import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: false,
    setupNodeEvents(on, config) {
      // Implementación de eventos de nodo si se requiere
    },
  },
});