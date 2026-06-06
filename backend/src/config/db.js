/**
 * Configuración centralizada de la base de datos utilizando Sequelize (ORM).
 */
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE || 'vacunapp_db',
    process.env.MYSQL_USER || 'admin',
    process.env.MYSQL_PASSWORD || 'adminpassword',
    {
        host: process.env.DB_HOST || 'vacunapp-mysql',
        dialect: 'mysql',
        logging: false, // Cambiar a console.log durante depuración para ver sentencias SQL
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

export default sequelize;