import { Board } from '../../Board';
import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class Redeploy extends Card {
  constructor() {
    super(
      16,
      'Redeploy',
      4,
      LaneType.SEA,
      'Return 1 of your facedown cards to your hand. If you do, gain extra turn.',
      '/images/redeploy.jpg',
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
    selectedLane?: LaneType
  ): Board {
    let temp = board.getCardById(targetId as number);
    if (temp !== null && temp.playerOwned && temp.card.isFaceUp()!) {
      board.removeCardFromLane(targetId);
      board.addCardToPlayerHand(targetId);
    }
    board.clearHighlights();
    board.targeting = false;
    return board;
  }

  selectTargets(board: Board): void {
    board.lanes.forEach((lane) => {
      lane.playerCards.forEach((card) => {
        if (card.isFaceUp()!) {
          card.highlight = true;
        }
      });
    });
  }
}
