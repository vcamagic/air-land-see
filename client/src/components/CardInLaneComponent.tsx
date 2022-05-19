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
      return 'bg-cyan-300';
    case LaneType.LAND:
      return 'bg-orange-500';
    case LaneType.SEA:
      return 'bg-emerald-300';
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
      className={`flex absolute  h-23vh ${
        card.highlight ? 'border-4 border-red-400 hover:cursor-pointer' : ''
      }`}
      style={{ left: right, zIndex: zIndex }}
    >
      <div
        className={`${getBannerColor(card.type)} w-180 border-r-2 border-white`}
      >
        <div className={`flex justify-center p-1`}>
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
          className={
            card.effect === CardEffect.PERMANENT
              ? 'text-center p-3 text-white'
              : 'text-center p-3'
          }
        >
          <p className='text-xs'>{card.description}</p>
        </div>
      </div>
      <img src={card.img} alt='card' className='w-200' />
    </div>
  );

  const LeftSide = () => (
    <div
      onClick={cardInLaneClick}
      className={`absolute flex h-23vh ${
        card.highlight ? 'border-4 border-red-400 hover:cursor-pointer' : ''
      }`}
      style={{ right: right, zIndex: zIndex }}
    >
      <img src={card.img} alt='card' className=' w-200' />
      <div
        className={`${getBannerColor(card.type)} w-180 border-l-2 border-white`}
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
          <p className='text-xs'>{card.description}</p>
        </div>
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
        className={`absolute flex h-23vh ${
          card.highlight ? 'border-4 border-red-400 hover:cursor-pointer' : ''
        }`}
        style={{ right: right, zIndex: zIndex }}
      >
        {/* <Tippy content={<LeftSide />}> */}
        <img
          src='/images/face-down.png'
          alt='face down card'
          className='h-23vh w-380'
        ></img>
        {/* </Tippy> */}
      </div>
    );

  const FaceDownRight = () => (
    <div
      onClick={cardInLaneClick}
      className={`absolute flex h-23vh ${
        card.highlight ? 'border-4 border-red-400 hover:cursor-pointer' : ''
      }`}
      style={{ left: right, zIndex: zIndex }}
    >
      <img
        src='/images/face-down-right.png'
        alt='face down card'
        className='h-23vh w-380'
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
