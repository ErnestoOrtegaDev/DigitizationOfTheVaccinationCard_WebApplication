import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const HealthCenter = sequelize.define(
  "HealthCenter",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    clues: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "deleted"),
      defaultValue: "active",
    },
  },
  {
    tableName: "health_centers",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default HealthCenter;
