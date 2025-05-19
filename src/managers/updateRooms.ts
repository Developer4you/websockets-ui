export function updateRooms(server: GameServer, roomManager: RoomManager) {
    const availableRooms = roomManager.getAvailableRooms();

    const data = availableRooms.map(room => ({
        roomId: room.id,
        roomUsers: room.getPlayers().map(player => player.toJSON())
    }));

    const message = JSON.stringify({
        type: 'update_room',
        data,
        id: 0
    });

    server.broadcast(message); // Метод `broadcast` тебе надо реализовать в GameServer
}
