import React, { useContext } from 'react';
import { Card } from '../../models/Cards/Card';
import WebSocketContext from '../../websockets/WebSocketContext';
import { CardComponent } from './CardComponent';

interface HandComponentProps {
  cards: Card[];
  updateClickedCard: (card: Card) => void;
}

export const HandComponent = (props: HandComponentProps) => {
  const { disableInput } = useContext(WebSocketContext);
  return (
    <div
      className={`flex justify-around grow ${
        disableInput ? 'pointer-events-none' : ''
      }`}
    >
      {props.cards.map((card) => (
        <CardComponent
          key={card.id}
          card={card}
          updateClickedCard={props.updateClickedCard}
        />
      ))}
    </div>
  );
};
