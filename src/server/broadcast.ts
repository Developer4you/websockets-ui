import { wss } from "./websocket";
import { rooms, players } from "../state";

export function broadcastRooms() {
    console.log('broadcastRooms')
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

export function broadcastStartGame(game: Game) {
    // Для каждого игрока в игре
    game.getPlayers().forEach(player => {
        if (!player.ws || player.ws.readyState !== WebSocket.OPEN) return;

        // Формируем данные для конкретного игрока
        const response = {
            type: "start_game" as const,
            data: {
                ships: game.ships[player.id].map(ship => ({
                    position: ship.position,
                    direction: ship.direction === 'horizontal', // Конвертируем обратно в boolean
                    length: ship.length,
                    type: ship.type
                })),
                currentPlayerIndex: game.currentPlayer
            },
            id: 0
        };

        // Двойная сериализация для совместимости с фронтендом
        const stringifiedData = JSON.stringify(response.data);
        player.ws.send(JSON.stringify({
            ...response,
            data: stringifiedData
        }));
    });
}