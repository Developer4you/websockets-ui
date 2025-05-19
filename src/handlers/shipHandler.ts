import { Game } from "../models/Game";
import { games } from "../state";
import { broadcastStartGame } from "../server/broadcast";

export function handleAddShips(
    gameId: string,
    playerId: string,
    ships: Ship[]
) {
    const game = games.get(gameId);
    if (!game) return;

    game.setShips(playerId, ships);

    if (game.playersReady()) {
        game.start();
        broadcastStartGame(game);
    }
}