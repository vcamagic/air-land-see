import { LaneType } from '../LaneType';
import { Card } from './Card';
import { CardEffect } from './CardEffect';

export class Heavy extends Card {
  constructor(type: LaneType) {
    let name: string = '';
    let img: string = '';
    let description: string = '';
    switch (type) {
      case 1:
        name = 'Red Baron';
        img = '/images/red-baron.jpg';
        description = `He's flying higher, the king of the skies.`;
        break;
      case 2:
        name = 'Heavy Tanks';
        img = '/images/heavy-tanks.jpg';
        description = 'War is hell.';
        break;
      case 3:
        name = 'Bismark';
        img = '/images/bismarck.jpg';
        description = 'It was made to rule the waves across the 7 seas.';
        break;
    }
    super(type * 6 + 6, name, 6, type, description, img, CardEffect.NO_EFFECT);
  }
}
