import React, { useEffect } from 'react';
import { Card } from '../models/Cards/Card';
import img from '../assets/manuever.jpg';
interface CardComponentProps {
  card: Card;
}

export const CardComponent = (props: CardComponentProps) => {
  const FaceUpCard = () => (
    <div className='m-3'>
      <div className='flex justify-evenly bg-orange-500 p-2 max-w-237 min-h-120'>
        <h1 className='text-7xl font-bold text-white mr-3'>
          {props.card.power}
        </h1>
        <div>
          <div className='flex justify-end'>
            <h1 className='text-2xl font-bold'>{props.card.name}</h1>
          </div>
          <p className='font-bold text-xs text-right'>
            {props.card.description}
          </p>
        </div>
      </div>
      <img src={img} alt='card' className='h-237 w-237' />
    </div>
  );
  const FaceDownCard = () => <div>FaceDownCard</div>;
  return <>{props.card.isFaceUp() ? <FaceUpCard /> : <FaceDownCard />}</>;
};
