import { Player } from "./Player";

export class Game {
    public id: string;
    public players: Player[];
    public ships: Map<string, Ship[]> = new Map();
    public attacks: Map<string, Set<string>> = new Map();

    constructor(public player1: Player, public player2: Player) {
        this.id = generateId();
        this.players = [player1, player2];
    }

    // Логика игры...
}