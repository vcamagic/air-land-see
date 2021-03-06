import { cloneDeep } from 'lodash';
import { Board } from '../../Board';
import { Lane } from '../../Lane';
import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class Reinforce extends Card {
  constructor() {
    super(
      7,
      'Reinforce',
      1,
      LaneType.LAND,
      'Place a facedown card from top of the deck in adjacent theater.',
      '/images/reinforcer.jpg',
      CardEffect.INSTANT
    );
  }

  flip(board: Board): void {
    this.faceUp = !this.faceUp;
    if (this.isFaceUp()) {
      let temp = board.getCardById(this.id);
      if (temp !== null) {
        board.targeting = true;
        this.selectTargets(board, temp.lane);
      }
    }
  }

  deploy(board: Board, selectedLane: LaneType): Board {
    board = super.deploy(board, selectedLane);
    return cloneDeep(board);
  }

  executeEffect(
    board: Board,
    targetId?: number,
    selectedLane?: Lane
  ): Board {
    let topDeck = board.deck.splice(board.deck.length - 1, 1)[0];  
    topDeck.faceUp = false;
    if(board.survivesBlockade((selectedLane as Lane).type) && board.survivesContainment()){
      (selectedLane as Lane).addPlayerCard(topDeck);
    } else {
      board.fizzledCard = topDeck;
    } 
    board.targeting = false; 
    board.clearHighlights();
    return cloneDeep(board);
  }

  selectTargets(board: Board, selectedLane: LaneType): Board {
    board.getAdjacentLanes(selectedLane).forEach((lane: Lane) => {
      lane.highlight = true;
    });
    return cloneDeep(board);
  }
}
