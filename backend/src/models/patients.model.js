import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Patient = sequelize.define(
  "Patient",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    curp: {
      type: DataTypes.STRING(18),
      allowNull: false,
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("M", "F", "O"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "deleted"),
      defaultValue: "active",
    },
  },
  {
    tableName: "patients",
    timestamps: false, // Si tu tabla no tiene updated_at, ponle false
    createdAt: "false",
    updatedAt: false, // Desactivado si en init.sql no mapeaste un updatedAt
  },
);

export default Patient;
