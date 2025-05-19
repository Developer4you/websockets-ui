import { Game } from "../models/Game";
import { games } from "../state";
import { broadcastAttack, broadcastTurn, broadcastFinish } from "../server/broadcast";

export function handleAttack(
    gameId: string,
    playerId: string,
    position: Position
) {
    const game = games.get(gameId);
    if (!game || game.currentPlayer !== playerId) return;

    const result = game.processAttack(position);
    broadcastAttack(game, result);

    if (result.status === 'miss') {
        game.switchTurn();
        broadcastTurn(game);
    }

    if (game.isFinished()) {
        broadcastFinish(game);
    }
}