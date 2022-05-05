import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class CoverFire extends Card {
  constructor() {
    super(
      10,
      'Cover Fire',
      4,
      LaneType.LAND,
      'All cards COVERED by this card are now strength 4',
      '/images/cover-fire.jpg',
      CardEffect.PERMANENT
    );
  }
}
