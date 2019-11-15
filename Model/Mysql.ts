
export { };
import { Sequelize } from 'sequelize';
//const Sequelize = require('sequelize');
const db = 'ChatNodeJs'
const username = 'Chat'
const password = 'Chat'
export const sequelize = new Sequelize(db, username, password, {
    dialect: "mysql",
    host: 'localhost',
    //logging: false,
    //timestamps: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }

});


