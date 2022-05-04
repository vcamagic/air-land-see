import { Board } from '../Board';
import { Lane } from '../Lane';
import { LaneType } from '../LaneType';

export class Card {
  id!: number;
  name!: string;
  power!: number;
  type!: LaneType;
  protected faceUp!: boolean;
  highlight!: boolean;

  constructor(id: number, name: string, power: number, type: LaneType) {
    this.id = id;
    this.name = name;
    this.power = power;
    this.type = type;
    this.faceUp = false;
    this.highlight = false;
  }

  isFaceUp(): boolean {
    return this.faceUp;
  }

  flip(board: Board): void {
    this.faceUp = !this.faceUp;
  }

  highlightAvailableLanes(board: Board): void {
    board.lanes.forEach((lane: Lane) => {
      if (
        lane.type === this.type ||
        board.player.airdrop ||
        (board.player.aerodrome && this.power <= 3)
      ) {
        lane.highlight = true;
      }
    });
  }

  deploy(board: Board, selectedLane: LaneType): void {
    board.getLane(selectedLane).addPlayerCard(this);
  }

  improvise(board: Board, selectedLane: LaneType): void {
    this.faceUp = false;
    board.getLane(selectedLane).addPlayerCard(this);
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
