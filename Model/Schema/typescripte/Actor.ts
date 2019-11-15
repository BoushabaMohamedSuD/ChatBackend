import { Model, Column, Table, BelongsToMany, Scopes, CreatedAt, UpdatedAt, HasMany } from "sequelize-typescript";
import { Movie } from "./Movie";
import { MovieActor } from "./MovieActor";
import { Genre } from "./Genre";

@Scopes(() => ({
    movies: {
        include: [
            {
                model: Movie,
                through: { attributes: [] },
            },
        ],
    },
}))
@Table
export class Actor extends Model<Actor> {

    @Column
    firstName!: string;

    @Column
    lastName!: string;

    @Column
    birthday?: Date;

    @BelongsToMany(() => Movie, () => MovieActor)
    movies?: Movie[];

    @HasMany(() => Genre)
    bs?: Genre[];

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;



}