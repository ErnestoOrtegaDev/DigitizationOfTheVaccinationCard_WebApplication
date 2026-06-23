import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Ajusta la ruta a tu archivo de conexión

const Vaccine = sequelize.define('Vaccine', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    disease_prevented: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    administration_method: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    tableName: 'vaccines',
    timestamps: false
});

export default Vaccine;