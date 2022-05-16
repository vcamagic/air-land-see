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
      board.targeting = true;
      this.selectTargets(board);
    }
  }

  deploy(board: Board, selectedLane: LaneType): Board {
    board = super.deploy(board, selectedLane);
    return board;
  }

  selectTargets(board: Board): Board {
    board.lanes.forEach((lane: Lane) => {
      let temp = lane.getLastPlayerCard();
      if (temp !== null) {
        temp.highlight = true;
        board.targeting = true;
      }
      temp = lane.getLastOpponentCard();
      if (temp !== null) {
        temp.highlight = true;
        board.targeting = true;
      }
    });
    return cloneDeep(board);
  }

  executeEffect(
    board: Board,
    targetId?: number,
    selectedLane?: Lane
  ): Board {
    board.clearHighlights();
    board.targeting = false;
    let temp = board.getCardById(targetId as number);
    if (temp !== null) {
      temp.card.flip(board);
    }
    return cloneDeep(board);
  }
}
