import { PlayerManager } from '../managers/player.manager';

export function registerAuthHandlers(server: any, playerManager: PlayerManager) {
    server.registerHandler<{ name: string; password: string }>('reg', (ws, data) => {
        try {
            const player = playerManager.register(data.name, data.password);

            ws.send(JSON.stringify({
                type: 'reg',
                data: JSON.stringify({
                    index: player.id,
                    error: false,
                    errorText: ''
                }),
                id: 0
            }));

        } catch (error: any) {
            ws.send(JSON.stringify({
                type: 'reg',
                data: JSON.stringify({
                    index: null,
                    error: true,
                    errorText: error.message
                }),
                id: 0
            }));
        }
    });
}