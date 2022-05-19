import React from 'react';
import { Card } from '../models/Cards/Card';
import { CardComponent } from './CardComponent';

interface HandComponentProps {
  cards: Card[];
  updateClickedCard: (card: Card) => void;
}

export const HandComponent = (props: HandComponentProps) => {
  return (
    <>
      <div className='flex justify-between grow ml-4'>
        {props.cards.map((card) => (
          <CardComponent
            key={card.id}
            inHand={true}
            card={card}
            updateClickedCard={props.updateClickedCard}
          />
        ))}
      </div>
    </>
  );
};
