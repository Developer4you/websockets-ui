import { Player } from "./Player";
import {generateId} from "../utils/idGenerator";

export class Game {
    public readonly id: string;
    public players: Player[];
    public currentPlayer: string;

    constructor(
        public player1: Player,
        public player2: Player
    ) {
        this.id = generateId();
        this.players = [player1, player2];
        this.currentPlayer = player1.id;
    }
}