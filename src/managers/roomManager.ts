import { GameRoom } from '../game/room';
import { Player } from '../game/player';
import { v4 as uuidv4 } from 'uuid';

export class RoomManager {
    private rooms = new Map<string, GameRoom>();
    private changeCallbacks: (() => void)[] = [];

    createRoom(player: Player): GameRoom {
        const room = new GameRoom(uuidv4(), player);
        this.rooms.set(room.id, room);
        this.notifyChange();
        return room;
    }

    joinRoom(roomId: string, player: Player): GameRoom {
        const room = this.rooms.get(roomId);
        if (!room) throw new Error('Room not found');
        if (room.getPlayers().length >= 2) throw new Error('Room is full');

        room.addPlayer(player);
        this.notifyChange();
        return room;
    }

    getAvailableRooms(): GameRoom[] {
        return Array.from(this.rooms.values())
            .filter(room => room.getPlayers().length === 1);
    }

    deleteRoom(roomId: string) {
        this.rooms.delete(roomId);
        this.notifyChange();
    }

    onRoomChange(callback: () => void) {
        this.changeCallbacks.push(callback);
    }

    private notifyChange() {
        this.changeCallbacks.forEach(cb => cb());
    }
}