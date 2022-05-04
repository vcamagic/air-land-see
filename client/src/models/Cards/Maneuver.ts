import { Board } from '../Board';
import { Lane } from '../Lane';
import { LaneType } from '../LaneType';
import { Card } from './Card';

export class Maneuver extends Card {
  constructor(type: LaneType) {
    super(
      type * 6 + 3,
      'Maneuver',
      3,
      type,
      'Flip a card in an adjacent theater.',
      '../assets/manuever.jpg'
    );
  }

  deploy(board: Board, selectedLane: LaneType): void {
    board.getAdjacentLanes(selectedLane).forEach((lane: Lane) => {
      let temp = lane.getLastPlayerCard();
      if (temp !== null) {
        temp.highlight = true;
      }
      temp = lane.getLastOpponentCard();
      if (temp !== null) {
        temp.highlight = true;
      }
    });
    board.getLane(selectedLane).addPlayerCard(this);
  }

  executeEffect(
    board: Board,
    targetId?: number,
    selectedLane?: LaneType
  ): void {
    (board.getCardById(targetId as number) as Card).flip();
    board.clearHighlights();
  }
}
