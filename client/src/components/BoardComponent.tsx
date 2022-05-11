import React, { useContext, useState } from 'react';
import { Board } from '../models/Board';
import { Card } from '../models/Cards/Card';
import { Lane } from '../models/Lane';
import WebSocketContext from '../websockets/WebSocketContext';
import { HandComponent } from './HandComponent';
import { LaneComponent } from './LaneComponent';

export const BoardComponent = () => {
  const { board, updateBoardState } = useContext(WebSocketContext);
  const [clickedCard, setClickedCard] = useState({});
  const [clickedLane, setClickedLane] = useState({});

  const updateClickedCard = (card: Card) => {
    setClickedCard(card);
  };
  const updateClickedLane = (lane: Lane) => {
    setClickedLane(lane);
    updateBoardState((clickedCard as Card).deploy(board, lane.type));
  };
  return (
    <>
      <div className='flex justify-center h-75'>
        <LaneComponent
          lanes={board.lanes}
          updateClickedLane={updateClickedLane}
        />
      </div>
      <div className='h-25'>
        <HandComponent
          cards={board.player.hand}
          updateClickedCard={updateClickedCard}
        />
      </div>
    </>
  );
};
