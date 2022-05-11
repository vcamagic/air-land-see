import { Board } from '../../Board';
import { Lane } from '../../Lane';
import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class Reinforce extends Card {
  constructor() {
    super(
      7,
      'Reinforce',
      1,
      LaneType.LAND,
      'Look at the top card of the deck. You may play it facedown to an adjacent theater.',
      '/images/reinforcer.jpg',
      CardEffect.INSTANT
    );
  }

  flip(board: Board): void {
    this.faceUp = !this.faceUp;
    if (this.isFaceUp()) {
      let temp = board.getCardById(this.id);
      if (temp !== null) {
        this.selectTargets(board, temp.lane);
      }
    }
  }

  deploy(board: Board, selectedLane: LaneType): Board {
    board = super.deploy(board, selectedLane);
    this.selectTargets(board, selectedLane);
    return board;
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

  selectTargets(board: Board, selectedLane: LaneType) {
    board.getAdjacentLanes(selectedLane).forEach((lane: Lane) => {
      lane.highlight = true;
    });
  }
}
