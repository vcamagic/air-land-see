import { faBolt, faInfinity } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card } from '../models/Cards/Card';
import { CardEffect } from '../models/Cards/CardEffect';
import { LaneType } from '../models/LaneType';
import { Board } from '../models/Board';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

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
  const cardInLaneClick = () => {
    if (board.targeting && card.highlight) {
      updateTargetedCard(card);
    }
  };

  const RightSide = () => (
    <div
      onClick={cardInLaneClick}
      className={`flex absolute  h-23vh ${
        card.highlight ? 'border-4 border-red-400' : ''
      }`}
      style={{ left: right, zIndex: zIndex }}
    >
      <div className={`${getBannerColor(card.type)} w-200`}>
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
          <p>{card.description}</p>
        </div>
      </div>
      <img src={card.img} alt='card' className='w-247' />
    </div>
  );

  const LeftSide = () => (
    <div
      onClick={cardInLaneClick}
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

  const FaceDownLeft = () => (
    <div
      onClick={cardInLaneClick}
      className={`absolute flex h-23vh ${
        card.highlight ? 'border-4 border-red-400' : ''
      }`}
      style={{ right: right, zIndex: zIndex }}
    >
      {/* <Tippy content={<LeftSide />}> */}
      <img
        src='/images/face-down.png'
        alt='face down card'
        className='h-23vh'
      ></img>
      {/* </Tippy> */}
    </div>
  );

  const FaceDownRight = () => (
    <div
      onClick={cardInLaneClick}
      className={`absolute flex h-23vh ${
        card.highlight ? 'border-4 border-red-400' : ''
      }`}
      style={{ left: right, zIndex: zIndex }}
    >
      <img
        src='/images/face-down-right.png'
        alt='face down card'
        className='h-23vh'
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
