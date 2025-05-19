import {GameServer} from "../server/websocket";
import {PlayerManager} from "../managers/player.manager";
import {RoomManager} from "../managers/roomManager";
import {updateRooms} from "../managers/updateRooms";

export function registerRoomHandlers(
    server: GameServer,
    playerManager: PlayerManager,
    roomManager: RoomManager
) {
    server.registerHandler('create_room', (ws, playerId: string) => {
        const player = playerManager.getAll().find(p => p.id === playerId);
        if (!player) return;

        const room = roomManager.createRoom(player);
        updateRooms(server, roomManager); // Обновим список для всех
    });

    server.registerHandler('add_user_to_room', (ws, data: { indexRoom: string }) => {
        const player = playerManager.getAll().find(p => p.id ===
            /* каким-то образом определить текущего игрока */);
        if (!player) return;

        const room = roomManager.joinRoom(data.indexRoom, player);

        // Отправка обоим игрокам сигнала начала игры
        for (const p of room.getPlayers()) {
            const command = {
                type: 'create_game',
                data: {
                    idGame: room.id,
                    idPlayer: p.id
                },
                id: 0
            };
            server.sendTo(p.id, command); // Нужно реализовать по player.id
        }

        updateRooms(server, roomManager); // Удалить комнату из списка доступных
    });
}
