import React, { useContext } from 'react';
import BoardContext from '../contexts/BoardContext';
import { CardComponent } from './CardComponent';
import { LaneComponent } from './LaneComponent';

export const BoardComponent = () => {
  const { boardState, boardDispatch } = useContext(BoardContext);

  console.log(boardState);
  return (
    <div>
      <div className='flex justify-center flex-wrap'>
        {boardState.deck.map((card) => (
          <CardComponent key={card.id} card={card} />
        ))}
      </div>
      <LaneComponent />
    </div>
  );
};
