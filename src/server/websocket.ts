import WebSocket, { WebSocketServer } from 'ws';
import { handleMessage } from "../handlers/messageHandler";
import { generateId } from '../utils/idGenerator';

export const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
    ws.connectionId = generateId(); // Генерируем уникальный ID
    console.log(`New connection ${ws.connectionId}`);
    ws.on('message', (message) => {
        const data = JSON.parse(message.toString());
        handleMessage(ws, data);
    });

    ws.on('close', () => {
    });
});
