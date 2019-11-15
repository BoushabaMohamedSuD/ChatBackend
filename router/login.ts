export { };
import jwt from 'jsonwebtoken';
import express from 'express';
import { LoginRegistre } from '../Model/Logic/LoginRegistre'
import { UserTable } from '../Model/Schema/UserChat';
import { MessageTable } from '../Model/Schema/messageRecue';
import { connection } from '../Model/Logic/SocketIo';
import { TokenLogic } from '../Model/Logic/TokenLogic'
import { from } from 'rxjs';
const router = express.Router();
let token: string = '';
let userLogin: {
    username: string,
    password: string
} = {
    username: "",
    password: ""
};
let userRegistre: {
    username: string, password: string,
    email: string, cfpassword: string
} = {
    username: "", password: "",
    email: "", cfpassword: ""
};
//const User = require('../Model/User').modelMongo;

router.post('/login', (req, resp) => {

    console.log("-------Main login--------")
    userLogin = req.body;
    console.log(req.body)
    console.log(userLogin);


    if (connection.getInstance().verify(userLogin.username)) {
        console.log('socket has been verifiyed');
        connection.getInstance().getSocket(userLogin.username).emit('nodejs', 'begun login');
        console.log('socket has benns send to key nodejs');
    }


    new LoginRegistre().onLogin(userLogin)
        .then((key) => {
            if (key) {
                console.log('setting socjets');
                console.log('lenght');
                console.log(connection.getInstance().getUserOnReading().length);
                console.log("secceed promise")
                console.log({ userLogin })
                jwt.sign(userLogin.username, 'keySecret', (err: any, token: any) => {
                    console.log(token);
                    resp.setHeader('Authorization', token)
                    resp.setHeader('Username', userLogin.username);
                    resp.send(true);
                    console.log('verification of the socket ')
                    if (connection.getInstance().verify(userLogin.username)) {
                        console.log("auth succeed");
                        connection.getInstance().getSocket(userLogin.username).emit('nodejs', ' auth succeed');
                    }
                    connection.getInstance().getSocketIo().emit('addUser', {
                        id: -1,
                        username: userLogin.username,
                        password: userLogin.password,
                        email: '',
                        isActive: true,
                        createdAt: '',
                        updatedAt: '',
                        identification: 'login',
                    });
                });
            }
        })
        .catch(() => {
            console.log("auth error");
            if (connection.getInstance().verify(userLogin.username)) {
                connection.getInstance().getSocket(userLogin.username).emit('nodejs', 'error authentication');
            }

            resp.send(false);
        })





});
router.post('/registre', (req, resp) => {
    console.log("----registre--------");
    console.log(req.body);
    userRegistre = req.body;
    console.log(userRegistre);
    console.log("begun registre");
    /* let db = new UserTable().getUser();
     db.create({
         username: userRegistre.username,
         password: userRegistre.password,
         email: userRegistre.email,
     }).then(() => {
 
     }).catch((err: any) => {
     });*/
    new LoginRegistre().onRegistre(userRegistre)
        .then((key: boolean) => {
            if (key) {
                console.log("succed registre");
                console.log(userRegistre);
                userLogin.username = userRegistre.username;
                userLogin.password = userRegistre.password;
                console.log(userLogin);

                new LoginRegistre().onLogin(userLogin)
                    .then((key) => {
                        if (key) {
                            console.log("secceed promise")
                            console.log({ userLogin })
                            jwt.sign(userLogin.username, 'keySecret', (err: any, token: any) => {
                                if (!err) {
                                    console.log('registre succeed');
                                    resp.setHeader('Authorization', token)
                                    resp.setHeader('Username', userLogin.username);
                                    resp.send(true);
                                    connection.getInstance().getSocketIo().emit('addUser', {
                                        id: -1,
                                        username: userLogin.username,
                                        password: userLogin.password,
                                        email: '',
                                        isActive: true,
                                        createdAt: '',
                                        updatedAt: '',
                                        identification: 'registre',
                                    });
                                } else {
                                    resp.send(false);
                                }
                            });
                        }
                    })
                    .catch(() => {
                        console.log("auth error");
                        resp.send(false);

                    })


                /*if (true) {
                    console.log({ userLogin })
                    jwt.sign({ userLogin }, 'keySecret', (err: any, token: any) => {
                        resp.json(token);
                    });
                    console.log("login succed");
                } else {
                    console.log("auth error");
                }*/

            } else {
                console.log("error registre");
                resp.send(false);

            }
        })
        .catch((err) => {
            console.log("error registre maybe");
            //console.log(err);
            resp.send(false);
        });




});

