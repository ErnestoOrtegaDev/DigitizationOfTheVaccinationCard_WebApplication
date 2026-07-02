# ⚙️ VacunAppMX - Backend API

API RESTful construida con Node.js y Express. Se encarga de procesar la lógica de negocio, gestionar la autenticación y administrar la persistencia de datos en MySQL utilizando Sequelize.

## 📁 Estructura de Directorios

*   `src/config/`: Configuraciones de la base de datos (`db.js`) y documentación de la API (`swagger.js`).
*   `src/controllers/`: Controladores que manejan la lógica de cada ruta (Auth, Cartilla, HealthCenter, Patient, User, Vaccine).
*   `src/middlewares/`: Middlewares de Express, incluyendo protección de rutas (`auth.middleware.js`).
*   `src/models/`: Definición de esquemas de Sequelize (Pacientes, Vacunas, Dosis, Centros de Salud).
*   `src/routes/`: Definición de los endpoints de la API.
*   `src/utils/`: Utilidades generales, como la ofuscación de IDs (`hashids.js`).
*   `fix-encoding.js`: Script de mantenimiento para corregir la codificación UTF-8 en la base de datos.

## 🔑 Características Principales

*   **Autenticación JWT:** Endpoints protegidos mediante JSON Web Tokens.
*   **Ofuscación de IDs:** Uso de la librería `hashids` para encriptar los IDs numéricos autoincrementables (ej. convertir ID `1` a `X5Lno4KA`) antes de enviarlos al frontend, mejorando la seguridad.
*   **Cálculo Dinámico de Esquemas:** Lógica automatizada que calcula la edad exacta del paciente en meses y le asigna la "Cartilla" oficial correspondiente (Niños, Adolescentes, Adultos, Adultos Mayores).
*   **Documentación Interactiva:** Integración con Swagger UI para probar los endpoints.

## 💻 Scripts Disponibles

En el directorio `/backend`, puedes ejecutar:

*   `npm run dev`: Inicia el servidor usando Nodemon para recarga automática.
*   `node fix-encoding.js`: Ejecuta el script para corregir problemas de caracteres (acentos/eñes) en la base de datos de MySQL.

## 🔐 Variables de Entorno

Asegúrate de definir las siguientes variables en tu archivo `.env`:
*   `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
*   `JWT_SECRET` (Para la firma de tokens)
*   `HASHIDS_SALT` y `HASHIDS_LENGTH` (Para la encriptación de identificadores)