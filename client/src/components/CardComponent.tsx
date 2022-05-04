import React, { useEffect } from 'react';
import { Card } from '../models/Cards/Card';

export const CardComponent = (card: Card) => {
  useEffect(() => {}, [card.faceUp]);

  const FaceUpCard = () => <div>FaceUpCard</div>;
  const FaceDownCard = () => <div>FaceDownCard</div>;
  return <>{card.faceUp ? <FaceUpCard /> : <FaceDownCard />}</>;
};
