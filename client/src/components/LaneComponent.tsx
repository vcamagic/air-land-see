import React, { useContext } from 'react';
import BoardContext from '../contexts/BoardContext';
import { LaneElementComponent } from './LaneElementComponent';

export const LaneComponent = () => {
  const { boardState } = useContext(BoardContext);

  return (
    <>
      {boardState.lanes.map((lane) => (
        <LaneElementComponent key={lane.type} lane={lane} />
      ))}
    </>
  );
};
