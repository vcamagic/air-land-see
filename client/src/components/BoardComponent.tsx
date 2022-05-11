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
    <div>
      <div className='flex justify-center'>
        <LaneComponent
          lanes={board.lanes}
          updateClickedLane={updateClickedLane}
        />
        {/* <div className='w-247 h-392'>
          <img
            className='ml-auto'
            src='/images/face-down.png'
            alt='face-down'
          />
        </div> */}
      </div>
      <div>
        <HandComponent
          cards={board.player.hand}
          updateClickedCard={updateClickedCard}
        />
      </div>
    </div>
  );
};
