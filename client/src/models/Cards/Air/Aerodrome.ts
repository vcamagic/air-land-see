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
      'On your next turn, you may play a card to a non-matching theater.',
      '/images/aerodrome.jpg',
      CardEffect.PERMANENT
    );
  }
}
