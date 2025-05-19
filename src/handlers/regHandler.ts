import { Player } from "../models/Player";
import { players } from "../state";
import { generateId } from "../utils/idGenerator";
import {broadcastRooms, broadcastWinners} from "../server/broadcast";

type DataType = {
    name: string
    password: string
}
export function handleRegistration(ws: WebSocket, data: DataType) {
    try {
        const { name, password } = data;

        // Валидация входных данных
        if (!name || name.length < 3 || !password || password.length < 5) {
            throw new Error('Invalid name or password');
        }

        // Поиск существующего игрока
        const existingPlayer = Array.from(players.values()).find(p => p.name === name);

        // Логика обработки
        if (existingPlayer) {
            // Проверка пароля для существующего игрока
            if (existingPlayer.password !== password) {
                throw new Error('Incorrect password');
            }
            // Обновляем соединение для существующего игрока
            existingPlayer.ws = ws;
        } else {
            // Создаем нового игрока
            const newPlayer = new Player(
                generateId(),
                name,
                password,
                ws
            );
            players.set(newPlayer.id, newPlayer);
        }

        // Получаем актуального игрока
        const player = existingPlayer || players.get([...players.keys()].pop()!);

        // Отправляем ответ клиенту
        ws.send(JSON.stringify({
            type: 'reg',
            data: JSON.stringify({
                name: player.name,
                index: player.id,
                error: false,
                errorText: ''
            }),
            id: 0
        }));

        // Обновляем всех клиентов
        broadcastWinners();
        broadcastRooms();

    } catch (error) {
        ws.send(JSON.stringify({
            type: 'reg',
            data: JSON.stringify({
                name: '',
                index: -1,
                error: true,
                errorText: error.message
            }),
            id: 0
        }));
    }
}