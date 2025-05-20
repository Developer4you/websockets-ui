import { handleRegistration } from "./regHandler";
import {handleCreateRoom, handleJoinRoom} from "./roomHandler";
import {players} from "../state";

export function handleMessage(ws: WebSocket, data: any) {
    try {
        switch(data.type) {
            case 'reg':
                data.data = JSON.parse(data.data.toString());
                handleRegistration(ws, data.data);
                break;

            case 'create_room':
                handleCreateRoom(ws);
                break;

            case 'add_user_to_room': {
                try {
                    // Парсим вложенный JSON из data
                    const requestData = JSON.parse(data.data);
                    const roomId = requestData.indexRoom;

                    // Находим игрока по текущему соединению
                    const player = Array.from(players.values()).find(
                        p => p.currentConnectionId === ws.connectionId
                    );
                    console.log('p.currentConnectionId', player.currentConnectionId)
                    console.log('ws.connectionId', ws.connectionId)

                    if (!player) {
                        throw new Error('Сначала пройдите регистрацию');
                    }

                    handleJoinRoom(ws, roomId, player.id);
                } catch (error) {
                    ws.send(JSON.stringify({
                        type: 'error',
                        data: JSON.stringify({ errorText: error.message }),
                        id: 0
                    }));
                }
                break;
            }

            default:
                throw new Error('Unknown message type');
        }
    } catch (error) {
        ws.send(JSON.stringify({
            type: 'error',
            data: { errorText: error.message },
            id: 0
        }));
    }
}