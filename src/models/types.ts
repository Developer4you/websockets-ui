export type Direction = 'horizontal' | 'vertical';
export type ShipType = 'small' | 'medium' | 'large' | 'huge';

export interface Position {
    x: number;
    y: number;
}

export interface Ship {
    position: Position;
    direction: Direction;
    length: number;
    type: ShipType;
    hits?: number;
}

export interface GameState {
    players: string[];
    currentPlayer: string;
    ships: Record<string, Ship[]>;
    attacks: Record<string, Position[]>;
}