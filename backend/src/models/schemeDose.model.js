import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import CartillaType from './cartillaType.model.js';
import Vaccine from './vaccine.model.js'; 

const SchemeDose = sequelize.define('SchemeDose', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cartilla_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CartillaType,
      key: 'id'
    }
  },
  vaccine_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Vaccine,
      key: 'id'
    }
  },
  dose_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  apply_at_months: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  interval_months: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  tableName: 'scheme_doses',
  timestamps: false
});

// --- DEFINICIÓN DE RELACIONES ---

// Una Cartilla tiene muchas Dosis
CartillaType.hasMany(SchemeDose, { foreignKey: 'cartilla_type_id', as: 'doses' });
SchemeDose.belongsTo(CartillaType, { foreignKey: 'cartilla_type_id', as: 'cartilla' });

// Una Vacuna está presente en muchas Dosis de Esquemas
Vaccine.hasMany(SchemeDose, { foreignKey: 'vaccine_id', as: 'scheme_doses' });
SchemeDose.belongsTo(Vaccine, { foreignKey: 'vaccine_id', as: 'vaccine' });

export default SchemeDose;