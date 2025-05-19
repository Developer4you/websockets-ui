import { handleRegistration } from "./regHandler";
import { handleCreateRoom, handleJoinRoom } from "./roomHandler";

export function handleMessage(ws: WebSocket, message: any) {
    try {
        const data = message;
        switch(data.type) {
            case 'reg':
                handleRegistration(ws, data.data);
                break;

            case 'create_room':
                if (data.data && data.data.index) {
                    handleCreateRoom(ws, data.data.index);
                }
                handleCreateRoom(ws);
                break;

            case 'add_user_to_room':
                if (data.data && data.data.indexRoom && data.data.index) {
                    handleJoinRoom(ws, data.data.indexRoom, data.data.index);
                }
                break;

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