import { Room } from "../models/Room";
import { players, rooms } from "../state";
import { generateId } from "../utils/idGenerator";
import { broadcastRooms } from "../server/broadcast";
import {Game} from "../models/Game";

export function handleCreateRoom(ws: WebSocket) {
    try {
        const player = Array.from(players.values()).find(
            p => {
                console.log('p.currentConnectionId', p.currentConnectionId)
                console.log('ws.connectionId', ws.connectionId)

                return p.currentConnectionId === ws.connectionId
            }
        );

        if (!player) throw new Error('Player not found');

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

export function handleJoinRoom(ws: WebSocket, roomId: string, playerId: string) {
    try {
        const room = rooms.get(roomId);
        const player = players.get(playerId);

        // Проверка существования комнаты и игрока
        if (!room || !player) {
            throw new Error('Комната или игрок не найдены');
        }

        // Проверка заполненности комнаты
        if (room.players.length >= 2) {
            throw new Error('Комната уже заполнена');
        }

        // Удаление из других комнат
        Array.from(rooms.values()).forEach(r => {
            if (r.id !== roomId && r.players.some(p => p.id === playerId)) {
                r.players = r.players.filter(p => p.id !== playerId);
                if (r.players.length === 0) rooms.delete(r.id);
            }
        });

        // Добавление игрока
        room.players.push(player);

        // Создание игры при заполнении
        if (room.players.length === 2) {
            const game = new Game(room.players[0], room.players[1]);
            activeGames.set(game.id, game);

            // Отправка уведомлений игрокам
            room.players.forEach(player => {
                player.ws.send(JSON.stringify({
                    type: 'create_game',
                    data: JSON.stringify({
                        idGame: game.id,
                        idPlayer: player.id
                    }),
                    id: 0
                }));
            });

            rooms.delete(roomId);
        }

        broadcastRooms();

    } catch (error) {
        ws.send(JSON.stringify({
            type: 'error',
            data: JSON.stringify({ errorText: error.message }),
            id: 0
        }));
    }
}