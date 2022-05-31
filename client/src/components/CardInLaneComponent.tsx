import { faBolt, faInfinity } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import 'tippy.js/dist/tippy.css'; // optional
import { Board } from '../models/Board';
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
      return 'bg-sky-300';
    case LaneType.LAND:
      return 'bg-orange-300';
    case LaneType.SEA:
      return 'bg-teal-500';
  }
};

const getBorderColor = (laneType: LaneType): string => {
  switch (laneType) {
    case LaneType.AIR:
      return 'bg-sky-200';
    case LaneType.LAND:
      return 'border-orange-200';
    case LaneType.SEA:
      return 'border-teal-400';
  }
};

interface CardInLaneComponentProps {
  board: Board;
  card: Card;
  left: boolean;
  right: number;
  zIndex: number;
  updateTargetedCard: (card: Card) => void;
}

export const CardInLaneComponent = ({
  board,
  card,
  left,
  updateTargetedCard,
  right,
  zIndex,
}: CardInLaneComponentProps) => {
  const [mouseOver, setMouseOver] = useState(false);
  const mouseIn = useRef(false);

  const cardInLaneClick = () => {
    if (board.targeting && card.highlight) {
      updateTargetedCard(card);
    }
  };

  const handleOnMouseOver = () => {
    mouseIn.current = true;
    setTimeout(() => {
      if (mouseIn.current) setMouseOver(true);
    }, 750);
  };

  const handleOnMouseOut = () => {
    mouseIn.current = false;
    setMouseOver(false);
  };

  const RightSide = () => (
    <div
      onClick={cardInLaneClick}
      className={`flex absolute h-23vh rounded overflow-hidden border-4 ${getBannerColor(
        card.type
      )} ${
        card.highlight
          ? 'border-red-600 hover:cursor-pointer'
          : card.highlightChange
          ? 'border-indigo-600'
          : getBorderColor(card.type)
      }`}
      style={{ left: right, zIndex: zIndex }}
    >
      <div
        className={`${getBannerColor(
          card.type
        )} w-180 border-r-2 border-white text-white font-bold`}
      >
        <div className={`flex justify-center p-1`}>
          <h1 className='text-white text-4xl mt-2'>{card.power}</h1>
        </div>
        <div className='flex justify-center'>
          <h1 className='text-xl'>
            <span className='mr-2'>{getCardIcon(card.effect)}</span>
            {card.name}
          </h1>
        </div>
        <div className='text-center p-3 text-xs'>{card.description}</div>
      </div>
      <img src={card.img} alt='card' className='w-180 object-cover' />
    </div>
  );

  const LeftSide = () => (
    <div
      onClick={cardInLaneClick}
      className={`absolute flex h-23vh rounded overflow-hidden border-4 ${getBannerColor(
        card.type
      )} ${
        card.highlight
          ? 'border-red-600 hover:cursor-pointer'
          : card.highlightChange
          ? 'border-indigo-600'
          : getBorderColor(card.type)
      }`}
      style={{ right: right, zIndex: zIndex }}
    >
      <img src={card.img} alt='card' className='w-180 object-cover' />
      <div
        className={`${getBannerColor(
          card.type
        )} w-180 border-l-2 border-white text-white font-bold`}
      >
        <div className={`flex justify-center pb-1`}>
          <h1 className='text-white text-4xl mt-2'>{card.power}</h1>
        </div>
        <div className='flex justify-center'>
          <h1 className='text-xl'>
            <span className='mr-2'>{getCardIcon(card.effect)}</span>
            {card.name}
          </h1>
        </div>
        <div className='text-center p-3 text-xs'>{card.description}</div>
      </div>
    </div>
  );

  const FaceDownLeft = () =>
    mouseOver ? (
      <div onMouseLeave={handleOnMouseOut}>
        <LeftSide />
      </div>
    ) : (
      <div
        onMouseOver={handleOnMouseOver}
        onMouseLeave={handleOnMouseOut}
        onClick={cardInLaneClick}
        className={`absolute flex h-23vh rounded overflow-hidden border-4 ${getBannerColor(
          card.type
        )} ${
          card.highlight
            ? 'border-red-600 hover:cursor-pointer'
            : card.highlightChange
            ? 'border-indigo-600'
            : 'border-emerald-300'
        }`}
        style={{ right: right, zIndex: zIndex }}
      >
        {/* <Tippy content={<LeftSide />}> */}
        <img
          src='/images/face-down.png'
          alt='face down card'
          className='h-23vh w-360'
        ></img>
        {/* </Tippy> */}
      </div>
    );

  const FaceDownRight = () => (
    <div
      onClick={cardInLaneClick}
      className={`absolute flex h-23vh rounded overflow-hidden border-4 ${getBannerColor(
        card.type
      )} ${
        card.highlight
          ? 'border-red-600 hover:cursor-pointer'
          : card.highlightChange
          ? 'border-indigo-600'
          : 'border-emerald-300'
      }`}
      style={{ left: right, zIndex: zIndex }}
    >
      <img
        src='/images/face-down-right.png'
        alt='face down card'
        className='h-23vh w-360'
      ></img>
    </div>
  );
  if (card.isFaceUp()) {
    if (left) {
      return <LeftSide />;
    } else {
      return <RightSide />;
    }
  } else {
    if (left) {
      return <FaceDownLeft />;
    }
  }
  return <FaceDownRight />;
};
