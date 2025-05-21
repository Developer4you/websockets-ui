import { generateId } from "../utils/idGenerator";
import { Player } from "./Player";
import {Ship, GameState, Position} from "./types";

export class Game implements GameState {
    public ships: Record<string, Ship[]> = {};
    public attacks: Record<string, Position[]> = {};
    public currentPlayer: string;

    constructor(
        public readonly id: string,
        public readonly players: Player[]
    ) {
        this.currentPlayer = players[Math.floor(Math.random() * players.length)].id;
    }

    // Добавление кораблей игрока

    setShips(playerId: string, ships: Ship[]) {
        // Проверка количества
        if (ships.length !== 10) throw new Error("Должно быть 10 кораблей");

        // Проверка уникальности позиций
        const positions = new Set();
        for (const ship of ships) {
            for (let i = 0; i < ship.length; i++) {

                const x = ship.direction === "horizontal"
                    ? (ship.position.x) + i
                    : ship.position.x;

                const y = ship.direction === "vertical"
                    ? (ship.position.y) + i
                    : ship.position.y;
                if (x > 9 || y > 9) throw new Error("Корабль за пределами поля");
                if (positions.has(`${x},${y}`)) throw new Error("Пересечение кораблей");
                positions.add(`${x},${y}`);
            }
        }

        this.ships[playerId] = ships;
    }

    playersReady(): boolean {
        return this.players.every(player =>
            this.ships[player.id]?.length === 10
        );
    }

    start() {
    }
}