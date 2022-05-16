import { cloneDeep } from 'lodash';
import { Board } from '../../Board';
import { Lane } from '../../Lane';
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
      board.targeting = true;
      this.selectTargets(board);
    }
  }

  deploy(board: Board, selectedLane: LaneType): Board {
    board = super.deploy(board, selectedLane);
    const temp = board.getCardById(this.id);
    if(temp !== null && temp.card.isFaceUp()) {
      this.selectTargets(board);
    } else {
      board.targeting = false;
    }
    return board;
  }

  executeEffect(board: Board, targetId?: number, selectedLane?: Lane): Board {
    let temp = board.getCardById(targetId as number);
    if (temp !== null && temp.playerOwned && !temp.card.isFaceUp()) {
      board.addCardToPlayerHand(targetId);
      board.removeCardFromLane(targetId);
    }
    board.clearHighlights();
    board.targeting = false;
    console.log('REDEPLOY', board);
    return cloneDeep(board);
  }

  selectTargets(board: Board): Board {
    const playerOwned = board.getCardById(this.id)?.playerOwned;
    board.lanes.forEach((lane) => {
      if (playerOwned) {
        lane.playerCards.forEach((card) => {
          if (!card.isFaceUp()) {
            card.highlight = true;
            board.targeting = true;
          }
        });
      } else {
        lane.opponentCards.forEach((card) => {
          if (!card.isFaceUp()) {
            card.highlight = true;
            board.targeting = true;
          }
        });
      }
    });
    return cloneDeep(board);
  }
}
