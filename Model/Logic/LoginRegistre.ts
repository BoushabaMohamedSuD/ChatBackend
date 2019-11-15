import ioSocket from 'socket.io';
import { sequelize } from '../Mysql';
import { UserTable } from '../Schema/UserChat';
import { Observable, Observer, Subscription, Subject } from 'rxjs';
import { reject } from 'bluebird';
import { User } from '../Schema/typescripte/Main/User';

export class LoginRegistre {
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
    public onLogin(userLogin: {
        username: string,
        password: string
    }): Promise<boolean> {


        let MyObservale = new Observable((observer: Observer<Array<{
            id: Number,
            username: string,
            password: string,
            email: string
        }>>) => {

            User.scope().findAll()
                .then((result) => {
                    console.log('succesfuly fetching')
                    if (result != [] && result != null) {
                        //console.log(result);
                        console.log('----good-----');
                        let index: number = 0;

                        console.log(result.length);
                        while (index < result.length) {
                            let elment: {
                                id: number,
                                username: string,
                                password: string,
                                email: string
                            } = {
                                id: result[index].id,
                                username: result[index].username,
                                password: result[index].password,
                                email: result[index].email
                            }

                            this.user.push(elment);
                            index++;
                        }
                        /* elment.id = 10;
                         elment.username = "kjdl";
                         elment.password = "dsf";
                         elment.email = "jjkfdklk";
                         this.user.push(elment)
                         elment.id = 15;
                         elment.username = "kl";
                         elment.password = "dsf";
                         elment.email = "jklk";
                         this.user.push(elment)*/
                        console.log('the finale result');
                        console.log(this.user);
                        observer.next(this.user);
                        observer.complete();
                    } else {
                        console.log("result is empty or null")
                        observer.error(null);
                    }


                })
                .catch((err) => {
                    console.log("error fetching");
                    observer.error(null)
                })


            /*UserTable.User.findAll({ raw: true })
                .then((user: [{
                    id: number,
                    username: string,
                    password: string,
                    email: string
                }]) => {
                    console.log(user);
                    console.log('----good-----');
                    observer.next(user);
                    observer.complete();

                })
                .catch((err: any) => {
                    console.log('-----error-----');
                    observer.error(null);
                });*/
        });

        console.log('return promise');
        return new Promise((resolve, reject) => {
            let MySubscription = MyObservale.subscribe(
                (user: Array<{
                    id: Number,
                    username: string,
                    password: string,
                    email: string
                }>) => {
                    console.log("begun operation ")
                    let key: boolean = false
                    if (user != null) {
                        let index: number = 0;
                        while (index < user.length) {
                            if (user[index].username == userLogin.username) {
                                if (user[index].password == userLogin.password) {
                                    User.update({ isActive: true }, { where: { id: user[index].id as number } })
                                    resolve(true);
                                    return;
                                } else {
                                    reject(false);
                                    return;
                                }
                            }
                            index++;
                        }
                        console.log('data base is empty');
                        reject(false);
                    } else {
                        console.log("error in fetching!!!");
                    }
                    resolve(key);
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
    public onRegistre(userRegistre: {
        username: string, password: string,
        email: string, cfpassword: string
    }): Promise<boolean> {
        var subject = new Subject<boolean>();
        let db = UserTable.User;
        console.log(typeof db);
        let key: boolean = true
        console.log('create an observabke');
        let MyObservale = new Observable((observer: Observer<boolean>) => {

            if (userRegistre.password == userRegistre.cfpassword) {
                console.log("password has been consirmed");
                User.create({
                    username: userRegistre.username,
                    password: userRegistre.password,
                    email: userRegistre.email,

                })
                    .then((result) => {
                        console.log('--------begun creation---------');
                        // console.log(result);
                        console.log('--------end creation---------');
                        key = true;
                        console.log("creating database Succesfly");
                        observer.next(key);
                        observer.complete();
                    })
                    .catch((onReject) => {
                        console.log(onReject);
                        console.log("error");
                        key = false;
                        observer.error(key);
                    })

            } else {
                console.log('user should confirme his password');
                observer.error(false);
            }



            /*db.create({
                username: userRegistre.username,
                password: userRegistre.password,
                email: userRegistre.email,
            }).then(() => {
                key = true;
                console.log("creating database Succesfly");
                observer.next(key);
                observer.complete();
            }).catch((err: any) => {
                console.log(err);
                console.log("error");
                key = false;
                observer.error(key);
            });*/
        });

        console.log('return promise');
        return new Promise((resolve, reject) => {
            let MySubscription = MyObservale.subscribe(
                (key: boolean) => {
                    resolve(key);
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



        //key it's always true;


    }
    public onLogout(username: string): Promise<boolean> {
        let MyObservale = new Observable((observer: Observer<Array<{
            id: Number,
            username: string,
            password: string,
            email: string
        }>>) => {

            User.scope().findAll()
                .then((result) => {
                    console.log('succesfuly fetching')
                    if (result != [] && result != null) {
                        console.log('----good-----');
                        let index: number = 0;
                        console.log(result.length);
                        while (index < result.length) {
                            let elment: {
                                id: number,
                                username: string,
                                password: string,
                                email: string
                            } = {
                                id: result[index].id,
                                username: result[index].username,
                                password: result[index].password,
                                email: result[index].email
                            }
                            this.user.push(elment);
                            index++;
                        }
                        console.log(this.user);
                        observer.next(this.user);
                        observer.complete();
                    } else {
                        console.log("result is empty or null")
                        observer.error(null);
                    }


                })
                .catch((err) => {
                    console.log("error fetching");
                    observer.error(null)
                })


            /*UserTable.User.findAll({ raw: true })
                .then((user: [{
                    id: number,
                    username: string,
                    password: string,
                    email: string
                }]) => {
                    console.log(user);
                    console.log('----good-----');
                    observer.next(user);
                    observer.complete();

                })
                .catch((err: any) => {
                    console.log('-----error-----');
                    observer.error(null);
                });*/
        });

        console.log('return promise');
        return new Promise((resolve, reject) => {
            let MySubscription = MyObservale.subscribe(
                (user: Array<{
                    id: Number,
                    username: string,
                    password: string,
                    email: string
                }>) => {
                    console.log("begun operation ");
                    let key: boolean = false
                    if (user != null) {
                        let index: number = 0;
                        console.log(user.length);
                        console.log(username)
                        while (index < user.length) {
                            if (user[index].username == username) {
                                User.update({ isActive: false }, { where: { id: user[index].id as number } })
                                resolve(true);
                                console.log("end operation");
                                return;
                            }
                            index++;
                        }
                        console.log('user not found');
                        reject(false);
                    } else {
                        console.log("error in fetching!!!");
                    }
                    resolve(key);
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
}