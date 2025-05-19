import { Player } from './player';

export class GameRoom {
    private players: Player[] = [];

    constructor(
        public readonly id: string,
        private creator: Player
    ) {
        this.players.push(creator);
    }

    addPlayer(player: Player) {
        if (this.players.length >= 2) {
            throw new Error('Room is full');
        }
        this.players.push(player);
    }

    getPlayers(): Player[] {
        return [...this.players];
    }

    hasPlayer(playerId: string): boolean {
        return this.players.some(p => p.id === playerId);
    }

    toJSON() {
        return {
            id: this.id,
            players: this.players.map(p => p.toJSON())
        };
    }
}