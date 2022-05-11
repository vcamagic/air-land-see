import { Board } from '../../Board';
import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class Blockade extends Card {
  constructor() {
    super(
      17,
      'Blockade',
      5,
      LaneType.SEA,
      'If a card is played in an adjacent theater with 3 or more cards already in it (counting both players cards), DISCARD that card with no effect.',
      '/images/blockade.jpg',
      CardEffect.PERMANENT
    );
  }

  flip(board: Board): void {
    this.faceUp = !this.faceUp;
    if (this.isFaceUp()) {
      this.selectTargets(board);
    }
  }

  selectTargets(board: Board): void {}
}
