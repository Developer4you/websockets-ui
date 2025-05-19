export type ShipType = 'small' | 'medium' | 'large' | 'huge';

export interface ShipPosition {
    x: number;
    y: number;
    direction: boolean;
    length: number;
    type: ShipType;
}

export interface GameCommand<T = unknown> {
    type: string;
    data: T;
    id: 0;
}

export type GameResponse =
    | { type: 'attack', data: AttackResult }
    | { type: 'reg', data: RegistrationResult }
    | { type: 'update_winners', data: Winner[] };

export interface AttackResult {
    x: number;
    y: number;
    status: 'miss' | 'hit' | 'sunk';
}

export interface RegistrationResult {
    name: string;
    index: string | null;
    error: boolean;
    errorText: string;
}

export interface Winner {
    name: string;
    wins: number;
}