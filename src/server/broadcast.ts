import { wss } from "./websocket";
import { rooms, players } from "../state";

export function broadcastRooms() {
    const roomsData = JSON.stringify(Array.from(rooms.values())
        .filter(room => !room.isFull)
        .map(room => ({
            roomId: room.id,
            roomUsers: room.players.map(p => ({
                name: p.name,
                index: p.id
            }))
        })));

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: "update_room",
                data: roomsData,
                id: 0
            }));
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