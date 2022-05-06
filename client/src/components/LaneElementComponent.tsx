import React from 'react';
import { Lane } from '../models/Lane';
import { LaneType } from '../models/LaneType';
import { CardComponent } from './CardComponent';

const getLaneName = (type: LaneType) => {
  switch (type) {
    case LaneType.AIR:
      return 'AIR';
    case LaneType.LAND:
      return 'LAND';
    case LaneType.SEA:
      return 'SEA';
  }
};

const getBannerColor = (laneType: LaneType): string => {
  switch (laneType) {
    case LaneType.AIR:
      return 'bg-cyan-300';
    case LaneType.LAND:
      return 'bg-orange-500';
    case LaneType.SEA:
      return 'bg-emerald-300';
  }
};

interface LaneElementComponentInterface {
  lane: Lane;
}

export const LaneElementComponent = (props: LaneElementComponentInterface) => {
  return (
    <div className='p-3'>
      <div>
        <img
          src={`/images/${getLaneName(props.lane.type).toLowerCase()}.jpg`}
          alt='theater'
          className='h-200 w-247 absolute'
        />
        <div
          className={`flex justify-center p-2 text-white text-xl ${getBannerColor(
            props.lane.type
          )} relative w-247`}
        >
          <h1>{`- ${getLaneName(props.lane.type)} -`}</h1>
        </div>
      </div>
      <div className='z-50 relative w-247'>
        {props.lane.playerCards.map((card) => (
          <CardComponent key={card.id} inHand={false} card={card} />
        ))}
      </div>
    </div>
  );
};
