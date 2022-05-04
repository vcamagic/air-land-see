import { Card } from "./Cards/Card";

export class Player {
    hand!: Card[];
    score!: number;
    name!: string;
    aerodrome!: boolean;
    airdrop!: boolean;

    constructor(name: string) {
        this.hand = [];
        this.score = 0;
        this.name = name;
        this.aerodrome = false;
        this.airdrop = false;
    }
}