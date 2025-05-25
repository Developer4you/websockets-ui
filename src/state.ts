import { Player } from "./models/Player";
import { Room } from "./models/Room";
import { Game } from "./models/Game";

export const players = new Map<string, Player>();
export const rooms = new Map<string, Room>();
export const games = new Map<string, Game>();