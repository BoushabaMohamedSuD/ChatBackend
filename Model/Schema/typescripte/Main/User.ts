import { Model, Column, Table, BelongsToMany, Scopes, CreatedAt, UpdatedAt, HasMany, ForeignKey, AllowNull, Unique, NotNull, Default } from "sequelize-typescript";
import { Message } from './Message'

@Scopes(() => ({
    users: {

    },
}))
@Table
export class User extends Model<User> {


    @AllowNull(false)
    @Unique
    @Column
    username!: string;

    @AllowNull(false)
    @Column
    password!: string;


    @AllowNull(false)
    @Unique
    @Column
    email!: string;

    @AllowNull(false)
    @Default(false)
    @Column
    isActive!: boolean;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;

    @HasMany(() => Message, 'senderId')
    messagesSended?: Message[];


    @HasMany(() => Message, 'recieverId')
    messagesRecieved?: Message[];





}