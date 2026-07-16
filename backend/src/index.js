/**
 * Archivo principal del servidor Backend - VacunApp MX
 * Orquesta la configuración de Express, middlewares de seguridad,
 * conexiones a bases de datos (MySQL/Redis) y el enrutador principal.
 */

import express from "express";
import { createClient } from "redis";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import sequelize from "./config/db.js";
import cookieParser from "cookie-parser";

import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

import authRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patients.route.js";
import userRoutes from "./routes/users.routes.js";
import vaccineRoutes from "./routes/vaccine.routes.js";
import healthCenterRoutes from "./routes/healthCenter.routes.js";
import cartillaRoutes from "./routes/cartilla.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import searchRoutes from "./routes/search.routes.js";
import campaignRoutes from "./routes/campaign.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

/* ==========================================================================
   Configuración de Middlewares
   ========================================================================== */
app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Permite recibir las cookies del frontend
  }),
);
app.use(express.json());
app.use(cookieParser());

/**
 * Cliente de conexión para Redis.
 * Manejará sesiones, OTPs temporales y caché de lectura.
 */
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || "vacunapp-redis"}:6379`,
});

redisClient.on("error", (err) =>
  console.error("[Redis] Error de conexión:", err),
);

/* ==========================================================================
   Definición de Rutas
   ========================================================================== */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vaccines", vaccineRoutes);
app.use("/api/v1/health-centers", healthCenterRoutes);
app.use("/api/v1/cartillas", cartillaRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/campaigns", campaignRoutes);
app.get("/api/v1/health", async (req, res) => {
  try {
    // Uso de Sequelize para la consulta cruda de prueba
    const [rows] = await sequelize.query("SELECT 1 + 1 AS solution");

    await redisClient.set("ping", "pong", { EX: 10 });
    const redisReply = await redisClient.get("ping");

    res.status(200).json({
      status: "success",
      message: "Servicios del backend operativos.",
      connections: {
        mysql: rows[0].solution === 2 ? "Conectado" : "Error",
        redis: redisReply === "pong" ? "Conectado" : "Error",
      },
    });
  } catch (error) {
    console.error(
      "[Health Check] Falla en la validación de dependencias:",
      error,
    );
    res.status(500).json({
      status: "error",
      message: "Falla interna del servidor al conectar con los servicios.",
    });
  }
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

/* ==========================================================================
   Inicialización del Servidor
   ========================================================================== */
const startServer = async () => {
  try {
    await redisClient.connect();
    console.log("[Sistema] Conexión establecida con Redis.");

    // Lógica de reintentos para MySQL (Soluciona el ECONNREFUSED de Docker)
    let retries = 5;
    while (retries > 0) {
      try {
        await sequelize.authenticate();
        console.log(
          "[Sistema] Conexión establecida con MySQL a través de Sequelize.",
        );
        break; // Si conecta, salimos del bucle
      } catch (err) {
        console.log(
          `[Sistema] MySQL no está listo. Reintentando en 3 segundos... (${retries} intentos restantes)`,
        );
        retries -= 1;
        // Espera 3 segundos antes de volver a intentar
        await new Promise((res) => setTimeout(res, 3000));

        if (retries === 0) {
          throw new Error(
            "No se pudo conectar a MySQL después de múltiples intentos.",
          );
        }
      }
    }

    app.listen(PORT, () => {
      console.log(`[Sistema] Servidor Express operando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("[Sistema] Error crítico durante la inicialización:", error);
    if (error && error.stack) {
    console.error(error.stack);
  }
    process.exit(1);
  }
};

startServer();
