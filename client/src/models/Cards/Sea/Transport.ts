import { Board } from '../../Board';
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
    this.selectTargets(board);
    super.deploy(board, selectedLane);
    return board;
  }

  executeEffect(
    board: Board,
    targetId?: number,
    selectedLane?: LaneType
  ): void {
    
  }

  selectTargets(board: Board): void {
   
  }
}
