import React from 'react';
import { Lane } from '../models/Lane';
import { LaneDeployment } from '../models/LaneDeployment';
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
  updateClickedLane: (lane: Lane) => void;
}

export const LaneElementComponent = (props: LaneElementComponentInterface) => {
  const CardStack = () => (
    <div className='z-50 relative w-247'>
      {props.lane.playerCards.map((card) => (
        <CardComponent
          key={card.id}
          inHand={false}
          card={card}
          updateClickedCard={() => {}}
        />
      ))}
    </div>
  );

  const DefaultTemplate = () => (
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
      <CardStack />
    </div>
  );

  const handleDeployClick = () => {
    props.updateClickedLane(props.lane);
  };
  const handleImproviseClick = () => {};

  const CanDeploy = () => (
    <div className='p-3'>
      <div className='flex-row h-200 w-247'>
        <div className='flex 1' onClick={handleDeployClick}>
          <h1>DEPLOY</h1>
        </div>
        <div className='flex-1' onClick={handleImproviseClick}>
          <h1>IMPROVISE</h1>
        </div>
      </div>
      <CardStack />
    </div>
  );

  const OnlyImprovise = () => (
    <div className='p-3'>
      <div className='flex-row h-200 w-247'>
        <div className='flex-1'>
          <h1>IMPROVISE</h1>
        </div>
      </div>
      <CardStack />
    </div>
  );

  let Template;
  switch (props.lane.laneDeploymentStatus) {
    case LaneDeployment.CAN_DEPLOY:
      Template = CanDeploy;
      break;
    case LaneDeployment.ONLY_IMPROVISE:
      Template = OnlyImprovise;
      break;
    default:
      Template = DefaultTemplate;
      break;
  }

  return <Template />;
};
