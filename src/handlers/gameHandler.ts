import { broadcastAttack, broadcastTurn, broadcastFinish } from "../server/broadcast";
import {games} from "../state";
import {Position} from "../models/types";

export function handleAttack(
    gameId: string,
    playerId: string,
    position: Position
) {
    const game = games.get(gameId);
    if (!game || game.currentPlayer !== playerId) return;

    try {
// После успешной атаки
        const result = game.processAttack(playerId, position);
        broadcastAttack(game, result);
        if (result.status === "shot" || "killed") {
            if (result.status === "killed") {
                const winner = game.checkWinner();
                if (winner) {
                    broadcastFinish(game, playerId);
                    games.delete(game.id);
                }
            }
            game.switchTurn();
            game.switchTurn();
        }

        if (result.status === "miss") {
            game.switchTurn();
        }

    } catch (error) {
        console.log('error')
        game?.players
            .find(p => p === playerId)
            ?.ws.send(JSON.stringify({
            type: "error",
            data: { errorText: error.message },
            id: 0
        }));
    }
}

export function handleRandomAttack(gameId: string, playerId: string) {
    const game = games.get(gameId);
    if (!game || game.currentPlayer !== playerId) return;

    // Генерация случайной позиции
    let x: number, y: number;
    do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
    } while (game.attacks[playerId]?.some(a => a.x === x && a.y === y));

    handleAttack(gameId, playerId, { x, y });
}