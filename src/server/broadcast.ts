import { wss } from "./websocket";
import { rooms, players } from "../state";

export function broadcastRooms() {
    const roomsData = Array.from(rooms.values())
        .filter(room => room.players.length === 1) // Только комнаты с одним игроком
        .map(room => ({
            roomId: room.id,
            roomUsers: [{
                name: room.players[0].name,
                index: room.players[0].id
            }]
        }));

    const message = JSON.stringify({
        type: 'update_room',
        data: roomsData,
        id: 0
    });

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

export function broadcastWinners() {
    const winners = Array.from(players.values()).map(p => JSON.stringify({
        name: p.name,
        wins: p.wins
    }));

    const message = JSON.stringify({
        type: 'update_winners',
        data: winners,
        id: 0
    });

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}