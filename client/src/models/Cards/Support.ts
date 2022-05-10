import { Card } from "./Card";
import { LaneType } from "../LaneType";

export class Support extends Card {
    constructor() {
        super(1, 'Support', 1, LaneType.AIR, 'You gain +3 strength in each adjacent theater', '../assets/support.jpg')
    }
}