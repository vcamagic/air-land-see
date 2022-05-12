import { Board } from '../../Board';
import { Lane } from '../../Lane';
import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';
import { cloneDeep } from 'lodash';

export class Ambush extends Card {
  constructor() {
    super(
      8,
      'Ambush',
      2,
      LaneType.LAND,
      'FLIP a card in any theater.',
      '/images/ambush.jpg',
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
    const temp = board.getCardById(this.id);
    if(temp !== null && temp.card.isFaceUp()){
      this.selectTargets(board);
    }
    return board;
  }

  selectTargets(board: Board) {
    board.lanes.forEach((lane: Lane) => {
      let temp = lane.getLastPlayerCard();
      if (temp !== null) {
        temp.highlight = true;
      }
      temp = lane.getLastOpponentCard();
      if (temp !== null) {
        temp.highlight = true;
      }
    });
  }

  executeEffect(
    board: Board,
    targetId?: number,
    selectedLane?: LaneType
  ): Board {
    let temp = board.getCardById(targetId as number);
    if (temp !== null) {
      temp.card.flip(board);
    }
    board.clearHighlights();
    board.targeting = false;
    return cloneDeep(board);
  }
}
