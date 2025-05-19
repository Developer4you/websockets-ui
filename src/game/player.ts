export class Player {
    public isOnline: boolean = false;

    constructor(
        public readonly id: string,
        public name: string,
        public password: string,
        public wins: number = 0
    ) {}

    toJSON() {
        return {
            name: this.name,
            index: this.id,
            wins: this.wins
        };
    }
}