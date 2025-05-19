import { Room } from "../models/Room";
import { players, rooms } from "../state";
import { generateId } from "../utils/idGenerator";
import { broadcastRooms } from "../server/broadcast";

export function handleCreateRoom(ws: WebSocket) {
    try {
        const player = Array.from(players.values()).find(p => p.ws === ws);
        if (!player) throw new Error("Player not registered");

        Array.from(rooms.values()).forEach(room => {
            room.removePlayer(player.id);
            if (room.players.length === 0) rooms.delete(room.id);
        });

        const newRoom = new Room(generateId());
        newRoom.addPlayer(player);

        rooms.set(newRoom.id, newRoom);
        broadcastRooms();

    } catch (error) {
        ws.send(JSON.stringify({
            type: "error",
            data: { errorText: error.message },
            id: 0
        }));
    }
}