import { cloneDeep } from 'lodash';
import { Board } from '../../Board';
import { Lane } from '../../Lane';
import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class Disrupt extends Card {
  constructor() {
    super(
      11,
      'Disrupt',
      5,
      LaneType.LAND,
      'Your opponent chooses and FLIPS 1 of their cards. Then you FLIP 1 of yours.',
      '/images/disrupt.jpg',
      CardEffect.INSTANT
    );
  }

  flip(board: Board): void {
    this.faceUp = !this.faceUp;
    if (this.isFaceUp()) {
      let temp = board.getCardById(this.id);
      if (temp !== null) {
        board.disruptSteps = 0;
        this.selectTargets(board);
      }
    }
  }

  deploy(board: Board, selectedLane: LaneType): Board {
    board = super.deploy(board, selectedLane);
    const temp = board.getCardById(this.id);
      if (temp !== null && temp.card.isFaceUp()) {
        board.disruptSteps = 0;
      }
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
    console.log('executed disrupt effect')
    return cloneDeep(board);
  }

  selectTargets(board: Board): Board {
    board.targeting = false;
    const disrupt = board.getCardById(this.id);    
    let temp;
    board.lanes.forEach((lane: Lane) => {
      
      if(disrupt!==null && disrupt.playerOwned) {
        temp = lane.getLastOpponentCard();
      } else {
        temp = lane.getLastPlayerCard();
      }
      if (temp !== null) {
        temp.highlight = true;
        board.targeting = true;
      }
    });
    return cloneDeep(board);
  }

  selectTargetsNext(board: Board): Board {
    board.clearHighlights();
    const disrupt = board.getCardById(this.id);   
    let temp;
    board.lanes.forEach((lane: Lane) => {
      if(disrupt!==null && disrupt.playerOwned){
        temp = lane.getLastPlayerCard();
      } else {
        temp = lane.getLastOpponentCard();
      }
      if (temp !== null) {
        temp.highlight = true;
        board.targeting = true;
      }
    });
    return cloneDeep(board);
  }
}
