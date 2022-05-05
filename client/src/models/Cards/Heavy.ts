import { LaneType } from "../LaneType";
import { Card } from "./Card";

export class Heavy extends Card {
    constructor(type: LaneType) {
        let name: string = '';
        switch(type) {
            case 1: name = 'Red Baron'; break;
            case 2: name = 'Heavy Tanks'; break;
            case 3: name = 'Bismark'; break;
        }
        super(type * 6 + 6, name, 6, type, '','../assets/heavy.jpg');
    }
}