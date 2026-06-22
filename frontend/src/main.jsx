import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner"; // <-- ¡NUEVO! Importamos el contenedor de notificaciones
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Inyectamos el componente Toaster.
      Le ponemos 'richColors' para que pinte verde automáticamente si es éxito, o rojo si es error.
    */}
    <Toaster richColors position="top-right" closeButton />
    <App />
  </StrictMode>,
);
