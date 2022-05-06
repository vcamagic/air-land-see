import { faBolt, faInfinity } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import BoardContext from '../contexts/BoardContext';
import { Card } from '../models/Cards/Card';
import { CardEffect } from '../models/Cards/CardEffect';
import { LaneType } from '../models/LaneType';
interface CardComponentProps {
  card: Card;
}

const getCardIcon = (cardEffect: CardEffect) => {
  switch (cardEffect) {
    case CardEffect.INSTANT:
      return <FontAwesomeIcon className='h-4 w-4' icon={faBolt} />;
    case CardEffect.PERMANENT:
      return <FontAwesomeIcon className='h-5 w-5' icon={faInfinity} />;
    case CardEffect.NO_EFFECT:
      return '';
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

export const CardComponent = (props: CardComponentProps) => {
  const { boardDispatch } = useContext(BoardContext);

  const handleOnClick = () => {
    boardDispatch({ type: 'CardDeployed', payload: { card: props.card } });
  };

  const FaceUpCard = () => (
    <div
      className={`m-3 ${props.card.highlight ? 'border-2 border-red-400' : ''}`}
      onClick={handleOnClick}
    >
      <div
        className={`flex justify-evenly ${getBannerColor(
          props.card.type
        )} p-2 max-w-247 min-h-145`}
      >
        <h1 className='text-7xl font-bold text-white mr-3'>
          {props.card.power}
        </h1>
        <div>
          <div className='flex justify-end'>
            <h1 className='text-2xl font-bold'>
              <span className='p-2'>{getCardIcon(props.card.effect)}</span>
              <span
                className={`${
                  props.card.name === 'Containment' ? 'text-xl' : ''
                }`}
              >
                {props.card.name}
              </span>
            </h1>
          </div>
          <p className='font-bold text-xs text-right'>
            {props.card.description}
          </p>
        </div>
      </div>
      <img src={props.card.img} alt='card' className='h-247 w-247' />
    </div>
  );

  const FaceDownCard = () => (
    <div className='w-247 h-392'>
      <img src='/images/face-down.png' alt='face-down' />
    </div>
  );

  return <>{props.card.isFaceUp() ? <FaceUpCard /> : <FaceDownCard />}</>;
};
