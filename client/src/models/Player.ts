import { Card } from './Cards/Card';

export class Player {
  connectionId!: string;
  hand!: Card[];
  score!: number;
  aerodrome!: boolean;
  airdrop!: boolean;

  constructor() {
    this.hand = [];
    this.score = 0;
    this.aerodrome = false;
    this.airdrop = false;
  }
}
