import { LaneType } from "../LaneType";


export class Card {
    name!: string;
    power!: number;
    type!: LaneType;
    flipped!: boolean;
    outline!: boolean;

    constructor(name: string, power: number, type: LaneType) {
        this.name = name;
        this.power = power;
        this.type = type;
        this.flipped = false;
        this.outline = false;
    }

    onPlay = (): void => {

    }
}

