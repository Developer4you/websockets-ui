import { generateId } from "../utils/idGenerator";
import { Player } from "./Player";
import {Ship, GameState, Position} from "./types";
import {broadcastTurn} from "../server/broadcast";

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
            ship.hits = 0;
            for (let i = 0; i < ship.length; i++) {

                const x = (!ship.direction)
                    ? (ship.position.x) + i
                    : ship.position.x;

                const y = (ship.direction)
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

    processAttack(attackerId: string, position: Position) {
        // Проверка очереди хода
        if (this.currentPlayer !== attackerId) {
            throw new Error("Сейчас не ваш ход");
        }

        const targetPlayerId = this.players.find(p => p.id !== attackerId).id;

        const ships = this.ships[targetPlayerId];

        // Поиск пораженного корабля
        let hitShip: Ship | undefined;

        for (const ship of ships) {

            const cells = this.getShipCells(ship);
            if (cells.some(c => c.x === position.x && c.y === position.y)) {
                hitShip = ship;
                break;
            }
        }

        // Запись атаки
        this.attacks[attackerId] = this.attacks[attackerId] || [];

        this.attacks[attackerId].push(position);

        // Обработка попадания
        if (hitShip) {
            hitShip.hits = (hitShip.hits || 0) + 1;
            return this.handleHit(hitShip, position);
        }

        return { status: "miss", position };
    }

    private handleHit(ship: Ship, position: Position) {
        // Проверка уничтожения корабля
        if (ship.hits === ship.length) {
            this.markAroundShip(ship);
            return { status: "killed", position };
        }
        return { status: "shot", position };
    }

    private getShipCells(ship: Ship): Position[] {
        const cells = [];
        for (let i = 0; i < ship.length; i++) {
            cells.push({
                x: (!ship.direction) ? ship.position.x + i : ship.position.x,
                y: (ship.direction) ? ship.position.y + i : ship.position.y
            });
        }
        return cells;
    }

    private markAroundShip(ship: Ship) {
        const cells = this.getShipCells(ship);
        const attacks = this.attacks[this.currentPlayer];

        cells.forEach(cell => {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const x = cell.x + dx;
                    const y = cell.y + dy;
                    if (x >= 0 && x < 10 && y >= 0 && y < 10) {
                        attacks.push({ x, y });
                    }
                }
            }
        });
    }

    switchTurn() {
        this.currentPlayer = this.players.find(p => p.id !== this.currentPlayer).id
        broadcastTurn(this)
    }

    checkWinner() {
        const players = this.players
        const ships = this.ships
         const result = players.find(player =>{
            return ships[player.id].every(s => s.hits === s.length)}
        );
         return (!!result)
    }

    start() {
        console.log('start()')
        this.switchTurn()
    }
}