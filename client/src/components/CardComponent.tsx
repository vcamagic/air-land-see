import React, { useContext, useEffect } from 'react';
import BoardContext from '../contexts/BoardContext';
import { Card } from '../models/Cards/Card';

interface CardComponentProps {
  card: Card;
}

export const CardComponent = (props: CardComponentProps) => {
  const board = useContext(BoardContext);

  useEffect(() => {}, [props.card]);

  useEffect(() => {
    console.log(board.boardState);
  }, [board]);

  const FaceUpCard = () => <div>FaceUpCard</div>;
  const FaceDownCard = () => <div>FaceDownCard</div>;
  return <>{props.card.isFaceUp() ? <FaceUpCard /> : <FaceDownCard />}</>;
};
