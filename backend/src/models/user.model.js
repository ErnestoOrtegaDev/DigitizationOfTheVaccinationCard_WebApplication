/**
 * Modelo Sequelize para la entidad 'users'.
 * Mapea la estructura de la base de datos a objetos de JavaScript.
 */
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'nurse', 'citizen'),
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default User;