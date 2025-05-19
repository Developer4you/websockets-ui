export class GameServer {
    private wss: WebSocketServer;
    private handlers = new Map<string, (ws: WebSocket, data: unknown) => void>();
    private connections = new Map<WebSocket, Player>();  // Добавляем привязку сокета к игроку

    // ... остальной код

    private init() {
        this.wss.on('connection', (ws: WebSocket) => {
            console.log('🔌 Новое подключение');

            ws.on('message', (data: string) => {
                try {
                    const command = JSON.parse(data);
                    if (command.type === 'reg') {
                        this.handleRegistration(ws, command.data);
                    } else {
                        this.handleMessage(ws, data);
                    }
                } catch (error) {
                    console.error('Error handling message:', error);
                }
            });

            ws.on('close', () => {
                this.connections.delete(ws);
                console.log('❌ Клиент отключился');
            });
        });
    }

    private handleRegistration(ws: WebSocket, data: { name: string; password: string }) {
        try {
            const player = playerManager.login(data.name, data.password);
            this.connections.set(ws, player);
            ws.send(JSON.stringify({
                type: 'reg',
                data: {
                    name: player.name,
                    index: player.id,
                    error: false,
                    errorText: ''
                },
                id: 0
            }));
        } catch (error) {
            ws.send(JSON.stringify({
                type: 'reg',
                data: {
                    name: data.name,
                    index: 0,
                    error: true,
                    errorText: error.message
                },
                id: 0
            }));
        }
    }

    // Добавляем метод broadcast
    broadcast(message: string) {
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}