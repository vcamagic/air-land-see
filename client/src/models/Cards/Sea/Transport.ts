import { Board } from '../../Board';
import { Lane } from '../../Lane';
import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class Transport extends Card {
  constructor() {
    super(
      13,
      'Transport',
      1,
      LaneType.SEA,
      'You may MOVE 1 of your cards to a different theater.',
      '/images/transport.jpg',
      CardEffect.INSTANT
    );
  }

  flip(board: Board): void {
    this.faceUp = !this.faceUp;
    if (this.isFaceUp()) {
      this.selectTargets(board);
    }
  }

  deploy(board: Board, selectedLane: LaneType): Board {
    board = super.deploy(board, selectedLane);
    this.selectTargets(board);
    return board;
  }

  executeEffect(
    board: Board,
    targetId?: number,
    selectedLane?: Lane
  ): void {}

  selectTargets(board: Board): void {}
}
