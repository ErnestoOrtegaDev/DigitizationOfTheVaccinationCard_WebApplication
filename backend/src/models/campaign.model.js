import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Campaign = sequelize.define('Campaign', {
  name: { type: DataTypes.STRING, allowNull: false },
  healthCenter: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  dynamic: { type: DataTypes.STRING },
  diseaseOutbreak: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  locality: { type: DataTypes.STRING },
  vaccineId: { type: DataTypes.INTEGER }
});

export default Campaign;