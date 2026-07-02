import { Sequelize } from 'sequelize';

// Escribe tus credenciales directamente aquí para no depender del .env
const sequelize = new Sequelize(
  'vacunapp_db',      // Nombre de la base de datos
  'root',             // Tu usuario (suele ser 'root')
  'adminpassword',    // Escribe aquí tu contraseña real de MySQL
  {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    logging: false,
  }
);

const fixEncoding = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida.');

    // Corregir Vacunas
    await sequelize.query(`UPDATE vaccines SET name = 'Neumocócica', disease_prevented = 'Neumonía por neumococo' WHERE id = 13`);
    await sequelize.query(`UPDATE vaccines SET disease_prevented = 'Tétanos y Difteria' WHERE id = 9`);
    await sequelize.query(`UPDATE vaccines SET disease_prevented = 'Sarampión y Rubéola' WHERE id = 10`);
    await sequelize.query(`UPDATE vaccines SET disease_prevented = 'Tétanos' WHERE id = 1`);

    // Corregir Dosis
    await sequelize.query(`UPDATE scheme_doses SET dose_name = 'Única' WHERE dose_name LIKE '%nica%'`);
    await sequelize.query(`UPDATE scheme_doses SET dose_name = REPLACE(dose_name, 'aos', 'años') WHERE dose_name LIKE '%aos%'`);

    console.log('¡Corrección completada exitosamente!');
  } catch (error) {
    console.error('Error durante la corrección:', error);
  } finally {
    await sequelize.close();
  }
};

fixEncoding();