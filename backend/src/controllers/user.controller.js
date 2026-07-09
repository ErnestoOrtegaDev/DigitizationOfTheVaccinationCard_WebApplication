import bcrypt from 'bcrypt';
import { encodeId, decodeId } from '../utils/hashids.js';
import User from '../models/user.model.js';

/**
 * Controlador para la administración de usuarios (CRUD).
 * Contiene la lógica empresarial para la creación, modificación y eliminación de cuentas.
 */

export const createUserWithDefaultPassword = async (req, res) => {
    const { email, role, password } = req.body;

    // Validación de campos requeridos
    if (!email || !role) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Los campos correo electrónico (email) y rol (role) son obligatorios.' 
        });
    }

    try {
        // Verificar duplicidad de correos
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ 
                status: 'error', 
                message: 'El correo electrónico ya se encuentra registrado en el sistema.' 
            });
        }

        const normalizedRole = (role || 'citizen').toLowerCase();
        const roleAliases = { patient: 'citizen' };
        const finalRole = roleAliases[normalizedRole] || (['admin', 'nurse', 'citizen'].includes(normalizedRole) ? normalizedRole : 'citizen');

        // Establecer contraseña por defecto si viene vacía
        const finalPassword = password || 'VacunApp2026';
        
        // Encriptación segura de la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(finalPassword, salt);

        // Guardar en la base de datos a través de Sequelize
        const newUser = await User.create({
            email,
            password_hash: passwordHash,
            role: finalRole
        });

        return res.status(201).json({ 
            status: 'success', 
            message: 'Usuario creado exitosamente.',
            defaultPassword: password ? 'Configurada por usuario' : finalPassword,
            userId: encodeId(newUser.id) // Enmascaramiento de ID por seguridad
        });
    } catch (error) {
        console.error('[User Controller] Error en createUserWithDefaultPassword:', error);
        return res.status(500).json({ 
            status: 'error', 
            message: 'Ocurrió un error interno en el servidor al intentar registrar el usuario.' 
        });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, role, password } = req.body;

    try {
        // Decodificamos el ID que viene en la URL
        const decodedId = decodeId(id);
        
        // Si el ID no se pudo decodificar (formato inválido), rebotamos la petición
        if (!decodedId) {
            return res.status(400).json({
                status: 'error',
                message: 'El identificador de usuario proporcionado no es válido'
            });
        }

        // Buscamos usando el ID real numérico
        const user = await User.findByPk(decodedId);
        if (!user) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Usuario no disponible' 
            });
        }

        // Actualización parcial
        if (email) user.email = email;
        if (role) {
            const normalizedRole = role.toLowerCase();
            const roleAliases = { patient: 'citizen' };
            user.role = roleAliases[normalizedRole] || (['admin', 'nurse', 'citizen'].includes(normalizedRole) ? normalizedRole : 'citizen');
        }
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password_hash = await bcrypt.hash(password, salt);
        }

        await user.save();
        
        return res.status(200).json({ 
            status: 'success', 
            message: 'Los datos del usuario se modificaron correctamente.' 
        });
    } catch (error) {
        console.error('[User Controller] Error en updateUser:', error);
        return res.status(500).json({ 
            status: 'error', 
            message: 'Falla interna en el servidor al intentar actualizar los datos.' 
        });
    }
};

export const softDeleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Decodificamos el ID
        const decodedId = decodeId(id);
        
        if (!decodedId) {
            return res.status(400).json({
                status: 'error',
                message: ' Usuario no disponible'
            });
        }

        // Buscamos con el número real
        const user = await User.findByPk(decodedId);
        if (!user) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Usuario no disponible' 
            });
        }

        // Borrado lógico
        await user.softDelete(); 
        
        return res.status(200).json({ 
            status: 'success', 
            message: 'El usuario ha sido borrado correctamente' 
        });
    } catch (error) {
        console.error('[User Controller] Error en softDeleteUser:', error);
        return res.status(500).json({ 
            status: 'error', 
            message: 'Error interno en el servidor al procesar el borrado lógico.' 
        });
    }
};
export const getActiveUsers = async (req, res) => {
    try {
        // Consultar los usuarios con estatus activo
        const activeUsers = await User.findAll({
            where: { status: 'active' }
        });

        // Si la lista está vacía, responder con mensaje
        if (!activeUsers || activeUsers.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no disponible'
            });
        }

        // Enmascarar los IDs antes de enviarlos
        const formattedUsers = activeUsers.map(user => ({
            id: encodeId(user.id),
            email: user.email,
            role: user.role,
            status: user.status
        }));

        return res.status(200).json({
            status: 'success',
            data: formattedUsers
        });
    } catch (error) {
        console.error('[User Controller] Error en getActiveUsers:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Ocurrió un error al consultar los usuarios'
        });
    }
};

export default {
    createUserWithDefaultPassword,
    updateUser,
    softDeleteUser,
    getActiveUsers
};