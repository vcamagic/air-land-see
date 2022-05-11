import React from 'react';
import { Lane } from '../models/Lane';
import { LaneElementComponent } from './LaneElementComponent';

interface LaneComponentProps {
  lanes: Lane[];
  updateClickedLane: (lane: Lane) => void;
}

export const LaneComponent = (props: LaneComponentProps) => {
  return (
    <div className='flex flex-col'>
      {props.lanes.map((lane) => (
        <LaneElementComponent
          key={lane.type}
          lane={lane}
          updateClickedLane={props.updateClickedLane}
        />
      ))}
    </div>
  );
};
