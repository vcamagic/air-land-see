import React from 'react';
import { Board } from '../models/Board';
import { Card } from '../models/Cards/Card';
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
      return 'bg-sky-300';
    case LaneType.LAND:
      return 'bg-orange-300';
    case LaneType.SEA:
      return 'bg-teal-500';
  }
};

interface LaneElementComponentInterface {
  board: Board;
  lane: Lane;
  updateTargetedCard: (card: Card) => void;
  updateClickedLane: (lane: Lane, deploy?: boolean) => void;
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
              props.lane.playerCards.findIndex((c) => c.id === card.id) * 180
            }
            zIndex={
              props.lane.playerCards.findIndex((c) => c.id === card.id) * 10
            }
            updateTargetedCard={props.updateTargetedCard}
            board={props.board}
          />
        </div>
      ))}
    </div>
  );

  const OpponentCardStack = () => (
    <div className='flex flex-row-reverse relative'>
      {props.lane.opponentCards.map((card) => (
        <CardInLaneComponent
          key={card.id}
          card={card}
          left={false}
          right={
            props.lane.opponentCards.findIndex((c) => c.id === card.id) * 180
          }
          zIndex={
            props.lane.opponentCards.findIndex((c) => c.id === card.id) * 10
          }
          updateTargetedCard={props.updateTargetedCard}
          board={props.board}
        />
      ))}
    </div>
  );

  const DefaultTemplate = () => (
    <div className='w-full' onClick={handleLaneSelection}>
      <div>
        <div
          className={`flex justify-center h-3vh text-white text-xl ${getBannerColor(
            props.lane.type
          )}  w-full`}
        >
          <h1>{`${props.lane.playerScore} - ${getLaneName(props.lane.type)} - ${
            props.lane.opponentScore
          }`}</h1>
        </div>
        <img
          src={`/images/${getLaneName(props.lane.type).toLowerCase()}.jpg`}
          alt='theater'
          className={`h-20 w-full object-cover ${
            props.lane.type === LaneType.LAND ? 'object-bottom' : 'object-left'
          }`}
        />
      </div>
    </div>
  );

  const handleDeployClick = () => {
    if (!props.board.targeting) {
      props.updateClickedLane(props.lane, true);
    }
  };

  const handleImproviseClick = () => {
    if (!props.board.targeting) {
      props.updateClickedLane(props.lane, false);
    }
  };

  const handleLaneSelection = () => {
    if (props.board.targeting) {
      props.updateClickedLane(props.lane);
    }
  };

  const CanDeploy = () => (
    <div className='text-white w-full cursor-default'>
      <div
        className={`flex justify-center h-3vh text-white text-xl ${getBannerColor(
          props.lane.type
        )} relative w-full`}
      >
        <h1>{`${props.lane.playerScore} - ${getLaneName(props.lane.type)} - ${
          props.lane.opponentScore
        }`}</h1>
      </div>
      <div className='flex flex-col h-20 w-full hover:cursor-pointer'>
        <div
          className='flex flex-1 bg-green-600 grid place-items-center text-sm'
          onClick={handleDeployClick}
        >
          <h1>DEPLOY</h1>
        </div>
        <div
          className='flex flex-1 bg-gray-700 grid place-items-center hover:cursor-pointer text-sm'
          onClick={handleImproviseClick}
        >
          IMPROVISE
        </div>
      </div>
    </div>
  );

  const OnlyImprovise = () => (
    <div className='cursor-default text-white w-full'>
      <div
        className={`flex justify-center h-3vh text-white text-xl ${getBannerColor(
          props.lane.type
        )} relative w-full`}
      >
        <h1>{`${props.lane.playerScore} - ${getLaneName(props.lane.type)} - ${
          props.lane.opponentScore
        }`}</h1>
      </div>
      <div className='flex flex-row h-20 w-full'>
        <div
          className='flex flex-1 bg-gray-700 grid place-items-center text-sm hover:cursor-pointer'
          onClick={handleImproviseClick}
        >
          IMPROVISE
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
    <div className='flex w-full h-21 my-0.5'>
      <div className='w-46%'>
        <PlayerCardStack />
      </div>
      <div
        className={`w-8% mx-0.5 rounded overflow-hidden cursor-default ${
          props.lane.highlight
            ? 'outline outline-4 outline-red-600 hover:cursor-pointer'
            : ''
        } `}
      >
        <Template />
      </div>
      <div className='w-46%'>
        <OpponentCardStack />
      </div>
    </div>
  );
};
