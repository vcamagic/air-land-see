import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class Containment extends Card {
  constructor() {
    super(
      5,
      'Containment',
      5,
      LaneType.AIR,
      'If either player plays a card facedown, DISCARD that card with no effect.',
      '/images/containment.jpg',
      CardEffect.PERMANENT
    );
  }
}
