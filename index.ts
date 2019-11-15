import { Message } from './Model/Schema/typescripte/Main/Message';
export { };


import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import ioSocket from 'socket.io';


//import { sequelize } from './Model/Mysql'

const routerHome = require("./router/actor").router;
const routerProduct = require("./router/Product").router;
const routerLogin = require("./router/login").router;
const routerMessages = require("./router/messages").router;
const routerGenrale = require("./router/communBehaivor").router;



let exec = require("child_process").exec;
let app = express();

import { UserTable } from './Model/Schema/UserChat';
import { MessageTable } from './Model/Schema/messageRecue';
import { movies } from './router/Movie';
import { connection } from './Model/Logic/SocketIo';



//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
import { sequelize } from './Model/Schema/typescripte/Main/Mysql';
import { format } from 'url';
import { Server } from 'http';
import { type } from 'os';


//let cookieParser = express
//et sessionStore = new connect.middleware.session.MemoryStore();


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Expose-Headers", "Username,Authorization,authorization");
    //res.header("Access-Control-Expose-Headers", "");
    // res.hea
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Authorization,Username,Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser({ extended: false }));


app.use(routerLogin);
//app.use('/movies', movies);
//app.use('/actors', routerHome);
app.use('/fetch', routerGenrale)
app.use('/messages', routerMessages);
//app.use(routerProduct);


sequelize.sync(/*{ force: true }*/)
    .then(() => {
        console.log('ok');
        let server = app.listen(3000);
        let SocketIoX = require('socket.io').listen(server);
        //et sessionSockets = new SessionSockets(SocketIo, sessionStore, cookieParser);
        connection.getInstance().setServer(server);
        connection.getInstance().setSocketIo(SocketIoX);
        // connection.getInstance().clearUserOnreading();
        SocketIoX.on('connection', (socket: any) => {

            console.log('Un client est connecté !');

            //connection.getInstance().setSocket(socket);
            socket.emit('nodejs', 'Welcome to cahtNodeJs');
            //socket.join()

            socket.on('start', (res: {
                username: string,
                targetname: string,
                key: boolean
            }) => {
                socket.join(res.username);
                console.log('---------------socket from client key start---------------------------');
                console.log('client strat his navigation');
                console.log("the new socket" + res);
                let resultarray = connection.getInstance().getUserOnReading()
                console.log(resultarray);
                let lenght = connection.getInstance().getUserOnReading().length;
                let index: number = 0;
                console.log("lenght of the current socket is: " + lenght);
                console.log("cheking user on reading");
                while (index < lenght) {
                    if (connection.getInstance().getUserOnReading()[index]
                        .username == res.username) {
                        //we have to reset the socket
                        let socketInfo: {
                            socket: any,
                            username: string,
                            targetname: string,
                            key: boolean
                        } = {
                            socket: socket,
                            username: res.username,
                            targetname: res.targetname,
                            key: res.key
                        }
                        connection.getInstance().getUserOnReading()[index] = socketInfo;
                        connection.getInstance().getUserOnReading()[index].key = false;
                        console.log('changing the key');
                        console.log('---------------socket from client key start end--------------');
                        return;
                    }
                    index++;
                }
                console.log('adding the user on changing');
                let socketInfo: {
                    socket: any,
                    username: string,
                    targetname: string,
                    key: boolean
                } = {
                    socket: socket,
                    username: res.username,
                    targetname: res.targetname,
                    key: res.key
                }
                connection.getInstance().addUserOnreading(socketInfo);
                console.log("finale resultif the array is");
                console.log(connection.getInstance().getUserOnReading());
                console.log('---------------socket from client key start end------------------------------')

            });

            socket.on('ionic', (resp: any) => {
                console.log("socket from clinet key ionic");
                console.log(resp);
                //socket.emit('nodejs', 'socket from the servor');
            });

            socket.on('reading', (res: {
                username: string,
                targetname: string,
                key: boolean
            }) => {
                console.log('-------------------socket from client key reading-----------------');
                let lenght = connection.getInstance().getUserOnReading().length;
                let index: number = 0;
                console.log("cheking user on reading");
                while (index < lenght) {
                    if (connection.getInstance().getUserOnReading()[index]
                        .username == res.username) {
                        connection.getInstance().setUserOnreadingKey(index, true);
                        connection.getInstance().setUserOnreadingTargetname(index, res.targetname);
                        console.log('changing the key');
                        return;
                    }
                    index++;
                }
                console.log('adding the user on changing');
                let socketInfo: {
                    socket: any,
                    username: string,
                    targetname: string,
                    key: boolean
                } = {
                    socket: socket,
                    username: res.username,
                    targetname: res.targetname,
                    key: res.key
                }
                connection.getInstance().addUserOnreading(socketInfo);

            });

            socket.broadcast.on('sendmessage', (Info: {
                sender: string;
                message: string;
                reciever: string;
            }) => {
                console.log(':::::::::::::::::::::::: sending the message by socket:::::::::::::::::::::::');
                console.log(Info.reciever);
                socket.broadcast.to(Info.reciever).emit('recievemessage', Info);
                SocketIoX.emit('nodejs', 'for all users');
                console.log(':::::::::::::::::::::::: end sending the message by socket:::::::::::::::::::::::');
                /* if (connection.getInstance().verify(Info.sender)
                     && connection.getInstance().verify(Info.reciever)) {
                     console.log('socket has been verefiyed');
 
                     let socketIDReciever = connection.getInstance().getSocket(Info.reciever).id;
                     let socketIDSender = connection.getInstance().getSocket(Info.sender).id;
                     console.log(Info)
                     // socket.to(socketIDReciever).emit('nodejs', 'for your eyes only');
                     /* console.log('recieved socket ' + socketIDReciever);
                      console.log('sender socket ' + socketIDSender);
                      SocketIo.to(socketIDReciever).emit("nodejs", 'wtf!!!!!!!!');*/
                //SocketIo.sockets.socket(socketID).emit('nodejs', 'wtf!!!!!!!!!!!!!!!!!');

                /* } else {
                     console.log('socket is not verefiyer yet')
                 }*/
                console.log('------------end-----------------------------------------');

            });









            // console.log(socket);
        });
    })
    .catch((err) => console.log(err))
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!







// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//         console.log('connecting to server');
//         /* let db = new UserTable().getUser();
//           db.create({
//               username: 'fdfd',
//               password: 'fdds',
//               email: 'fjdklslk',
//           }).then(() => {

//           }).catch((err: any) => {
//           });*/




//         UserTable.User.hasMany(MessageTable.Messagerecue);
//         MessageTable.Messagerecue.belongsTo(UserTable.User)

//         UserTable.User.sync(/*{ force: true }*/)
//             .then((result: any) => {

//             })
//             .catch((err: any) => {
//                 console.log('---error creation table of message-----');
//             })
//         MessageTable.Messagerecue.sync(/*{ force: true }*/)
//             .then((result: any) => {
//                 /*let message = MessageTable.Messagerecue.create({
//                     message: "hellho",
//                     senderUserName: "fddjk",
//                 })
//                     .then((res: any) => {
//                         console.log(true);
//                         console.log(res.dataValues);
//                         UserTable.User.findByPk(3, { raw: true })
//                             .then((resp: any) => {
//                                 console.log(resp);
//                                 res.userId = resp.id;
//                                 //res.setuserId(resp);
//                                 res.save()
//                                     .then(() => {
//                                         console.log("ok");
//                                         MessageTable.Messagerecue.findAll({ raw: true })
//                                             .then((result: any) => {
//                                                 console.log('---select all-----');
//                                                 console.log(result);
//                                             })
//                                             .create((err: any) => {
//                                                 console.log('---error -----');
//                                                 console.log(err);
//                                             });
//                                     })
//                                     .catch(() => { });



//                             })
//                             .catch((err: any) => {
//                                 console.log(err);
//                                 console.log('eroor');
//                             })
//                     })
//                     .catch((err: any) => {
//                         console.log(false);
//                         console.log(err)
//                     })*/
//             })
//             .catch((err: any) => {
//                 console.log('---error creation table of message-----');
//                 console.log(err);
//             })


//         app.listen(3000);

//     })
//     .catch((err: any) => {
//         console.error('Unable to connect to the database:', err);
//     });







console.log('server has been created');


/*
let db = new UserTable().getUser();
console.log(db);
db.sync()
.then((result: any) => {
    console.log("------good------");
    app.listen(3000);

})
.catch((err: any) => {
    console.log("------error-------");
    console.log(err);
    console.log("------error-------");
});
*/



/*app.use((req: Request, resp: Response) => {
    resp.status(404).send("Error");
});*/



/*mongoose.connect('mongodb+srv://Mohamed:NodeJs@nodejs-hchqg.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, })
    .then((result: any) => {
        console.log("-----mongoose work-------")
        const server = app.listen(3000);
        var io = require('socket.io').listen(server);
        console.log("Server has been created");
        io.on('connection', function (socket: any) {
            console.log('Un client est connecté !');
            socket.on('ionic', (socket: any) => {
                console.log("hello socket activated");
                console.log(socket);
            })
            socket.emit("hello", "socket from the servor");


            // console.log(socket);
        });
    }).catch((err: any) => {
        console.log(err);
        console.log("--------Error-------")
        const server = app.listen(3000);
        var io = require('socket.io').listen(server);
        io.on('connection', function (socket: any) {
            console.log('Un client est connecté !');
            socket.on('ionic', (socket: any) => {
                console.log("hello socket activated");
                console.log(socket);
            })
            socket.emit("hello", "socket from the servor");


            // console.log(socket);
        });
    });*/



/*let io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    socket.emit('message', 'Vous êtes bien connecté !');
});*/


// Quand un client se connecte, on le note dans la console





