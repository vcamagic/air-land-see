import { Card } from "./Cards/Card";
import { LaneType } from "./LaneType";

export class Lane {
    type!: LaneType;
    playerCards!: Card[];
    opponentCards!:Card[];

    constructor(type: LaneType) {
        this.type = type;
        this.playerCards = [];
        this.opponentCards = [];
    }
}