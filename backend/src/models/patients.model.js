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
      validate: {
        is: {
          args: [/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/],
          msg: "El formato de la CURP no es válido.",
        },
        len: {
          args: [18, 18],
          msg: "La CURP debe tener exactamente 18 caracteres.",
        },
      },
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
    timestamps: false,
  },
);

export default Patient;
