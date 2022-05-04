import { Board } from "../Board";
import { Lane } from "../Lane";
import { LaneType } from "../LaneType";
import { Card } from "./Card";

export class Ambush extends Card {
    constructor() {
        super(2, 'Ambush', 2, LaneType.LAND);
    }

    flip(board: Board): void {
        this.faceUp = !this.faceUp;
        if(this.isFaceUp()) {
            this.selectTargets(board);
        }
    }

    deploy(board: Board, selectedLane: LaneType): void {
        board.getLane(selectedLane).addPlayerCard(this);
        this.selectTargets(board);
    }

    selectTargets(board: Board) {
        board.lanes.forEach((lane: Lane) => {
            let temp = lane.getLastPlayerCard();
            if(temp !== null) {
                temp.highlight = true;
            }
            temp = lane.getLastOpponentCard();
            if(temp !== null) {
                temp.highlight = true;
            }
        });
    }

    executeEffect(board: Board, targetId?: number, selectedLane?: LaneType): void {
        let temp = board.getCardById(targetId as number)
        if(temp !== null) {
            temp.card.flip(board);
        }
        board.clearHighlights();
    }
}