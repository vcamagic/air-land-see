import React from 'react';
import { Card } from '../models/Cards/Card';
import { CardComponent } from './CardComponent';

interface HandComponentProps {
  cards: Card[];
}

export const HandComponent = (props: HandComponentProps) => {
  return (
    <div className='flex justify-center flex-wrap'>
      {props.cards.map((card) => (
        <CardComponent key={card.id} inHand={true} card={card} />
      ))}
    </div>
  );
};
