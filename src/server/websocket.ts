import WebSocket, { WebSocketServer } from 'ws';
import { handleMessage } from "../handlers/messageHandler";

export const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {

        const data = JSON.parse(message.toString());
        handleMessage(ws, data);
    });

    ws.on('close', () => {
    });
});
