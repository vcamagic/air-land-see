import { faBolt, faInfinity } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
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
      return 'bg-cyan-300';
    case LaneType.LAND:
      return 'bg-orange-500';
    case LaneType.SEA:
      return 'bg-emerald-300';
  }
};

interface CardComponentProps {
  card: Card;
  inHand: boolean;
  updateClickedCard: (card: Card) => void;
}

export const CardComponent = (props: CardComponentProps) => {
  const { updateBoardState, board } = useContext(WebSocketContext);
  
  const handleOnClick = () => {
    updateBoardState(props.card.highlightAvailableLanes(board));
    props.updateClickedCard(props.card);
  };


  const FaceUpCard = () => (
    <div
      className={`w-247 hover:cursor-pointer ${
        props.card.highlight ? 'border-2 border-red-400 ' : ''
      }`}
      onClick={props.inHand ? handleOnClick : () => {}}
    >
      <div className={`flex   ${getBannerColor(props.card.type)} p-2 h-2/5`}>
        <h1 className='text-5xl font-bold text-white mr-3'>
          {props.card.power}
        </h1>
        <div
          className={`${
            props.card.effect === CardEffect.PERMANENT ? 'text-white' : ''
          }`}
        >
          <div className='flex justify-end'>
            <h1 className='text-xl font-bold'>
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
      <img src={props.card.img} alt='card' className='h-3/5 w-full' />
    </div>
  );

  const FaceDownCard = () => (
    <div className='w-247 h-392'>
      <img src='/images/face-down.png' alt='face-down' />
    </div>
  );

  return <>{props.card.isFaceUp() ? <FaceUpCard /> : <FaceDownCard />}</>;
};
