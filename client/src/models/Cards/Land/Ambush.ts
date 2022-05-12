import { Board } from '../../Board';
import { Lane } from '../../Lane';
import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

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
    this.selectTargets(board);
    return board;
  }

  selectTargets(board: Board) {
    board.lanes.forEach((lane: Lane) => {
      let temp = lane.getLastPlayerCard();
      console.log(temp)
      if (temp !== null) {
        temp.highlight = true;
      }
      temp = lane.getLastOpponentCard();
      if (temp !== null) {
        temp.highlight = true;
      }
    });
    console.log(board);
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
    return board;
  }
}
