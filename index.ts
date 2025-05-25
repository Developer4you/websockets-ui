import { httpServer } from "./src/http_server/index.js";
import { wss } from './src/server/websocket';

const HTTP_PORT = 8181;

console.log(`✅ Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

console.log('🚀 WebSocket Server started on ws://localhost:3000');

process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    wss.clients.forEach(client => client.close());
    wss.close();
    process.exit();
});