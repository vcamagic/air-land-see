import React, { useEffect, useRef } from 'react';
import { Lane } from '../models/Lane';
import { LaneDeployment } from '../models/LaneDeployment';
import { LaneType } from '../models/LaneType';
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
    <div className='flex flex-row-reverse relative'>
      {props.lane.playerCards.map((card) => (
        <div key={card.id}>
          <CardInLaneComponent
            card={card}
            left={true}
            right={
              props.lane.playerCards.findIndex((c) => c.id === card.id) * 200
            }
            zIndex={
              props.lane.playerCards.findIndex((c) => c.id === card.id) * 10
            }
          />
        </div>
      ))}
    </div>
  );

  const OpponentCardStack = () => (
    <div>
      {props.lane.opponentCards.map((card) => (
        <CardInLaneComponent
          key={card.id}
          card={card}
          left={false}
          right={
            props.lane.opponentCards.findIndex((c) => c.id === card.id) * 200
          }
          zIndex={
            props.lane.opponentCards.findIndex((c) => c.id === card.id) * 10
          }
        />
      ))}
    </div>
  );

  const DefaultTemplate = () => (
    <div className='w-full'>
      <div>
        <div
          className={`flex justify-center h-3vh text-white text-xl ${getBannerColor(
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
    props.updateClickedLane(props.lane);
  };
  const handleImproviseClick = () => {};

  const CanDeploy = () => (
    <div className='text-white w-full'>
      <div
        className={`flex justify-center h-3 text-white text-xl ${getBannerColor(
          props.lane.type
        )} relative w-full`}
      >
        <h1>{`- ${getLaneName(props.lane.type)} -`}</h1>
      </div>
      <div className='flex flex-row h-20 w-full'>
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
    <div className='text-white w-full'>
      <div
        className={`flex justify-center h-3 text-white text-xl ${getBannerColor(
          props.lane.type
        )} relative w-full`}
      >
        <h1>{`- ${getLaneName(props.lane.type)} -`}</h1>
      </div>
      <div className='flex flex-row h-20 w-full'>
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
    <div className='flex w-full h-23'>
      <div className='w-46%'>
        <PlayerCardStack />
      </div>
      <div className='w-8%'>
        <Template />
      </div>
      <div className='w-46%'>
        <OpponentCardStack />
      </div>
    </div>
  );
};
