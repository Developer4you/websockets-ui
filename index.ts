import { httpServer } from "./src/http_server/index.js";
import http from "http";
import { GameServer } from './src/server/websocket';
import { PlayerManager } from './src/managers/player.manager';
import { registerAuthHandlers } from './src/handlers/auth.handler';
import {RoomManager} from "./src/managers/roomManager";
import {registerRoomHandlers} from "./src/handlers/registerRoom.handlers";

const HTTP_PORT = 8181;

console.log(`✅ Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const WS_PORT = 3000;

const wsServer = http.createServer();
const gameServer = new GameServer(wsServer);
const playerManager = new PlayerManager();
const roomManager = new RoomManager();

registerAuthHandlers(gameServer, playerManager);
registerRoomHandlers(gameServer, playerManager, roomManager);

wsServer.listen(WS_PORT, () => {
    console.log('✅ WebSocket-сервер запущен на ws://localhost:${PORT}');
});
