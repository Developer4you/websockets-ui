import { Player } from '../game/player';
import { v4 as uuidv4 } from 'uuid';

export class PlayerManager {
    private players = new Map<string, Player>();

    register(name: string, password: string): Player {
        if (this.players.has(name)) {
            throw new Error('Player already exists');
        }

        const player = new Player(
            uuidv4(),
            name,
            password
        );

        this.players.set(name, player);
        return player;
    }

    getPlayer(name: string): Player | undefined {
        return this.players.get(name);
    }

    getAll(): Player[] {
        return Array.from(this.players.values());
    }

    incrementWins(playerId: string) {
        const player = this.getAll().find(p => p.id === playerId);
        if (player) player.wins++;
    }
}