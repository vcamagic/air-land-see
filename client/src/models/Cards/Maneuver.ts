import { Board } from '../Board';
import { Lane } from '../Lane';
import { LaneType } from '../LaneType';
import { Card } from './Card';
import { CardEffect } from './CardEffect';

export class Maneuver extends Card {
  constructor(type: LaneType) {
    let id: number = 0;
    switch (type) {
      case LaneType.AIR:
        id = 3;
        break;
      case LaneType.LAND:
        id = 9;
        break;
      case LaneType.SEA:
        id = 15;
        break;
    }
    super(
      id,
      'Maneuver',
      3,
      type,
      'FLIP a card in an adjacent theater.',
      '/images/manuever.jpg',
      CardEffect.INSTANT
    );
  }

  deploy(board: Board, selectedLane: LaneType): Board {
    board = super.deploy(board, selectedLane);
    this.selectTargets(board, selectedLane);
    return board;
  }

  flip(board: Board): void {
    this.faceUp = !this.faceUp;
    if (this.faceUp) {
      let temp = board.getCardById(this.id);
      if (temp !== null) {
        this.selectTargets(board, temp.lane);
      }
    }
  }

  executeEffect(
    board: Board,
    targetId?: number,
    selectedLane?: LaneType
  ): void {
    let temp = board.getCardById(targetId as number);
    if (temp !== null) {
      temp.card.flip(board);
    }
    board.clearHighlights();
  }

  selectTargets(board: Board, selectedLane: LaneType): void {
    board.getAdjacentLanes(selectedLane).forEach((lane: Lane) => {
      let temp = lane.getLastPlayerCard();
      console.log(temp);
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
}
