import React from 'react';
import { Card } from '../models/Cards/Card';
import { CardComponent } from './CardComponent';
import { CardInLaneComponent } from './CardInLaneComponent';

interface HandComponentProps {
  cards: Card[];
  updateClickedCard: (card: Card) => void;
}

export const HandComponent = (props: HandComponentProps) => {
  return (
    <>
      <div className='flex justify-center flex-wrap'>
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
