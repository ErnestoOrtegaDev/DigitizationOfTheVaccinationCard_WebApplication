/**
 * Modelo Sequelize para la entidad 'users'.
 * Mapea la estructura de la base de datos a objetos de JavaScript.
 */
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'nurse', 'citizen'),
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        defaultValue: 'active'
    }
}, {
    tableName: 'users',
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: false, 
    
    defaultScope: {
        where: {
            status: ['active', 'inactive']
        }
    }
});

User.prototype.softDelete = async function () {
    this.status = 'deleted';
    await this.save();
};

export default User;