import ioSocket from 'socket.io';
import { sequelize } from '../Mysql';
import { UserTable } from '../Schema/UserChat';
import { Observable, Observer, Subscription, Subject, observable } from 'rxjs';
import { reject, resolve } from 'bluebird';
import { User } from '../Schema/typescripte/Main/User';
import { Message } from '../Schema/typescripte/Main/Message';
import { connection } from '../Logic/SocketIo';
import { Model } from 'sequelize/types';
export class CommonBehavior {
    constructor() {

    }

    public getAllUsers(): Promise<any> {
        let MyObservale = new Observable((observer: Observer<any>) => {
            //you can specifique your coulmns by this lien below
            User.scope().findAll(/*{ attributes: ['username', 'password'] }*/)
                .then((result) => {
                    console.log('fetcing suuceed');
                    if (result != null) {
                        console.log('sending result to the promise ');
                        observer.next(result);
                        observer.complete();
                    } else {
                        console.log('result is null');
                        observer.next(result);
                        observer.complete();
                    }
                })
                .catch((err) => {
                    console.log('error');
                    observer.error(null);
                })

        });
        return new Promise((resolve, reject) => {
            MyObservale.subscribe(
                (result) => {
                    console.log('result promise good');
                    resolve(result);
                },
                (err) => {
                    console.log('error');
                    console.log(err);
                    reject(null);
                },
                () => {
                    console.log('operation done');
                }
            );
        })
    }
}