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

    getPlayers() {
        return [...this.players];
    }
}