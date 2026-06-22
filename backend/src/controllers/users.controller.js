import bcrypt from 'bcrypt';
import { encodeId } from '../utils/hashids.js';
import User from '../models/user.model.js';

/**
 * @fileoverview Controlador para la administración de usuarios (CRUD).
 * Contiene la lógica empresarial para la creación, modificación y eliminación de cuentas.
 */

const userController = {};

/**
 * @route POST /api/v1/users
 * @desc Crea un nuevo usuario en el sistema. Si no se proporciona una contraseña, se asigna una por defecto.
 * @access Privado (Administrador / Personal de Salud)
 */
userController.createUserWithDefaultPassword = async (req, res) => {
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

        // Establecer contraseña por defecto si viene vacía
        const finalPassword = password || 'VacunApp2026';
        
        // Encriptación segura de la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(finalPassword, salt);

        // Guardar en la base de datos a través de Sequelize
        const newUser = await User.create({
            email,
            password_hash: passwordHash,
            role
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

/**
 * @route PUT /api/v1/users/:id
 * @desc Modifica los datos generales o actualiza la contraseña de un usuario mediante su ID.
 * @access Privado (Administrador / Propietario de la cuenta)
 */
userController.updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, role, password } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'El usuario solicitado no existe o no fue encontrado.' 
            });
        }

        // Actualización parcial de campos si vienen en la petición
        if (email) user.email = email;
        if (role) user.role = role;
        
        // Si se proporciona una nueva contraseña, se vuelve a encriptar con un nuevo Salt
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

/**
 * @route DELETE /api/v1/users/soft/:id
 * @desc Realiza un borrado lógico (Soft Delete) cambiando el estado del usuario a 'deleted'.
 * @access Privado (Administrador)
 */
userController.softDeleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'El usuario que intenta desactivar no existe.' 
            });
        }

        // Borrado lógico
        await user.softDelete(); 
        
        return res.status(200).json({ 
            status: 'success', 
            message: 'El usuario ha sido desactivado del sistema (Borrado Lógico) correctamente.' 
        });
    } catch (error) {
        console.error('[User Controller] Error en softDeleteUser:', error);
        return res.status(500).json({ 
            status: 'error', 
            message: 'Error interno en el servidor al procesar el borrado lógico.' 
        });
    }
};

/**
 * @route DELETE /api/v1/users/hard/:id
 * @desc Realiza un borrado físico definitivo eliminando el registro directamente de MySQL.
 * @access Privado (Administrador)
 */
userController.hardDeleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'El usuario que intenta eliminar permanentemente no existe.' 
            });
        }

        // Eliminar fila completa de la tabla de la base de datos
        await user.destroy(); 
        
        return res.status(200).json({ 
            status: 'success', 
            message: 'El registro del usuario ha sido borrado permanentemente de la base de datos.' 
        });
    } catch (error) {
        console.error('[User Controller] Error en hardDeleteUser:', error);
        return res.status(500).json({ 
            status: 'error', 
            message: 'Error interno en el servidor al procesar el borrado físico.' 
        });
    }
};

// Se empaquetan todas las funciones en una sola variable para exportar limpiamente
export default userController;