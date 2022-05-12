import { cloneDeep } from 'lodash';
import { Board } from '../../Board';
import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class Aerodrome extends Card {
  constructor() {
    super(
      4,
      'Aerodrome',
      4,
      LaneType.AIR,
      'You may play cards of strength 3 or less to non-matching theaters.',
      '/images/aerodrome.jpg',
      CardEffect.PERMANENT
    );
  }

  deploy(board: Board, selectedLane: LaneType): Board {
    board = super.deploy(board, selectedLane);
    const temp = board.getCardById(this.id);
    if(temp !== null && temp.card.isFaceUp()){
      board.player.aerodrome = true;
    }
    return cloneDeep(board);
  }

  flip(board: Board): void {
    if(this.isFaceUp()) {
      board.player.aerodrome = false;
      board.opponent.aerodrome = false;
      this.faceUp = false;
    } else {
      const temp = board.getCardById(this.id);
      if(temp!==null) {
        if(temp.playerOwned) {
          board.player.aerodrome = true;
        } else {
          board.opponent.aerodrome = true;
        }
        this.faceUp = true;
      }
    }
  }
}
