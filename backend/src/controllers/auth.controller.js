/**
 * Controlador de Autenticación refactorizado con Sequelize y ES Modules.
 */
import bcrypt from 'bcrypt';
import { encodeId } from '../utils/hashids.js'; 
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const register = async (req, res) => {
    const { email, password, role } = req.body;

    // Validar que no falten campos
    if (!email || !password || !role) {
        return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
    }

    // --- VALIDACIÓN ESTRICTA DE SEGURIDAD ---
    
    // RegEx para validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Formato de correo electrónico inválido. No se permiten caracteres especiales no autorizados.' 
        });
    }

    // Validar longitud mínima de contraseña (seguridad básica)
    if (password.length < 8) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'La contraseña debe tener al menos 8 caracteres.' 
        });
    }
    // ------------------------------------------

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ status: 'error', message: 'El correo electrónico ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            password_hash: passwordHash,
            role
        });

        res.status(201).json({ 
            status: 'success', 
            message: 'Usuario registrado exitosamente',
            userId: encodeId(newUser.id) // <-- Enmascaramos el ID antes de enviarlo al Frontend
        });
    } catch (error) {
        console.error('[Auth Controller] Error en registro:', error);
        res.status(500).json({ status: 'error', message: 'Falla interna del servidor' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Usuario y/o Contraseña incorrectos' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ status: 'error', message: 'Usuario y/o Contraseña incorrectos' });
        }

        // --- EL CAMBIO CLAVE ---
        // Encriptamos el ID ANTES de meterlo al token
        const secureId = encodeId(user.id);

        const accessToken = jwt.sign(
            { id: secureId, role: user.role }, 
            ACCESS_TOKEN_SECRET, 
            { expiresIn: '15m' }
        );
        
        const refreshToken = jwt.sign(
            { id: secureId }, 
            REFRESH_TOKEN_SECRET, 
            { expiresIn: '1d' }
        );

        user.refresh_token = refreshToken;
        await user.save();

        res.cookie('jwt_access', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        res.cookie('jwt_refresh', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({ 
            status: 'success', 
            message: 'Autenticación exitosa',
            user: { 
                id: secureId,  
                email: user.email, 
                role: user.role 
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Falla interna del servidor' });
    }
};

export const logout = async (req, res) => {
    try {
        // Buscamos si el usuario tiene una cookie de refresh_token
        const cookies = req.cookies;
        
        if (cookies?.jwt_refresh) {
            const refreshToken = cookies.jwt_refresh;
            
            // Buscamos al usuario en la BD que tenga ese token
            const user = await User.findOne({ where: { refresh_token: refreshToken } });
            
            // Si lo encontramos, eliminamos el token de la BD (revocación)
            if (user) {
                user.refresh_token = null;
                await user.save();
            }
        }

        // Destruimos las cookies en el navegador del cliente
        res.clearCookie('jwt_access', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.clearCookie('jwt_refresh', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Enviamos la confirmación
        res.status(200).json({ 
            status: 'success', 
            message: 'Sesión cerrada correctamente' 
        });

    } catch (error) {
        console.error('[Auth Controller] Error en logout:', error);
        res.status(500).json({ status: 'error', message: 'Falla interna del servidor al cerrar sesión' });
    }
};

export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.jwt_refresh; // Asegúrate que el nombre coincida con tu login
    if (!refreshToken) return res.status(401).json({ message: 'No token' });

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        
        // Generar nuevo Access Token (15 min)
        const newAccessToken = jwt.sign(
            { id: decoded.id, role: decoded.role }, 
            ACCESS_TOKEN_SECRET, 
            { expiresIn: '15m' }
        );

        res.cookie('jwt_access', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

        return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(403).json({ message: 'Refresh fallido' });
    }
};