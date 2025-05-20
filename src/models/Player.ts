// src/models/Player.ts
export class Player {
    public currentConnectionId?: string;

    constructor(
        public readonly id: string,
        public name: string,
        public password: string,
        public ws: WebSocket
    ) {
        this.currentConnectionId = ws.connectionId;
    }

    updateConnection(ws: WebSocket) {
        this.ws = ws;
        this.currentConnectionId = ws.connectionId;
    }
}