import { cloneDeep } from 'lodash';
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
      board = this.selectTargets(board);
    }
  }

  deploy(board: Board, selectedLane: LaneType): Board {
    board = super.deploy(board, selectedLane);
    const temp = board.getCardById(this.id);
    if(temp !== null && temp.card.isFaceUp()){
      this.selectTargets(board);
    } else {
      board.targeting = false;
    }
    return board;
  }

  executeEffect(
    board: Board,
    targetId?: number,
    selectedLane?: Lane
  ): Board {
    let temp = board.getCardById(targetId as number);
    if(temp!==null) {
      const originalLane = board.getLane(temp.lane);
      const index = originalLane.playerCards.findIndex(x=>x === temp?.card);
      originalLane.playerCards.splice(index,1);
      const  targetedLane = board.getLane((selectedLane as Lane).type);
      targetedLane.playerCards = [...targetedLane.playerCards, temp.card];
    }
    board.clearHighlights();
    board.targeting = false;
    return cloneDeep(board);
  }

  selectTargets(board: Board): Board {
    const playerOwned = board.getCardById(this.id)?.playerOwned;
    board.lanes.forEach((lane:Lane) => {
      if(playerOwned) {
        lane.playerCards.forEach((card:Card) => {
          card.highlight = true;
        });
      } else {
        lane.opponentCards.forEach((card:Card) => {
          card.highlight = true;
        });
      }
    });
    board.targeting = true;
    return cloneDeep(board);
  }

  selectLane(board: Board): Board {
    board.clearHighlights();
    board.targeting = true;
    board.lanes.forEach((lane:Lane) => {
      lane.highlight = true;
    });
    return cloneDeep(board);
  }
}
