import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; 

import Patient from './patients.model.js'; 
import Vaccine from './vaccine.model.js';
import SchemeDose from './schemeDose.model.js';
import HealthCenter from './healthCenter.model.js';
import User from './user.model.js'; 

const VaccinationRecord = sequelize.define('VaccinationRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Patient,
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
  scheme_dose_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: SchemeDose,
      key: 'id'
    }
  },
  campaign_batch_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // references: { model: CampaignBatch, key: 'id' } // Lo mantenemos comentado hasta que el equipo cree campaignBatch.model.js
  },
  health_center_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: HealthCenter, // ¡Relación activada!
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'applied', 'cancelled'),
    defaultValue: 'pending',
  },
  application_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  is_manual_entry: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  applied_by_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User, // ¡Relación activada!
      key: 'id'
    }
  }
}, {
  tableName: 'vaccination_records',
  timestamps: false
});

// --- DEFINICIÓN DE RELACIONES ---

// Relación con el Paciente
Patient.hasMany(VaccinationRecord, { foreignKey: 'patient_id', as: 'vaccination_records' });
VaccinationRecord.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });

// Relación con la Vacuna
Vaccine.hasMany(VaccinationRecord, { foreignKey: 'vaccine_id', as: 'records' });
VaccinationRecord.belongsTo(Vaccine, { foreignKey: 'vaccine_id', as: 'vaccine' });

// Relación con la Dosis del Esquema
SchemeDose.hasMany(VaccinationRecord, { foreignKey: 'scheme_dose_id', as: 'records' });
VaccinationRecord.belongsTo(SchemeDose, { foreignKey: 'scheme_dose_id', as: 'scheme_dose' });

// Relación con el Centro de Salud
HealthCenter.hasMany(VaccinationRecord, { foreignKey: 'health_center_id', as: 'vaccination_records' });
VaccinationRecord.belongsTo(HealthCenter, { foreignKey: 'health_center_id', as: 'health_center' });

// Relación con el Usuario que aplicó la vacuna
User.hasMany(VaccinationRecord, { foreignKey: 'applied_by_user_id', as: 'applied_vaccines' });
VaccinationRecord.belongsTo(User, { foreignKey: 'applied_by_user_id', as: 'applied_by' });

export default VaccinationRecord;