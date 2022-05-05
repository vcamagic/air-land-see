import { LaneType } from '../LaneType';
import { Card } from './Card';
import { CardEffect } from './CardEffect';

export class Redeploy extends Card {
  constructor() {
    super(
      13,
      'Redeploy',
      4,
      LaneType.SEA,
      'Return 1 of your facedown cards to your hand. If you do, gain extra turn.',
      '/images/redeploy.jpg',
      CardEffect.INSTANT
    );
  }
}
