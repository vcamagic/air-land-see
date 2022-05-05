import React, { useContext } from 'react';
import BoardContext from '../contexts/BoardContext';
import { CardComponent } from './CardComponent';

export const LaneComponent = () => {
  const { boardState, boardDispatch } = useContext(BoardContext);
  return (
    <>
      <h1>LANE</h1>
      {boardState.lanes.map((lane) =>
        lane.playerCards.map((card) => (
          <CardComponent key={card.id} card={card} />
        ))
      )}
    </>
  );
};
