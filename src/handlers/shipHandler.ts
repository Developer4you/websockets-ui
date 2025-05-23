import { games } from "../state";
import { broadcastStartGame } from "../server/broadcast";
import {Ship, Position} from "../models/types";

export function handleAddShips(
    gameId: string,
    playerId: string,
    ships: Array<{
        position: Position,
        direction: boolean,
        length: number,
        type: "small"|"medium"|"large"|"huge"
    }>
) {
    const game = games.get(gameId);
    if (!game) throw new Error("Игра не найдена");

    // Конвертация направления
    const convertedShips: Ship[] = ships;

    // Сохранение кораблей
    game.setShips(playerId, convertedShips);

    // Проверка готовности и старт игры
    if (game.playersReady()) {
        game.start();

        // Рассылка сообщений игрокам
        game.players.forEach(player => {
            player.ws.send(JSON.stringify({
                type: "start_game",
                data: JSON.stringify({
                    ships: game.ships[player.id],
                    currentPlayerIndex: game.currentPlayer
                }),
                id: 0
            }));
        });


    }
}