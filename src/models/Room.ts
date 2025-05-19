import { Player } from "./Player";
import { Game } from "./Game";

export class Room {
    public id: string;
    public players: Player[] = [];
    public game: Game | null = null;

    constructor(public creator: Player) {
        this.id = generateId();
        this.players.push(creator);
    }

    addPlayer(player: Player): boolean {
        if (this.players.length < 2) {
            this.players.push(player);
            return true;
        }
        return false;
    }

    isReady(): boolean {
        return this.players.length === 2;
    }
}