import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; 

const CartillaType = sequelize.define('CartillaType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  age_min_months: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  age_max_months: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'cartilla_types',
  timestamps: false 
});

export default CartillaType;