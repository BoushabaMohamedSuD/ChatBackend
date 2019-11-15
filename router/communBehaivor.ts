export { };
import jwt from 'jsonwebtoken';
import express from 'express';
import { LoginRegistre } from '../Model/Logic/LoginRegistre'
import { UserTable } from '../Model/Schema/UserChat';
import { MessageTable } from '../Model/Schema/messageRecue';
import { connection } from '../Model/Logic/SocketIo';
import { TokenLogic } from '../Model/Logic/TokenLogic'
import { from } from 'rxjs';
import { CommonBehavior } from '../Model/Logic/CommonBehavior'
const router = express.Router();


router.get('/allUsers', (req, resp) => {
    console.log('-----------verefy token and authoritues-----------')
    new TokenLogic().verifyToken(req, resp)
        .then((token) => {
            console.log('token after verification: ' + token);
            if (token != '') {
                console.log('you are permited');
                new CommonBehavior().getAllUsers()
                    .then((result) => {
                        console.log('sending result to front end');
                        resp.json(result);
                    })
                    .catch((err) => {
                        console.log('error');
                        console.log(err);
                        resp.send(false);
                    })
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
router.get('/socket', (req, resp) => {
    console.log('set socket');
    let result = connection.getInstance().getUserOnReading()
    resp.send(result);
})
exports.router = router;