router.post('/testRelation', (req, resp) => {
    UserTable.User.findAll({
        raw: true,
        /*where: {
            id: 1,
        }*/
    }).then((user: any) => {
        console.log("maybe good");
        console.log(user);
        MessageTable.Messagerecue.create({
            message: "bobob",
            senderUserName: "dsd"
        })
            .then((res: any) => {
                console.log(true);
                user.setMessages(res)
                    .then(() => {
                        console.log('hello');
                        resp.json("goof");
                    })
                    .catch((err: any) => {
                        console.log(false);
                        console.log(err)
                        resp.json("oof");
                    })


            })
            .catch((err: any) => {
                console.log("error fetching");
                console.log(err);
                resp.send("bad creation");
            });
    }).catch((err: any) => {
        console.log("error finding");
        console.log(err);
        resp.send("bad");
    });
});

/*router.use('/', (req, resp, next) => {
    console.log('-----------verefy token and authoritues-----------')
    new TokenLogic().verifyToken(req, resp)
        .then((token) => {
            console.log('token after verification: ' + token);
            if (token != '') {
                console.log('you are permited');
                next();
            } else {
                console.log('forbidden');
                resp.send(false);
            }
        })
        .catch((err) => {
            resp.send(false);
            console.log('error verification');
        });
    console.log('WTF!!!');



});*/

router.put('/logout', (req, resp) => {
    new TokenLogic().verifyToken(req, resp)
        .then((token) => {
            console.log('token after verification: ' + token);
            if (token != '') {
                console.log('you are permited');

                console.log('-----logout-------')
                if (token != '') {
                    console.log('token:' + token);
                    jwt.verify(token, 'keySecret', (err, authdata) => {
                        if (err) {
                            console.log("----error----");
                            console.log(err);
                            resp.send(false);
                        } else {
                            console.log("-------au Coneected--------");
                            console.log(authdata);
                            new LoginRegistre().onLogout(authdata as string)
                                .then(() => {
                                    console.log('good');
                                    resp.send(true);
                                    connection.getInstance().getSocketIo().emit('addUser', {
                                        id: -1,
                                        username: authdata,
                                        password: '',
                                        email: '',
                                        isActive: true,
                                        createdAt: '',
                                        updatedAt: '',
                                        identification: 'logout',
                                    });
                                })
                                .catch(() => {
                                    console.log('noooooo');
                                    resp.send(false)
                                });
                        }
                    });


                } else {
                    resp.send(false);

                }

            } else {
                console.log('forbidden');
                resp.send(false);
            }
        })
        .catch((err) => {
            resp.send(false);
            console.log('error verification');
        });




});

router.post('/test', (req, resp) => {
    UserTable.User.findAll({
        raw: true,
        /*where: {
            id: 1,
        }*/
    }).then((user: any) => {
        console.log("maybe good");
        console.log(user);
        MessageTable.Messagerecue.create({
            message: "bobob",
            senderUserName: "dsd"
        })
            .then((res: any) => {
                console.log(true);
                user.setMessages(res)
                    .then(() => {
                        console.log('hello');
                        resp.json("goof");
                    })
                    .catch((err: any) => {
                        console.log(false);
                        console.log(err)
                        resp.json("oof");
                    })


            })
            .catch((err: any) => {
                console.log("error fetching");
                console.log(err);
                resp.send("bad creation");
            });
    }).catch((err: any) => {
        console.log("error finding");
        console.log(err);
        resp.send("bad");
    });
});



router.post('/isConnected', (req, resp) => {
    console.log('-----good-------');
    resp.send('you are connected');


});


/*router.post('/isConnected1', verifytoken, (req, resp) => {
    if (token != '') {
        console.log('token:' + token);
        jwt.verify(token, 'keySecret', (err, authdata) => {
            if (err) {
                console.log("----error----");
                console.log(err);
                resp.json("forbidden");
            } else {
                console.log("-------isConeected--------");
                console.log(typeof authdata);
                console.log(authdata)

                resp.json({
                    authdata
                });
            }
        });


    } else {
        resp.json("forbidden");

    }


});*/





function verifytoken(req: any, resp: any, next: any) {
    const headerAuthorization = req.headers['authorization'];
    console.log(headerAuthorization);
    if (typeof headerAuthorization !== 'undefined') {
        console.log('verefy token');
        const bearer = headerAuthorization.split(' ');
        const bearertoken = bearer[1];
        console.log(bearertoken);
        token = bearertoken;
        next();
    } else {
        resp.json("forbidden");
    }
}

exports.router = router;
