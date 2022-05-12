import React from 'react';
import { Board } from '../models/Board';
import { Card } from '../models/Cards/Card';
import { Lane } from '../models/Lane';
import { LaneElementComponent } from './LaneElementComponent';

interface LaneComponentProps {
  board: Board;
  updateClickedLane: (lane: Lane) => void;
  updateTargetedCard: (card: Card) => void;
}

export const LaneComponent = (props: LaneComponentProps) => {
  return (
    <div className='w-full flex-col'>
      {props.board.lanes.map((lane) => (
        <LaneElementComponent
          board={props.board}
          key={lane.type}
          lane={lane}
          updateTargetedCard={props.updateTargetedCard}
          updateClickedLane={props.updateClickedLane}
        />
      ))}
    </div>
  );
};
