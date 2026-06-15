/**
 * Controlador de Autenticación refactorizado con Sequelize y ES Modules.
 */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const register = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
    }

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
            userId: newUser.id 
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

        // Usamos los secretos que ahora vienen del archivo .env
        const accessToken = jwt.sign(
            { id: user.id, role: user.role }, 
            ACCESS_TOKEN_SECRET, 
            { expiresIn: '15m' }
        );
        
        const refreshToken = jwt.sign(
            { id: user.id }, 
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
            user: { email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('[Auth Controller] Error en login:', error);
        res.status(500).json({ status: 'error', message: 'Falla interna del servidor' });
    }
};