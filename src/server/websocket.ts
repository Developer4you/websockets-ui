import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { PlayerManager } from '../managers/player.manager';
import { RoomManager } from '../managers/roomManager';
import { Player } from '../game/player';

type GameCommand = {
    type: string;
    data: any;
    id: number;
};

export class GameServer {
    private wss: WebSocketServer;
    private connections = new Map<WebSocket, Player>();

    constructor(
        private playerManager: PlayerManager,
        private roomManager: RoomManager,
        port: number
    ) {
        this.wss = new WebSocketServer({ port });
        this.init();
    }

    private init() {
        this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
            console.log('🔌 New connection');

            ws.on('message', (data: string) => this.handleMessage(ws, data));
            ws.on('close', () => this.handleDisconnect(ws));
        });
    }

    private async handleMessage(ws: WebSocket, data: string) {
        try {
            const command: GameCommand = JSON.parse(data);
            console.log(`📩 Received command: ${command.type}`);

            switch(command.type) {
                case 'reg':
                    await this.handleRegistration(ws, command.data);
                    break;
                case 'create_room':
                    this.handleCreateRoom(ws);
                    break;
                case 'add_user_to_room':
                    this.handleJoinRoom(ws, command.data.indexRoom);
                    break;
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }

    private async handleRegistration(ws: WebSocket, data: { name: string; password: string }) {
        try {
            let player = this.playerManager.getPlayer(data.name);

            if (!player) {
                player = this.playerManager.register(data.name, data.password);
            } else if (player.password !== data.password) {
                throw new Error('Invalid password');
            }

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

            this.broadcastWinners();
            this.broadcastRooms();

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

    private handleCreateRoom(ws: WebSocket) {
        const player = this.connections.get(ws);
        if (!player) return;

        const room = this.roomManager.createRoom(player);
        this.broadcastRooms();
        console.log(`🆕 Room created: ${room.id} by ${player.name}`);
    }

    private handleJoinRoom(ws: WebSocket, roomId: string) {
        const player = this.connections.get(ws);
        if (!player) return;

        try {
            const room = this.roomManager.joinRoom(roomId, player);
            this.broadcastRooms();

            room.getPlayers().forEach(player => {
                const connection = this.getConnectionByPlayer(player);
                connection?.send(JSON.stringify({
                    type: 'create_game',
                    data: {
                        idGame: room.id,
                        idPlayer: player.id
                    },
                    id: 0
                }));
            });

        } catch (error) {
            ws.send(JSON.stringify({
                type: 'error',
                data: { errorText: error.message },
                id: 0
            }));
        }
    }

    private handleDisconnect(ws: WebSocket) {
        this.connections.delete(ws);
        this.broadcastRooms();
        this.broadcastWinners();
    }

    private getConnectionByPlayer(player: Player): WebSocket | undefined {
        return Array.from(this.connections.entries())
            .find(([_, p]) => p.id === player.id)?.[0];
    }

    public broadcastRooms() {
        const roomsData = this.roomManager.getAvailableRooms().map(room => ({
            roomId: room.id,
            roomUsers: room.getPlayers().map(p => ({ name: p.name, index: p.id }))
        }));

        const message = JSON.stringify({
            type: 'update_room',
            data: roomsData,
            id: 0
        });

        this.broadcast(message);
    }

    public broadcastWinners() {
        const winnersData = this.playerManager.getAll().map(p => ({
            name: p.name,
            wins: p.wins
        }));

        const message = JSON.stringify({
            type: 'update_winners',
            data: winnersData,
            id: 0
        });

        this.broadcast(message);
    }

    private broadcast(message: string) {
        this.wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}