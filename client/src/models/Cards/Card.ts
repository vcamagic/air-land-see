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
  protected faceUp!: boolean;
  highlight!: boolean;
  description!: string;
  img!: string;
  effect!: CardEffect;
  targeting!: boolean;

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
    this.description = description;
    this.img = img;
    this.effect = effect;
    this.targeting = false;
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
    board.getLane(selectedLane).addPlayerCard(this);
    board.removeCardFromPlayerHand(this.id);
    board.clearHighlights();
    this.targeting = this.effect === CardEffect.INSTANT ? true : false;
    return cloneDeep(board);
  }

  improvise(board: Board, selectedLane: LaneType): void {
    this.faceUp = false;
    const containment = board.getCardById(5);
    if (containment === null) {
      board.getLane(selectedLane).addPlayerCard(this);
    }
  }

  executeEffect(
    board: Board,
    targetId?: number,
    selectedLane?: LaneType
  ): void {}

  onDestroy(): void {}

  onTarget(): number {
    return this.id;
  }
}
