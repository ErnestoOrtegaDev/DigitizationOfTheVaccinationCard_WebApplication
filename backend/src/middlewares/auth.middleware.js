/**
 * Middleware de Autenticación - VacunApp MX
 * Valida la existencia y legitimidad de un JSON Web Token (JWT)
 * antes de permitir el acceso a rutas protegidas.
 */
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const verifyToken = (req, res, next) => {
    try {
        // Extraer el token de la cookie segura o del header de Autorización
        let token = req.cookies.jwt_access;

        if (!token) {
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        // Si no hay token en ningún lado, rechazar petición
        if (!token) {
            return res.status(401).json({ 
                status: 'error', 
                message: 'Acceso denegado. Se requiere un token de autenticación.' 
            });
        }

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

        // Adjuntar la información del usuario a la petición para que el controlador pueda usarla
        req.user = decoded;

        // Ceder el control al siguiente middleware o controlador
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                status: 'error', 
                message: 'El token ha expirado. Por favor, inicia sesión nuevamente.' 
            });
        }
        
        return res.status(403).json({ 
            status: 'error', 
            message: 'Token inválido o corrupto.' 
        });
    }
};

/**
 * Middleware de Autorización por Roles
 * Asegura que el usuario autenticado tenga los permisos necesarios.
 * @param {Array} roles - Arreglo de roles permitidos (ej. ['admin', 'nurse'])
 */
export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                status: 'error', 
                message: 'No tienes los permisos suficientes para realizar esta acción.' 
            });
        }
        next();
    };
};