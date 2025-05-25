import { Player } from "./Player";

export class Room {
    public readonly createdAt: number;

    constructor(
        public readonly id: string,
        public players: Player[] = []
    ) {
        this.createdAt = Date.now();
    }

    addPlayer(player: Player): void {
        if (this.players.length >= 2) {
            throw new Error("Room is full");
        }
        this.players.push(player);
    }

    removePlayer(playerId: string): void {
        this.players = this.players.filter(p => p.id !== playerId);
    }

    get isFull(): boolean {
        return this.players.length === 2;
    }
}