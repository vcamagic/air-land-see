import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class Support extends Card {
  constructor() {
    super(
      1,
      'Support',
      1,
      LaneType.AIR,
      'You gain +3 strength in each adjacent theater.',
      '/images/support.jpg',
      CardEffect.PERMANENT
    );
  }
}
