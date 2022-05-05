import { Board } from '../Board';
import { Lane } from '../Lane';
import { LaneType } from '../LaneType';
import { Card } from './Card';

export class Maneuver extends Card {
    constructor(type: LaneType) {
        super(type * 6 + 3,'Maneuver', 3, type, 'Flip a card in an adjacent theater.', '../assets/manuever.jpg');
    }

    deploy(board: Board, selectedLane: LaneType): void {
        super.deploy(board, selectedLane);
        this.selectTargets(board, selectedLane);
    }

    flip(board: Board): void {
        this.faceUp = !this.faceUp;
        if(this.faceUp) {
            let temp = board.getCardById(this.id);
            if(temp!==null){
                this.selectTargets(board, temp.lane);
            }
        }
    }

    executeEffect(board: Board, targetId?: number, selectedLane?: LaneType): void {
        let temp = board.getCardById(targetId as number);
        if(temp!==null){
            temp.card.flip(board);
        }
        board.clearHighlights();
    }

    selectTargets(board: Board, selectedLane: LaneType): void {
        board.getAdjacentLanes(selectedLane).forEach((lane:Lane) => {
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
}
