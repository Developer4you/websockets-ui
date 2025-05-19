// src/core/playerManager.ts
import { Player } from '../game/player';
import { v4 as uuidv4 } from 'uuid';

export class PlayerManager {
    private playersByName = new Map<string, Player>();

    register(name: string, password: string): Player {
        if (this.playersByName.has(name)) {
            throw new Error('Игрок с таким именем уже зарегистрирован');
        }
        const player = new Player(uuidv4(), name, password);
        this.playersByName.set(name, player);
        return player;
    }

    login(name: string, password: string): Player {
        const player = this.playersByName.get(name);
        if (!player || player.password !== password) {
            throw new Error('Неверный логин или пароль');
        }
        return player;
    }

    getPlayer(name: string): Player | undefined {
        return this.playersByName.get(name);
    }

    getAll(): Player[] {
        return Array.from(this.playersByName.values());
    }
}
