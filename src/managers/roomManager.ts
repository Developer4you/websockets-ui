import { GameRoom } from '../game/room';
import { Player } from '../game/player';
import { v4 as uuidv4 } from 'uuid';

export class RoomManager {
    private rooms = new Map<string, GameRoom>();

    createRoom(player: Player): GameRoom {
        const id = uuidv4();
        const room = new GameRoom(id, player);
        this.rooms.set(id, room);
        return room;
    }

    joinRoom(roomId: string, player: Player): GameRoom {
        const room = this.rooms.get(roomId);
        if (!room) throw new Error('Комната не найдена');
        room.addPlayer(player);
        return room;
    }

    getAvailableRooms(): GameRoom[] {
        return Array.from(this.rooms.values()).filter(r => r.getPlayers().length === 1);
    }

    deleteRoom(roomId: string) {
        this.rooms.delete(roomId);
    }

    getRoom(roomId: string): GameRoom | undefined {
        return this.rooms.get(roomId);
    }
}
