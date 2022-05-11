import React from 'react';
import { Lane } from '../models/Lane';
import { LaneDeployment } from '../models/LaneDeployment';
import { LaneType } from '../models/LaneType';
import { CardComponent } from './CardComponent';
import { CardInLaneComponent } from './CardInLaneComponent';

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
  const PlayerCardStack = () => (
    <div className='flex flex-row-reverse'>
      {props.lane.playerCards.map((card) => (
        <CardInLaneComponent key={card.id} card={card} left={true} />
      ))}
    </div>
  );

  const OpponentCardStack = () => (
    <div>
      {props.lane.opponentCards.map((card) => (
        <CardInLaneComponent key={card.id} card={card} left={false} />
      ))}
    </div>
  );

  const DefaultTemplate = () => (
    <div className='h-full w-full'>
      <div>
        <div
          className={`flex justify-center h-5 p-2 text-white text-xl ${getBannerColor(
            props.lane.type
          )}  w-full`}
        >
          <h1>{`- ${getLaneName(props.lane.type)} -`}</h1>
        </div>
        <img
          src={`/images/${getLaneName(props.lane.type).toLowerCase()}.jpg`}
          alt='theater'
          className='h-20 w-full'
        />
      </div>
    </div>
  );

  const handleDeployClick = () => {
    console.log('jidjasid');
    props.updateClickedLane(props.lane);
  };
  const handleImproviseClick = () => {};

  const CanDeploy = () => (
    <div className='p-3 text-white h-full w-full'>
      <div
        className={`flex justify-center p-2 text-white text-xl ${getBannerColor(
          props.lane.type
        )} relative w-full`}
      >
        <h1>{`- ${getLaneName(props.lane.type)} -`}</h1>
      </div>
      <div className='flex flex-row h-full w-full'>
        <div
          className='flex flex-1 bg-green-600 grid place-items-center'
          onClick={handleDeployClick}
        >
          <h1>DEPLOY</h1>
        </div>
        <div
          className='flex flex-1 bg-gray-700 grid place-items-center'
          onClick={handleImproviseClick}
        >
          <h1>IMPROVISE</h1>
        </div>
      </div>
    </div>
  );

  const OnlyImprovise = () => (
    <div className='p-3 text-white h-56 w-80'>
      <div
        className={`flex justify-center p-2 text-white text-xl ${getBannerColor(
          props.lane.type
        )} relative w-full`}
      >
        <h1>{`- ${getLaneName(props.lane.type)} -`}</h1>
      </div>
      <div className='flex flex-row h-full w-full'>
        <div
          className='flex flex-1 bg-gray-700 grid place-items-center'
          onClick={handleImproviseClick}
        >
          <h1>IMPROVISE</h1>
        </div>
      </div>
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

  return (
    <div className='flex w-full h-25'>
      <div className='w-2/5'>
        <PlayerCardStack />
      </div>
      <div className='w-1/5'>
        <Template />
      </div>
      <div className='w-2/5'>
        <OpponentCardStack />
      </div>
    </div>
  );
};
