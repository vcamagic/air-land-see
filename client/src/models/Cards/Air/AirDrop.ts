import { cloneDeep } from 'lodash';
import { Board } from '../../Board';
import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class AirDrop extends Card {
  constructor() {
    super(
      2,
      'Air Drop',
      2,
      LaneType.AIR,
      'On your next turn, you may play a card to a non-matching theater.',
      '/images/air-drop.jpg',
      CardEffect.INSTANT
    );
  }

  deploy(board: Board, selectedLane: LaneType): Board {
    board = super.deploy(board,selectedLane);
    const temp = board.getCardById(this.id);
    if(temp !== null && temp.card.isFaceUp()){
      board.player.airdrop = true;
    }
    board.targeting = false;
    return cloneDeep(board);
  }

  flip(board: Board): void {
    if(this.isFaceUp()) {
      board.player.airdrop = false;
      board.opponent.airdrop = false;
      this.faceUp = false;
    } else {
      const temp = board.getCardById(this.id);
      if(temp!==null) {
        if(temp.playerOwned) {
          board.player.airdrop = true;
        } else {
          board.opponent.airdrop = true;
        }
        this.faceUp = true;
      }
    }
  }
}
