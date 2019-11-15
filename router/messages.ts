export { };
import jwt from 'jsonwebtoken';
import express from 'express';
import { LoginRegistre } from '../Model/Logic/LoginRegistre'
import { UserTable } from '../Model/Schema/UserChat';
import { MessageTable } from '../Model/Schema/messageRecue';
import { connection } from '../Model/Logic/SocketIo'
import { from } from 'rxjs';
import { TokenLogic } from '../Model/Logic/TokenLogic';
import { MessageLogic } from '../Model/Logic/MessagesLogic'

const router = express.Router();
let token: string = '';



const User = require('../Model/User').modelMongo;

router.get('/test', (req, resp) => {
    console.log(':::::::::::::test:::::::::::::::::::');
    console.log('authorization: ' + req.header('authorization'));
    console.log('Username: ' + req.header('Username'));
    resp.json('ok');

})

router.post('/send/:username', (req, res) => {
    console.log('-----------verefy token and authoritues-----------')
    new TokenLogic().verifyToken(req, res)
        .then((token) => {
            console.log('token after verification: ' + token);
            if (token != '') {
                console.log('you are permited');
                console.log('fetch all the mesage from ' + req.params['username']);
                let sender: string = req.header('Username') as string;
                let reciever: string = req.params['username'];
                let message: string = req.body.message;
                console.log({
                    reciever: reciever,
                    sender: sender,
                    message: message
                })
                new MessageLogic().onSend(sender, reciever, message)
                    .then((result) => {
                        if (result) {
                            console.log('message has been sended');
                            res.send(true);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        res.send(false);
                    })

            } else {
                console.log('forbidden');
                res.send(false);
            }
        })
        .catch((err) => {
            res.send(false);
            console.log('error verification');
        });


});

router.get('/getsendedmessages/', (req, res) => {
    console.log('-----------verefy token and authoritues for sended messages-----------')
    new TokenLogic().verifyToken(req, res)
        .then((token) => {
            console.log('token after verification: ' + token);
            if (token != '') {
                console.log('you are permited');
                console.log('fetch all the mesage from ' + req.params['username']);
                let sender: string = req.header('Username') as string;
                console.log({
                    sender: sender,
                })
                new MessageLogic().onFetchSendedMessage(sender)
                    .then((result) => {
                        if (result) {
                            console.log('message has been sended');
                            // res.writeHead(200, { "Content-Type": "application/json" });
                            res.json(result);
                            console.log('ok');
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        res.send('not ok');
                    })

            } else {
                console.log('forbidden');
                res.send(false);
            }
        })
        .catch((err) => {
            res.send(false);
            console.log('error verification');
        });



});


router.get('/getrecievedmessages/', (req, res) => {
    console.log('-----------verefy token and authoritues-----------')
    new TokenLogic().verifyToken(req, res)
        .then((token) => {
            console.log('token after verification: ' + token);
            if (token != '') {
                console.log('you are permited');
                console.log('fetch all the mesage from ' + req.params['username']);
                let reciever: string = req.header('Username') as string;
                console.log({
                    sender: reciever,
                })
                new MessageLogic().onFetchrecievedMessage(reciever)
                    .then((result) => {
                        if (result) {
                            console.log('message has been sended');
                            // res.writeHead(200, { "Content-Type": "application/json" });
                            res.json(result);
                            console.log('ok');
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        res.send('not ok');
                    })

            } else {
                console.log('forbidden');
                res.send(false);
            }
        })
        .catch((err) => {
            res.send(false);
            console.log('error verification');
        });



});
router.get('/getrecievedmessages/:sendername', (req, res) => {
    console.log('-----------verefy token and authoritues-----------')
    new TokenLogic().verifyToken(req, res)
        .then((token) => {
            console.log('token after verification: ' + token);
            if (token != '') {
                console.log('you are permited');
                console.log('fetch all the mesage from ' + req.params['sendername']);
                let reciever: string = req.header('Username') as string;
                let sender: string = req.params['sendername'] as string;
                console.log({
                    sender: reciever,
                })
                new MessageLogic().onFetchrecievedMessageFromSender(reciever, sender)
                    .then((result) => {
                        if (result) {
                            console.log('message has been sended');
                            // res.writeHead(200, { "Content-Type": "application/json" });
                            res.json(result);
                            console.log('ok');
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        res.send('not ok');
                    })

            } else {
                console.log('forbidden');
                res.send(false);
            }
        })
        .catch((err) => {
            res.send(false);
            console.log('error verification');
        });



});

router.get('/getsendedmessages/:recievername', (req, res) => {
    console.log('-----------verefy token and authoritues-----------')
    new TokenLogic().verifyToken(req, res)
        .then((token) => {
            console.log('token after verification: ' + token);
            if (token != '') {
                console.log('you are permited');
                console.log('fetch all the mesage from ' + req.params['recievername']);
                let sender: string = req.header('Username') as string;
                let reciever: string = req.params['recievername'] as string;
                console.log({
                    sender: reciever,
                })
                new MessageLogic().onFetchrecievedMessageFromSender(reciever, sender)
                    .then((result) => {
                        if (result) {
                            console.log('message has been sended');
                            // res.writeHead(200, { "Content-Type": "application/json" });
                            res.json(result);
                            console.log('ok');
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        res.send('not ok');
                    })
            } else {
                console.log('forbidden');
                res.send(false);
            }
        })
        .catch((err) => {
            res.send(false);
            console.log('error verification');
        });



});

/*
router.post('/getrecievedmessages/:username', (req, res, next) => {
    console.log('fetch all the mesage from ' + req.params['username']);
    let sender: string = req.header('Username') as string;
    let reciever: string = req.params['username'];
    let message: string = req.body.message;
    console.log({
        reciever: reciever,
        sender: sender,
        message: message
    })
    new MessageLogic().onSend(sender, reciever, message)
        .then((result) => {
            if (result) {
                console.log('message has been sended');
                res.send('ok');
            }
        })
        .catch((err) => {
            console.log(err);
            res.send('not ok');
        })


});*/



exports.router = router;
