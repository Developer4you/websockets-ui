import { wss } from "./websocket";
import { rooms, players } from "../state";
import {Game} from "../models/Game";
import {AttackResult} from "../models/types";

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


export function broadcastAttack(game: Game, result: AttackResult) {

    const message = {
        type: "attack",
        data: JSON.stringify({
            position: result.position,
            currentPlayer: game.currentPlayer,
            status: result.status
        }),
        id: 0
    };

    game.players.forEach(player => {
        if (player.ws.readyState === WebSocket.OPEN) {
            player.ws.send(JSON.stringify(message));
        }
    });
}


export function broadcastTurn(game: Game) {

    const message = {
        type: "turn",
        data: JSON.stringify({
            currentPlayer: game.currentPlayer
        }),
        id: 0
    };

    game.players.forEach(player => {
        if (player.ws.readyState === WebSocket.OPEN) {
            player.ws.send(JSON.stringify(message));
        }
    });
}


export function broadcastFinish(game: Game, winnerId: string) {

    const message = {
        type: "finish",
        data: JSON.stringify({
            winPlayer: winnerId
        }),
        id: 0
    };

    game.players.forEach(player => {
        if (player.ws.readyState === WebSocket.OPEN) {
            player.ws.send(JSON.stringify(message));
        }
    });
}