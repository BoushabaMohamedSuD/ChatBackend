export { };
import { Sequelize } from 'sequelize-typescript';
import { Movie } from "./Movie";
import { MovieActor } from "./MovieActor";
import { MovieGenre } from "./MovieGenre";
import { Actor } from './Actor';
import { Genre } from './Genre';
export const sequelizetype = new Sequelize({
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
    models: [Movie, MovieActor, MovieGenre, Actor, Genre], // or [Player, Team],
});