import React, { useContext } from 'react';
import BoardContext from '../contexts/BoardContext';
import { CardComponent } from './CardComponent';

export const BoardComponent = () => {
  const { boardState, boardDispatch } = useContext(BoardContext);

  console.log(boardState);
  return (
    <div>
      {boardState.deck.map((card) => (
        <CardComponent key={card.id} card={card} />
      ))}
    </div>
  );
};
