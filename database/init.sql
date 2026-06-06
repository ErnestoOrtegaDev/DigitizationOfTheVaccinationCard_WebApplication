CREATE DATABASE IF NOT EXISTS vacunapp_db;
USE vacunapp_db;

-- 1. Gestión de Accesos
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'nurse', 'citizen') NOT NULL,
  refresh_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Perfiles Familiares (Pacientes)
CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  curp VARCHAR(18) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  gender ENUM('M', 'F', 'O') NOT NULL, -- Importante para cartillas de mujeres embarazadas
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Tipos de Cartillas (Plantillas Generales)
-- Ej: "Niñas y Niños de 0 a 9 años", "Adolescentes 10 a 19 años"
CREATE TABLE cartilla_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age_min_months INT NOT NULL,
  age_max_months INT NOT NULL
);

-- 4. Catálogo Maestro de Vacunas
CREATE TABLE vaccines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  disease_prevented VARCHAR(255) NOT NULL,
  administration_method VARCHAR(100) NOT NULL
);

-- 5. Esquema de Dosis (Relación N:M entre Cartillas y Vacunas con reglas)
CREATE TABLE scheme_doses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cartilla_type_id INT NOT NULL,
  vaccine_id INT NOT NULL,
  dose_name VARCHAR(50) NOT NULL, -- Ej: 'Primera', 'Refuerzo'
  apply_at_months INT NOT NULL,   -- Cuándo se debe aplicar (0 = nacer, 2 = 2 meses)
  interval_months INT DEFAULT 0,  -- Para vacunas recurrentes (ej. cada 12 meses para Influenza)
  FOREIGN KEY (cartilla_type_id) REFERENCES cartilla_types(id) ON DELETE CASCADE,
  FOREIGN KEY (vaccine_id) REFERENCES vaccines(id) ON DELETE CASCADE
);

-- 6. Campañas de Vacunación (Gestión del Administrador)
CREATE TABLE campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- 7. Lotes por Campaña (Control estricto de inventario y aplicación)
CREATE TABLE campaign_batches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  vaccine_id INT NOT NULL,
  batch_number VARCHAR(100) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (vaccine_id) REFERENCES vaccines(id) ON DELETE CASCADE
);

-- 8. Registros de Vacunación (La Cartilla Viva del Paciente) - CORREGIDA
CREATE TABLE vaccination_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  vaccine_id INT NOT NULL, -- Obligatorio saber qué vacuna es.
  scheme_dose_id INT,      -- NULO si es "Otra Vacuna" fuera de la plantilla oficial.
  campaign_batch_id INT,   -- NULO si fue registro manual o histórico.
  
  status ENUM('pending', 'applied') DEFAULT 'pending',
  application_date DATE,
  
  -- Auditoría y Veracidad
  is_manual_entry BOOLEAN DEFAULT FALSE, -- TRUE si lo registró el padre en su casa (FR05).
  applied_by_user_id INT,                -- Firma del enfermero (NULO si is_manual_entry es TRUE).
  
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (vaccine_id) REFERENCES vaccines(id),
  FOREIGN KEY (scheme_dose_id) REFERENCES scheme_doses(id),
  FOREIGN KEY (campaign_batch_id) REFERENCES campaign_batches(id),
  FOREIGN KEY (applied_by_user_id) REFERENCES users(id)
);