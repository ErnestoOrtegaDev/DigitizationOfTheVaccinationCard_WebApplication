/**
 * Middleware de Autenticación - VacunApp MX
 * Valida la existencia y legitimidad de un JSON Web Token (JWT)
 * antes de permitir el acceso a rutas protegidas.
 */

import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { decodeId } from '../utils/hashids.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.cookies.jwt_access;

        if (!token) {
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        if (!token) {
            return res.status(401).json({ 
                status: 'error', 
                message: 'Acceso denegado. Se requiere un token de autenticación.' 
            });
        }

        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        let userId = decoded.id;

        if (typeof userId === 'string' && !/^\d+$/.test(userId)) {
            const decodedId = decodeId(userId);
            if (decodedId) {
                userId = decodedId;
            }
        }

        let userRecord = null;
        if (userId) {
            userRecord = await User.findByPk(Number(userId), {
                attributes: ['id', 'email', 'role']
            });
        }

        req.user = userRecord
            ? {
                id: userRecord.id,
                email: userRecord.email,
                role: userRecord.role,
            }
            : {
                ...decoded,
                id: decoded.id,
                role: decoded.role ?? 'citizen',
            };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                status: 'error', 
                message: 'Sesion expirada. Por favor, inicia sesión nuevamente.' 
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