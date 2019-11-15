const Sequelize = require('sequelize');
import { sequelize } from './Mysql'
import { model } from 'mongoose';
const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING
});
module.exports = User
