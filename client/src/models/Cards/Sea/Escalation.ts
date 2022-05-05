import { Board } from '../../Board';
import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class Escalation extends Card {
  constructor() {
    super(
      14,
      'Escalation',
      2,
      LaneType.SEA,
      'All of your facedown cards are now strength 4.',
      '/images/escalation.jpg',
      CardEffect.PERMANENT
    );
  }

  flip(board: Board): void {
    this.faceUp = !this.faceUp;
    if (this.isFaceUp()) {
      this.selectTargets(board);
    }
  }

  deploy(board: Board, selectedLane: LaneType): Board {
    this.selectTargets(board);
    super.deploy(board, selectedLane);
    return board;
  }

  executeEffect(
    board: Board,
    targetId?: number,
    selectedLane?: LaneType
  ): void {}

  selectTargets(board: Board): void {}
}
