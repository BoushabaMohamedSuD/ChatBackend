import ioSocket from 'socket.io';
import { sequelize } from '../Mysql';
import { UserTable } from '../Schema/UserChat';
import { Observable, Observer, Subscription, Subject } from 'rxjs';
import { reject, resolve } from 'bluebird';
import { User } from '../Schema/typescripte/Main/User';
import { Message } from '../Schema/typescripte/Main/Message';
import { connection } from '../Logic/SocketIo';
import { Model } from 'sequelize/types';

export class MessageLogic {
    private user: Array<{
        id: Number,
        username: string,
        password: string,
        email: string
    }>;
    constructor() {
        this.user = new Array<{
            id: Number,
            username: string,
            password: string,
            email: string
        }>()
    }
    public onSend(
        sender: string,
        reciever: string,
        message: string
    ): Promise<boolean> {


        let MyObservale = new Observable((observer: Observer<boolean>) => {
            Message.create({ message: message })
                .then((message) => {
                    if (message != null) {
                        User.scope().findAll({ where: { username: sender } })
                            .then((sender) => {
                                console.log('succesfuly fetching the sender')
                                if (sender != [] && sender != null) {
                                    //console.log(sender[0]);
                                    sender[0].$add('messagesSended', message)
                                        .then(() => {
                                            User.scope().findAll({ where: { username: reciever } })
                                                .then((reciever) => {
                                                    console.log('succesfuly fetching the sender')
                                                    if (reciever != [] && reciever != null) {
                                                        //console.log(reciever[0]);
                                                        reciever[0].$add('messagesRecieved', message)
                                                            .then(() => {
                                                                console.log('adding messsage to reciever');
                                                                let index: number = 0;
                                                                let keySocket: boolean = false;
                                                                while (index < connection.getInstance().getUserOnReading().length) {
                                                                    keySocket = true;
                                                                    if (reciever[0].username == connection.getInstance().getUserOnReading()[index].username) {
                                                                        console.log('username of reciever has been founded in the socket');
                                                                        if (reciever[0].isActive) {
                                                                            console.log('reciever is connected');
                                                                            if (connection.getInstance().getUserOnReading()[index].targetname == sender[0].username) {
                                                                                console.log('th reciever is in the page of sender');
                                                                                if (connection.getInstance().getUserOnReading()[index].key) {
                                                                                    console.log('reciever is readin the message now');
                                                                                    message.update({
                                                                                        isConsumed: true,
                                                                                        isnotifited: true,
                                                                                    })
                                                                                        .then(() => { console.log('message has been updated') })
                                                                                        .catch((err) => { console.log('error') });
                                                                                } else {
                                                                                    console.log('maybe the reciever he is not in the sender page');
                                                                                    message.update({
                                                                                        isnotifited: true,
                                                                                    })
                                                                                        .then(() => { console.log('message has been updated') })
                                                                                        .catch((err) => { console.log('error') });
                                                                                }

                                                                            } else {
                                                                                console.log('reciever he is not in the sender page but he is connected');
                                                                                message.update({
                                                                                    isnotifited: true,
                                                                                })
                                                                                    .then(() => { console.log('message has been updated') })
                                                                                    .catch((err) => { console.log('error') });
                                                                            }
                                                                        } else {
                                                                            console.log('reciever is not active');
                                                                            break;
                                                                        }


                                                                    } else {
                                                                        console.log('reciever is not in the socket');
                                                                    }
                                                                    index++;
                                                                }
                                                                if (!keySocket) {
                                                                    console.log('the socket array is empty');
                                                                }
                                                                observer.next(true);
                                                                observer.complete();
                                                            })
                                                            .catch((err) => {
                                                                console.log('error adding message to sender')
                                                                console.log(err);
                                                                observer.error(false);
                                                            })
                                                        /* console.log('----good-----');
                                                         observer.next(true);
                                                         observer.complete();*/
                                                    } else {
                                                        console.log("result of ender is empty or null")
                                                        observer.error(false);
                                                    }


                                                })
                                                .catch((err) => {
                                                    console.log("error fetching sender");
                                                    observer.error(false)
                                                })
                                        })
                                        .catch((err) => {
                                            console.log('error adding message to sender')
                                            console.log(err);
                                            observer.error(false);
                                        })
                                    /* console.log('----good-----');
                                     observer.next(true);
                                     observer.complete();*/
                                } else {
                                    console.log("result of ender is empty or null")
                                    observer.error(false);
                                }


                            })
                            .catch((err) => {
                                console.log("error fetching sender");
                                observer.error(false)
                            })


                    }
                })
                .catch((err) => {
                    console.log('error creatin message');
                    observer.error(false);
                })



        });

        console.log('return promise');


        return new Promise((resolve, reject) => {
            let MySubscription = MyObservale.subscribe(
                (result: boolean) => {
                    console.log("observale correct sending the promise ")
                    if (result) {
                        resolve(result);
                    }

                },
                () => {
                    console.log("eroor");
                    reject(false);
                },
                () => {
                    console.log("Operation done");
                    reject(false);
                    MySubscription.unsubscribe();
                }
            );
        });




    }

