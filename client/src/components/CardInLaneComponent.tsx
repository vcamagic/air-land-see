import { faBolt, faInfinity } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card } from '../models/Cards/Card';
import { CardEffect } from '../models/Cards/CardEffect';
import { LaneType } from '../models/LaneType';

const getCardIcon = (cardEffect: CardEffect) => {
  switch (cardEffect) {
    case CardEffect.INSTANT:
      return <FontAwesomeIcon className='h-4 w-4' icon={faBolt} />;
    case CardEffect.PERMANENT:
      return <FontAwesomeIcon className='h-4 w-4' icon={faInfinity} />;
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

interface CardInLaneComponentProps {
  card: Card;
  left: boolean;
  right: number;
  zIndex: number;
}

export const CardInLaneComponent = ({
  card,
  left,
  right,
  zIndex,
}: CardInLaneComponentProps) => {
  console.log(right);
  console.log(zIndex);
  const RightSide = () => (
    <div className={`flex ${card.highlight ? 'border-4 border-red-400' : ''}`}>
      <div className={`${getBannerColor(card.type)} w-200 h-200`}>
        <div className={`flex justify-center p-3`}>
          <h1 className='text-white text-3xl'>{card.power}</h1>
        </div>
        <div
          className={
            card.effect === CardEffect.PERMANENT
              ? 'flex justify-center text-white'
              : 'flex justify-center'
          }
        >
          <h1>
            <span className='mr-2'>{getCardIcon(card.effect)}</span>
            {card.name}
          </h1>
        </div>
        <div
          className={
            card.effect === CardEffect.PERMANENT
              ? 'text-center p-3 text-white'
              : 'text-center p-3'
          }
        >
          <p>{card.description}</p>
        </div>
      </div>
      <img src={card.img} alt='card' className='h-200 w-247' />
    </div>
  );

  const LeftSide = () => (
    <div
      className={`absolute flex h-23vh ${
        card.highlight ? 'border-4 border-red-400' : ''
      }`}
      style={{ right: right, zIndex: zIndex }}
    >
      <img src={card.img} alt='card' className=' w-247' />
      <div
        className={`${getBannerColor(card.type)} w-200 border-l-2 border-white`}
      >
        <div className={`flex justify-center pb-1`}>
          <h1 className='text-white text-2xl'>{card.power}</h1>
        </div>
        <div
          className={
            card.effect === CardEffect.PERMANENT
              ? 'flex justify-center text-white'
              : 'flex justify-center'
          }
        >
          <h1 className='font-bold'>
            <span className='mr-2'>{getCardIcon(card.effect)}</span>
            {card.name}
          </h1>
        </div>
        <div
          className={`
            ${
              card.effect === CardEffect.PERMANENT
                ? 'text-center text-white'
                : 'text-center'
            }
            ${card.name.toLowerCase() !== 'blockade' ? 'p-3' : 'p-3 text-sm'}
          `}
        >
          <p>{card.description}</p>
        </div>
      </div>
    </div>
  );
  return <>{left === true ? <LeftSide /> : <RightSide />}</>;
};
