/**
 * Archivo principal del servidor Backend - VacunApp MX
 * Orquesta la configuración de Express, middlewares de seguridad,
 * conexiones a bases de datos (MySQL/Redis) y el enrutador principal.
 */

import express from 'express';
import { createClient } from 'redis';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import sequelize from './config/db.js';

import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

/* ==========================================================================
   Configuración de Middlewares
   ========================================================================== */
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

/* ==========================================================================
   Configuración de Bases de Datos
   ========================================================================== */

/**
 * Cliente de conexión para Redis.
 * Manejará sesiones, OTPs temporales y caché de lectura.
 */
const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST || 'vacunapp-redis'}:6379`
});

redisClient.on('error', (err) => console.error('[Redis] Error de conexión:', err));

/* ==========================================================================
   Definición de Rutas
   ========================================================================== */
app.use('/api/auth', authRoutes);
/**
 * @route GET /api/health
 * @desc Verifica el estado de los servicios subyacentes (Base de datos y Caché).
 * @access Público
 */
app.get('/api/health', async (req, res) => {
    try {
        // Uso de Sequelize para la consulta cruda de prueba
        const [rows] = await sequelize.query('SELECT 1 + 1 AS solution');
        
        await redisClient.set('ping', 'pong', { EX: 10 });
        const redisReply = await redisClient.get('ping');

        res.status(200).json({
            status: 'success',
            message: 'Servicios del backend operativos.',
            connections: {
                mysql: rows[0].solution === 2 ? 'Conectado' : 'Error',
                redis: redisReply === 'pong' ? 'Conectado' : 'Error'
            }
        });
    } catch (error) {
        console.error('[Health Check] Falla en la validación de dependencias:', error);
        res.status(500).json({ 
            status: 'error', 
            message: 'Falla interna del servidor al conectar con los servicios.' 
        });
    }
});

/* ==========================================================================
   Inicialización del Servidor
   ========================================================================== */

/**
 * Función autoejecutable para inicializar las conexiones de manera asíncrona
 * antes de abrir el puerto de escucha de Express.
 */
/**
 * Función autoejecutable para inicializar las conexiones de manera asíncrona
 * antes de abrir el puerto de escucha de Express.
 */
const startServer = async () => {
    try {
        await redisClient.connect();
        console.log('[Sistema] Conexión establecida con Redis.');
        
        // Lógica de reintentos para MySQL (Soluciona el ECONNREFUSED de Docker)
        let retries = 5;
        while (retries > 0) {
            try {
                await sequelize.authenticate();
                console.log('[Sistema] Conexión establecida con MySQL a través de Sequelize.');
                break; // Si conecta, salimos del bucle
            } catch (err) {
                console.log(`[Sistema] MySQL no está listo. Reintentando en 3 segundos... (${retries} intentos restantes)`);
                retries -= 1;
                // Espera 3 segundos antes de volver a intentar
                await new Promise(res => setTimeout(res, 3000));
                
                if (retries === 0) {
                    throw new Error('No se pudo conectar a MySQL después de múltiples intentos.');
                }
            }
        }

        app.listen(PORT, () => {
            console.log(`[Sistema] Servidor Express operando en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('[Sistema] Error crítico durante la inicialización:', error);
        process.exit(1);
    }
};

startServer();