    public onFetchSendedMessage(
        sender: string,
    ): Promise<Model<Message, any> | Model<Message, any>[]> {

        let MyObservale = new Observable((observer: Observer<Model<Message, any> | Model<Message, any>[]>) => {

            User.scope().findAll({ where: { username: sender } })
                .then((users) => {
                    users[0].$get('messagesSended')
                        .then((messages: Model<Message, Message> | Model<Message, Message>[]) => {
                            console.log(messages)
                            observer.next(messages);
                            observer.complete();
                            console.log('messages leght: ');
                        })
                        .catch((err) => {
                            console.log('error');
                            observer.error(null);
                        })
                })
                .catch((err) => {
                    console.log('error');
                    observer.error(null);
                })

        });

        console.log('return promise');
        return new Promise((resolve, reject) => {
            MyObservale.subscribe(
                (messages) => {
                    console.log('promise secceed');
                    resolve(messages);
                },
                () => {
                    console.log('error');
                    reject(null);
                },
                () => {
                    console.log('complet');
                }

            );
        });
    }
    public onFetchrecievedMessage(
        reciever: string,
    ): Promise<Model<Message, any> | Model<Message, any>[]> {

        let MyObservale = new Observable((observer: Observer<Model<Message, any> | Model<Message, any>[]>) => {

            User.scope().findAll({ where: { username: reciever } })
                .then((users) => {
                    users[0].$get('messagesRecieved')
                        .then((messages: Model<Message, Message> | Model<Message, Message>[]) => {
                            console.log(messages)
                            observer.next(messages);
                            observer.complete();
                            console.log('messages leght: ');
                        })
                        .catch((err) => {
                            console.log('error');
                            observer.error(null);
                        })
                })
                .catch((err) => {
                    console.log('error');
                    observer.error(null);
                })

        });

        console.log('return promise');
        return new Promise((resolve, reject) => {
            MyObservale.subscribe(
                (messages) => {
                    console.log('promise secceed');
                    resolve(messages);
                },
                () => {
                    console.log('error');
                    reject(null);
                },
                () => {
                    console.log('complet');
                }

            );
        });
    }
    public onFetchrecievedMessageFromSender(
        reciever: string,
        sender: string,
    ): Promise<Model<Message, any> | Model<Message, any>[]> {

        let MyObservale = new Observable((observer: Observer<Model<Message, any> | Model<Message, any>[]>) => {

            User.scope().findAll({ where: { username: reciever } })
                .then((recievers) => {
                    User.scope().findAll({ where: { username: sender } })
                        .then((senders) => {
                            Message.scope().findAll({
                                where: {
                                    senderId: senders[0].id,
                                    recieverId: recievers[0].id
                                }
                            })
                                .then((messages) => {
                                    console.log('messages have been fetch');
                                    observer.next(messages);
                                    observer.complete();
                                })
                                .catch((err) => {
                                    console.log('errorr');
                                    observer.error(null);
                                })
                        })
                        .catch((err) => {
                            console.log('error');
                            observer.error(null);
                        })
                })
                .catch((err) => {
                    console.log('error');
                    observer.error(null);
                })

        });

        console.log('return promise');
        return new Promise((resolve, reject) => {
            MyObservale.subscribe(
                (messages) => {
                    console.log('promise secceed');
                    resolve(messages);
                },
                () => {
                    console.log('error');
                    reject(null);
                },
                () => {
                    console.log('complet');
                }

            );
        });
    }


}