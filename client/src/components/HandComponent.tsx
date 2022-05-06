import React, { useContext } from 'react';
import BoardContext from '../contexts/BoardContext';
import { CardComponent } from './CardComponent';

export const HandComponent = () => {
  const { boardState } = useContext(BoardContext);
  return (
    <div className='flex justify-center flex-wrap'>
      {boardState.player.hand.map((card) => (
        <CardComponent key={card.id} inHand={true} card={card} />
      ))}
    </div>
  );
};
