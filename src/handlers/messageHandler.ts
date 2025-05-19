import { handleRegistration } from "./regHandler";
import { handleCreateRoom } from "./roomHandler";

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

            // case 'add_user_to_room':
            //     if (data.data && data.data.indexRoom && data.data.index) {
            //         handleJoinRoom(ws, data.data.indexRoom, data.data.index);
            //     }
            //     break;

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