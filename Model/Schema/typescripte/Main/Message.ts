import { Model, Column, Table, BelongsToMany, Scopes, CreatedAt, UpdatedAt, HasMany, BelongsTo, ForeignKey, AllowNull, NotNull, Default } from "sequelize-typescript";
import { User } from './User'

@Scopes(() => ({
    messages: {

    },
}))
@Table
export class Message extends Model<Message> {





    /* @AllowNull(false)
     @Column
     sendername!: string;*/


    @AllowNull(false)
    @Column
    message!: string;

    @AllowNull(false)
    @Default(false)
    @Column
    isConsumed!: boolean;

    @AllowNull(false)
    @Default(false)
    @Column
    isnotifited!: boolean;

    @CreatedAt
    @Column
    createdAt!: Date;

    @UpdatedAt
    @Column
    updatedAt!: Date;

    @ForeignKey(() => User)
    senderId!: number;

    @BelongsTo(() => User, 'senderId')
    sender!: User;

    @ForeignKey(() => User)
    recieverId!: number;

    @BelongsTo(() => User, 'recieverId')
    reciever?: User;



}