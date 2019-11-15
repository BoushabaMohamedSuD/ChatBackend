
export class connection {
    private static Instance: connection;
    private server: any;
    private SocketIo: any;
    // private socket: any;

    private UserOnReading: Array<{
        socket: any,
        username: string,
        targetname: string,
        key: boolean
    }>;
    private constructor() {
        console.log("create the singleton connection");
        this.UserOnReading = new Array<{
            socket: any,
            username: string,
            targetname: string,
            key: boolean
        }>();
    }
    public getServer() {
        console.log('get server');
        return this.server;
    }
    public getSocketIo() {
        console.log('get SocketIo');
        return this.SocketIo;
    }
    public getSocket(username: string) {
        console.log('get socket ')
        let index: number = 0;
        while (index < this.UserOnReading.length) {
            if (this.UserOnReading[index].username == username) {
                return this.UserOnReading[index].socket;
            }
            index++;
        }
        return null;
        //return this.socket;
    }
    public getUserOnReading(): Array<{
        username: string,
        targetname: string,
        key: boolean
    }> {
        let result: Array<{
            username: string,
            targetname: string,
            key: boolean
        }> = new Array<{
            username: string,
            targetname: string,
            key: boolean
        }>();
        let index: number = 0;
        while (index < this.UserOnReading.length) {
            let element: {
                username: string,
                targetname: string,
                key: boolean
            } = {
                username: this.UserOnReading[index].username,
                targetname: this.UserOnReading[index].targetname,
                key: this.UserOnReading[index].key
            }
            result.push(element);
            index++;
        }
        return result;
    }
    public setServer(server: any) {
        console.log('set server');
        this.server = server
    }
    public setSocketIo(SocketIo: any) {
        console.log('set socketio');
        this.SocketIo = SocketIo;
    }
    /* public setSocket(socket: any) {
         console.log('set socket');
        // this.socket = socket;
     }*/
    public addUserOnreading(userOnReading: {
        socket: any,
        username: string,
        targetname: string,
        key: boolean
    }) {
        this.UserOnReading.push(userOnReading);
    }

    public clearUserOnreading() {
        console.log('clear the array');
        this.UserOnReading = new Array<{
            socket: any,
            username: string,
            targetname: string,
            key: boolean
        }>();
    }

    public setUserOnreadingKey(index: number, key: boolean) {
        this.UserOnReading[index].key = key;

    }
    public setUserOnreadingTargetname(index: number, targetname: string) {
        this.UserOnReading[index].targetname = targetname;
    }

    public verify(username: string): boolean {
        /* if (this.socket != null && this.socket != undefined)
             return true;
         return false;*/
        console.log('-----------------------begun verfication of: -----------------' + username);
        // console.log(this.UserOnReading);
        let index: number = 0;
        if (this.UserOnReading.length > 0) {
            while (index < this.UserOnReading.length) {
                if (this.UserOnReading[index].username == username) {
                    console.log(this.UserOnReading[index].socket.id);
                    return true;
                }
                index++;
            }
            return false;
        } else {
            return false;
        }
    }
    public static getInstance() {
        if (this.Instance == null)
            this.Instance = new connection();
        return this.Instance;


    }
}

