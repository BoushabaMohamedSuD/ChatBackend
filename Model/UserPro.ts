
import * as Sequelize from 'sequelize'
import { sequelize } from './Mysql'


export class UserTable {
    private User = sequelize.define('userChat', {
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
    constructor() {

    }
    public getUser() {
        return this.User;

    }
}
