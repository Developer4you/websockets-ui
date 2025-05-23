import { Room } from "../models/Room";
import {games, players, rooms} from "../state";
import { generateId } from "../utils/idGenerator";
import { broadcastRooms } from "../server/broadcast";
import {Game} from "../models/Game";

export function handleCreateRoom(ws: WebSocket) {
    try {
        const player = Array.from(players.values()).find(
            p => {
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

        if (!player) {
            throw new Error("Игрок не найден");
        }

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
            // Проверка наличия обоих игроков
            if (room.players.some(p => !p)) {
                throw new Error("Не удалось создать игру: отсутствуют игроки");
            }

            // Передаём массив игроков
            const game = new Game(generateId(), room.players);
            games.set(game.id, game);
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