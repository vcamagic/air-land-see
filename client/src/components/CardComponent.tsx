import { faBolt, faInfinity } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Card } from '../models/Cards/Card';
import { CardEffect } from '../models/Cards/CardEffect';
import { LaneType } from '../models/LaneType';
import WebSocketContext from '../websockets/WebSocketContext';

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
      return 'bg-sky-400';
    case LaneType.LAND:
      return 'bg-amber-600';
    case LaneType.SEA:
      return 'bg-teal-700';
  }
};

interface CardComponentProps {
  card: Card;
  updateClickedCard: (card: Card) => void;
}

export const CardComponent = (props: CardComponentProps) => {
  const { updateBoardState, board, playerTurn } = useContext(WebSocketContext);

  const handleOnClick = () => {
    if (!playerTurn) {
      return;
    }
    updateBoardState(props.card.highlightAvailableLanes(board));
    props.updateClickedCard(props.card);
  };

  const FaceUpCard = () => (
    <div
      className={`w-220 h-full rounded overflow-hidden ${
        playerTurn ? 'hover:cursor-pointer' : 'hover:cursor-default'
      } ${props.card.highlight ? 'border-2 border-red-600 ' : ''}`}
      onClick={handleOnClick}
    >
      <div
        className={`flex ${getBannerColor(
          props.card.type
        )} p-2 h-2/5 text-white`}
      >
        <h1 className='text-5xl font-bold mr-3'>{props.card.power}</h1>
        <div className='flex-1'>
          <div className='flex justify-end'>
            <h1 className='text-xl font-bold text-right'>
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
      <img
        src={props.card.img}
        alt='card'
        className='h-3/5 w-full object-cover'
      />
    </div>
  );

  return <FaceUpCard />;
};
