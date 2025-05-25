import WebSocket, { WebSocketServer } from 'ws';
import { handleMessage } from "../handlers/messageHandler";
import { generateId } from '../utils/idGenerator';

export const wss = new WebSocketServer({ port: 3000 });

const shutdown = () => {
    console.log('\nЗавершение работы сервера...');

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.close(1001, 'Сервер завершает работу');
        }
    });

    wss.close(() => {
        console.log('WebSocket сервер остановлен');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Принудительное завершение работы');
        process.exit(1);
    }, 5000);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

wss.on('connection', (ws) => {
    ws.connectionId = generateId();
    console.log(`Новое подключение: ${ws.connectionId}`);

    ws.on('message', (message) => {
        const data = JSON.parse(message.toString());
        handleMessage(ws, data);
    });

    ws.on('close', () => {
        console.log(`Подключение закрыто: ${ws.connectionId}`);
    });
});

console.log('WebSocket сервер запущен на ws://localhost:3000');