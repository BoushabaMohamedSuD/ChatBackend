import { resolve, reject } from 'bluebird';
import jwt from 'jsonwebtoken';
export class TokenLogic {
    constructor() {

    }
    public verifyToken(req: any, resp: any): Promise<string> {
        console.log("getting the promisse from verefytoken");
        return new Promise((resolve, reject) => {
            const headerAuthorization = req.header('authorization');
            console.log(headerAuthorization);
            if (typeof headerAuthorization !== 'undefined') {
                let token: string = '';
                console.log('verefy token');
                const bearer = headerAuthorization.split(' ');
                const bearertoken = bearer[1];
                console.log(bearertoken);
                token = bearertoken;
                if (token != '') {
                    console.log('token:' + token);
                    let tokenvr: string = token;
                    jwt.verify(tokenvr, 'keySecret', (err, authdata) => {
                        if (err) {
                            console.log("----error----");
                            console.log(err);
                            reject('');
                        } else {
                            console.log("-------isConeected--------");
                            console.log('authdata' + authdata)
                            console.log('exporttoken to router ' + token);
                            resolve(token);

                        }
                    });


                } else {
                    reject('');

                }


            }

        });

    }
}