//const Sequelize = import 
import Sequelize from 'sequelize';
import prepareModels from './model/sequelize/index.js';

const sequelize = new Sequelize(
  {
    database: 'medved',
    username: 'root',
    host: 'localhost',
    port: '3307',
    dialect: 'mysql',
    socketPath: '/var/run/mysqld/mysqld.sock'
  }
);

const models = prepareModels(Sequelize, sequelize);
export default models;
