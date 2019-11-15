export { };
import { Sequelize } from 'sequelize-typescript';
import { Message } from './Message';
import { User } from './User';
import { Actor } from '../Actor';
import { Movie } from '../Movie';
export const sequelize = new Sequelize({
    database: 'ChatNodeJs',
    // dialect: 'sqlite',
    username: 'Chat',
    password: 'Chat',
    //storage: ':memory:',
    dialect: "mysql",
    host: 'localhost',
    //logging: false,
    //timestamps: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    models: [User, Message], // or [Player, Team],
});