import { Board } from '../Board';
import { Lane } from '../Lane';
import { LaneDeployment } from '../LaneDeployment';
import { LaneType } from '../LaneType';
import { CardEffect } from './CardEffect';
import { cloneDeep } from 'lodash';
export class Card {
  id!: number;
  name!: string;
  power!: number;
  type!: LaneType;
  faceUp!: boolean;
  highlight!: boolean;
  highlightChange!: boolean;
  description!: string;
  img!: string;
  effect!: CardEffect;

  constructor(
    id: number,
    name: string,
    power: number,
    type: LaneType,
    description: string,
    img: string,
    effect: CardEffect
  ) {
    this.id = id;
    this.name = name;
    this.power = power;
    this.type = type;
    this.faceUp = true;
    this.highlight = false;
    this.highlightChange = false;
    this.description = description;
    this.img = img;
    this.effect = effect;
  }

  isFaceUp(): boolean {
    return this.faceUp;
  }

  flip(board: Board): void {
    this.faceUp = !this.faceUp;
  }

  highlightAvailableLanes(board: Board): Board {
    board.lanes.forEach((lane: Lane) => {
      if (
        lane.type === this.type ||
        board.player.airdrop ||
        (board.player.aerodrome && this.power <= 3)
      ) {
        lane.laneDeploymentStatus = LaneDeployment.CAN_DEPLOY;
      } else {
        lane.laneDeploymentStatus = LaneDeployment.ONLY_IMPROVISE;
      }
    });

    return board;
  }

  deploy(board: Board, selectedLane: LaneType): Board {
    board.clearHighlights();
    if(board.survivesBlockade(selectedLane)){
      board.getLane(selectedLane).addPlayerCard(this);
      board.targeting = this.effect === CardEffect.INSTANT ? true : false;
    }
    board.player.airdrop = false;
    board.removeCardFromPlayerHand(this.id);
    return cloneDeep(board);
  }

  improvise(board: Board, selectedLane: LaneType): Board {
    this.faceUp = false;
    board.clearHighlights();
    if(board.survivesContainment() && board.survivesBlockade(selectedLane)){
      board.getLane(selectedLane).addPlayerCard(this);
    }
    board.removeCardFromPlayerHand(this.id);
    return cloneDeep(board);
  }

  executeEffect(
    board: Board,
    targetId?: number,
    selectedLane?: Lane
  ): void {}

  onDestroy(): void {}

  onTarget(): number {
    return this.id;
  }
}
