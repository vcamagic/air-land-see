import { CardEffect } from './Cards/CardEffect';
import { LaneType } from './LaneType';

export class ServerCard {
  id!: number;
  name!: string;
  power!: number;
  type!: LaneType;
  highlight!: boolean;
  description!: string;
  img!: string;
  effect!: CardEffect;
}
