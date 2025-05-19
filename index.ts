import { httpServer } from "./src/http_server/index.js";
import http from "http";
import { GameServer } from './src/server/websocket';
import { PlayerManager } from './src/managers/player.manager';
import { registerAuthHandlers } from './src/handlers/auth.handler';
// import WebSocket, { WebSocketServer } from 'ws';

const HTTP_PORT = 8181;

console.log(`✅ Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const WS_PORT = 3000;

const wsServer = http.createServer();
const gameServer = new GameServer(wsServer);
const playerManager = new PlayerManager();

registerAuthHandlers(gameServer, playerManager);

wsServer.listen(WS_PORT, () => {
    console.log('✅ WebSocket-сервер запущен на ws://localhost:${PORT}');
});

// const PORT = 3000;
// const wss = new WebSocketServer({ port: PORT });
//
// console.log(`✅ WebSocket-сервер запущен на ws://localhost:${PORT}`);
//
// wss.on('connection', (ws: WebSocket) => {
//     console.log('🔌 Новое подключение');
//
//     ws.on('message', (data: WebSocket.RawData) => {
//         const msg = data.toString();
//         console.log(`📩 Получено сообщение: ${msg}`);
//
//         // Попробуем распарсить как JSON
//         try {
//             const payload = JSON.parse(msg);
//             if (payload.action === 'login') {
//                 const { name, password } = payload;
//                 console.log(`👤 Логин: ${name}, пароль: ${password}`);
//                 ws.send(JSON.stringify({ status: 'ok', message: `Добро пожаловать, ${name}` }));
//             }
//         } catch (err) {
//             console.error('Ошибка при парсинге JSON', err);
//             ws.send(JSON.stringify({ status: 'error', message: 'Неверный формат' }));
//         }
//     });
//
//     ws.on('close', () => {
//         console.log('❌ Клиент отключился');
//     });
// });
