# 💻 VacunAppMX - Frontend

Interfaz de usuario para el sistema de vacunación. Construida como una Single Page Application (SPA) utilizando React, Vite para el empaquetado rápido y Zustand para el manejo global del estado.

## 📁 Estructura de Directorios

*   `public/`: Archivos estáticos.
*   `src/api/`: Configuración del cliente HTTP (`axios.js`) con interceptores para JWT.
*   `src/assets/`: Recursos gráficos como logotipos e imágenes.
*   `src/components/layout/`: Componentes reutilizables de la interfaz (Navbar, Botones, Tablas, Modales).
*   `src/pages/`: Vistas principales de la aplicación (Dashboard, Login, Registro, Gestión de Pacientes y Cartillas).
*   `src/store/`: Manejo de estado global utilizando Zustand (`authStore.js`, `cartillaStore.js`, etc.).

## ✨ Tecnologías Destacadas

*   **Vite:** Entorno de desarrollo ultra rápido.
*   **Zustand:** Manejo del estado global de forma minimalista, evitando el renderizado excesivo.
*   **Axios Interceptors:** Manejo automático de tokens de autorización en cada petición hacia el backend.
*   **React Router:** Navegación dinámica y protección de rutas (`ProtectedRoute.jsx`).
*   **Tailwind CSS:** (Asumido) Utilizado para los estilos de la interfaz garantizando un diseño responsivo y moderno.

## 💻 Scripts Disponibles

En el directorio `/frontend`, puedes ejecutar:

*   `npm run dev`: Inicia el servidor de desarrollo de Vite.
*   `npm run build`: Construye la aplicación para producción.
*   `npm run preview`: Previsualiza el build de producción localmente.

## 🔌 Variables de Entorno

Define tu archivo `.env` en la raíz del frontend:
*   `VITE_API_URL`: URL base de la API (ej. `http://localhost:4000/api/v1`).