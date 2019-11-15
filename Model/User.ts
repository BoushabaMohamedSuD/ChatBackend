export { };


let userLogin: { username: string, password: string };
let userRegistre: {
    username: string, password: string,
    email: string, cfpassword: string
};



/*const Sequelize = require('sequelize');
const sequelize = require('./Mysql');
const user = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,

    },
});*/






/*import mongoose from 'mongoose';
import { ObjectID, ObjectId } from 'bson';
const schema = mongoose.Schema;
const userSchema = new schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
});
let modelMongo = mongoose.model("User", userSchema);
module.exports.modelMongo = modelMongo;*/