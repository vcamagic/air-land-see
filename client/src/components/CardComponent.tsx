import React, { useContext } from 'react';
import { Card } from '../models/Cards/Card';
import { CardEffect } from '../models/Cards/CardEffect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfinity, faBolt } from '@fortawesome/free-solid-svg-icons';
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

export const CardComponent = (props: CardComponentProps) => {
  const FaceUpCard = () => (
    <div className='m-3'>
      <div className='flex justify-evenly bg-orange-500 p-2 max-w-237 min-h-120'>
        <h1 className='text-7xl font-bold text-white mr-3'>
          {props.card.power}
        </h1>
        <div>
          <div className='flex justify-end'>
            <h1 className='text-2xl font-bold'>
              <span className='p-2'>{getCardIcon(props.card.effect)}</span>
              {props.card.name}
            </h1>
          </div>
          <p className='font-bold text-xs text-right'>
            {props.card.description}
          </p>
        </div>
      </div>
      <img src={props.card.img} alt='card' className='h-237 w-237' />
    </div>
  );
  const FaceDownCard = () => <div>FaceDownCard</div>;
  return <>{props.card.isFaceUp() ? <FaceUpCard /> : <FaceDownCard />}</>;
};
