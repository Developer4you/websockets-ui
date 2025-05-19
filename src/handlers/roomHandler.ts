import { Player } from "../models/Player";
import { players, rooms } from "../state";
import { generateId } from "../utils/idGenerator";
import { broadcastRooms } from "../server/broadcast";

export function handleCreateRoom(ws: WebSocket) {
    // Находим игрока по WebSocket соединению
    const player = Array.from(players.values()).find(p => p.ws === ws);

    if (!player) {
        ws.send(JSON.stringify({
            type: 'error',
            data: { errorText: 'Player not registered' },
            id: 0
        }));
        return;
    }

    // Удаляем игрока из других комнат
    Array.from(rooms.values()).forEach(room => {
        if (room.players.includes(player)) {
            room.players = room.players.filter(p => p !== player);
            if (room.players.length === 0) {
                rooms.delete(room.id);
            }
        }
    });

    // Создаем новую комнату
    const newRoom = new Room(generateId(), player);
    rooms.set(newRoom.id, newRoom);

    // Рассылаем обновление
    broadcastRooms();
}