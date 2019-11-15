
import * as Sequelize1 from 'sequelize'
import { Sequelize } from 'sequelize';
import { sequelize } from '../Mysql'
import { constructor } from 'validator';
import { from } from 'rxjs';
import { Model, DataType } from 'sequelize';




export class UserTable {
    public static User: any = sequelize.define('user', {
        id: {
            type: Sequelize1.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        username: {
            type: Sequelize1.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: Sequelize1.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize1.STRING,
            allowNull: false,
        },
    }, { timestamps: false });


    constructor() {
        //console.log(typeof UserTable.User);
        // this.User=null
    }

}
