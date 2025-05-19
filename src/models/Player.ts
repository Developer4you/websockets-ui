export class Player {
    public id: string;
    public ws: WebSocket;
    public name: string;
    public wins: number = 0;

    constructor(ws: WebSocket, name: string, id: string) {
        this.ws = ws;
        this.name = name;
        this.id = id;
    }
}