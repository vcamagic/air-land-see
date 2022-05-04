import { LaneType } from "../LaneType";


export class Card {
    name!: string;
    power!: number;
    type!: LaneType;
    faceUp!: boolean;
    outline!: boolean;

    constructor(name: string, power: number, type: LaneType) {
        this.name = name;
        this.power = power;
        this.type = type;
        this.faceUp = false;
        this.outline = false;
    }

    onPlay = (): void => {

    }
}

