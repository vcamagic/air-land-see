import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class Aerodrome extends Card {
  constructor() {
    super(
      4,
      'Aerodrome',
      4,
      LaneType.AIR,
      'You may play cards of strength 3 or less to non-matching theaters.',
      '/images/aerodrome.jpg',
      CardEffect.PERMANENT
    );
  }
}
