/**
 * Controlador de Autenticación refactorizado con Sequelize y ES Modules.
 */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { encodeId } from '../utils/hashids.js'; 

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
            userId: encodeId(newUser.id) // <-- 2. Enmascaramos el ID antes de enviarlo al Frontend
        });
    } catch (error) {
        console.error('[Auth Controller] Error en registro:', error);
        res.status(500).json({ status: 'error', message: 'Falla interna del servidor' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Al usar findOne, Sequelize automáticamente ignorará los usuarios con status 'deleted' 
        // gracias al defaultScope que configuramos en el modelo.
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Usuario y/o Contraseña incorrectos' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ status: 'error', message: 'Usuario y/o Contraseña incorrectos' });
        }

        // Nota: Dentro del JWT mantenemos el user.id original (entero). 
        // Esto es seguro porque el JWT está firmado y nos permite hacer consultas rápidas 
        // en nuestros middlewares sin tener que decodificar el Hashid cada vez.
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
            user: { 
                id: encodeId(user.id),  
                email: user.email, 
                role: user.role 
            }
        });
    } catch (error) {
        console.error('[Auth Controller] Error en login:', error);
        res.status(500).json({ status: 'error', message: 'Falla interna del servidor' });
    }
};