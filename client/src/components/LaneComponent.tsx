import React, { useContext } from 'react';
import BoardContext from '../contexts/BoardContext';
import { LaneType } from '../models/LaneType';
import { CardComponent } from './CardComponent';
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
