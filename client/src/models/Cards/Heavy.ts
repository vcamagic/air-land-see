import { LaneType } from '../LaneType';
import { Card } from './Card';
import { CardEffect } from './CardEffect';

export class Heavy extends Card {
  constructor(type: LaneType) {
    let name: string = '';
    let img: string = '';
    switch (type) {
      case 1:
        name = 'Red Baron';
        img = '/images/red-baron.jpg';
        break;
      case 2:
        name = 'Heavy Tanks';
        img = '/images/heavy-tanks.jpg';
        break;
      case 3:
        name = 'Bismark';
        img = '/images/bismarck.jpg';
        break;
    }
    super(type * 6 + 6, name, 6, type, '', img, CardEffect.NO_EFFECT);
  }
}
