import { Board } from '../Board';
import { Lane } from '../Lane';
import { LaneType } from '../LaneType';
import { Card } from './Card';

export class Reinforce extends Card {
  constructor() {
    super(
      1,
      'Reinforce',
      1,
      LaneType.LAND,
      'Look at the top card of the deck. You may play it facedown to an adjacent theater.',
      '../assets/reinforcer.jpg'
    );
  }

  deploy(board: Board, selectedLane: LaneType): void {
    board.getAdjacentLanes(selectedLane).forEach((lane: Lane) => {
      lane.highlight = true;
    });
    board.getLane(selectedLane).addPlayerCard(this);
  }

  executeEffect(
    board: Board,
    targetId?: number,
    selectedLane?: LaneType
  ): void {
    board
      .getLane(selectedLane as LaneType)
      .addPlayerCard(board.deck[board.deck.length - 1]);
    board.deck.splice(board.deck.length - 1, 1);
    board.clearHighlights();
  }
}
