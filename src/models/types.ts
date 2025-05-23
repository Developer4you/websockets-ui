import {Player} from "./Player";

export type ShipType = 'small' | 'medium' | 'large' | 'huge';

export interface Position {
    x: number;
    y: number;
}

export interface Ship {
    position: Position;
    direction: boolean;
    length: number;
    type: ShipType;
    hits?: number;
}

export interface GameState {
    players: Player[];
    currentPlayer: string;
    ships: Record<string, Ship[]>;
    attacks: Record<string, Position[]>;
}

export interface AttackResult {
    position: Position;
    status: string;
}