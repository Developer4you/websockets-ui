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

        if (!name || name.length < 3 || !password || password.length < 5) {
            throw new Error('Invalid name or password');
        }

        let player = Array.from(players.values()).find(p => p.name === name);

        if (player) {
            if (player.password !== password) throw new Error('Invalid password');
            player.ws = ws;
        } else {
            player = new Player(
                generateId(),
                name,
                password,
                ws
            );
            players.set(player.id, player);
        }

        ws.send(JSON.stringify({
            type: 'reg',
            data: JSON.stringify({
                name: player.name,
                index: player.id,
                error: false
            }),
            id: 0
        }));

        broadcastWinners();
        broadcastRooms();

    } catch (error) {
        ws.send(JSON.stringify({
            type: 'reg',
            data: JSON.stringify({
                error: true,
                errorText: error.message
            }),
            id: 0
        }));
    }
}