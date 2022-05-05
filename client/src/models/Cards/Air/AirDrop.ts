import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class AirDrop extends Card {
  constructor() {
    super(
      2,
      'Air Drop',
      2,
      LaneType.AIR,
      'On your next turn, you may play a card to a non-matching theater.',
      '/images/air-drop.jpg',
      CardEffect.INSTANT
    );
  }
}
