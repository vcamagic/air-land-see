import { Board } from '../../Board';
import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class Redeploy extends Card {
  constructor() {
    super(
      13,
      'Redeploy',
      4,
      LaneType.SEA,
      'Return 1 of your facedown cards to your hand. If you do, gain extra turn.',
      '/images/redeploy.jpg',
      CardEffect.INSTANT
    );
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
    let temp = board.getCardById(targetId as number);
    if (temp !== null && temp.playerOwned && temp.card.isFaceUp()!) {
      board.removeCardFromLane(targetId);
      board.addCardToPlayerHand(targetId);
    }
    board.clearHighlights();
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
