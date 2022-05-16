import { LaneType } from '../../LaneType';
import { Card } from '../Card';
import { CardEffect } from '../CardEffect';

export class Escalation extends Card {
  constructor() {
    super(
      14,
      'Escalation',
      2,
      LaneType.SEA,
      'All of your facedown cards are now strength 4.',
      '/images/escalation.jpg',
      CardEffect.PERMANENT
    );
  }
}
