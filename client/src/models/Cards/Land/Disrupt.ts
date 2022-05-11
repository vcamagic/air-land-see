import { Board } from '../../Board';
import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class Disrupt extends Card {
  constructor() {
    super(
      11,
      'Disrupt',
      5,
      LaneType.LAND,
      'Your opponent chooses and FLIPS 1 of their cards. Then you FLIP 1 of yours.',
      '/images/disrupt.jpg',
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
  ): void {}

  selectTargets(board: Board, selectedLane: LaneType) {}
}
