import React, { useContext } from 'react';
import { Board } from '../models/Board';
import WebSocketContext from '../websockets/WebSocketContext';
import { HandComponent } from './HandComponent';
import { LaneComponent } from './LaneComponent';

export const BoardComponent = () => {
  const { board } = useContext(WebSocketContext);

  return (
    <div>
      <div className='flex justify-center flex-wrap'>
        <div className='w-247 h-392'>
          <img src='/images/face-down.png' alt='face-down' />
        </div>
      </div>
      <div className='flex justify-center'>
        <LaneComponent lanes={board.lanes} />
        <div className='w-247 h-392'>
          <img
            className='ml-auto'
            src='/images/face-down.png'
            alt='face-down'
          />
        </div>
      </div>
      <div>
        <HandComponent cards={board.player.hand} />
      </div>
    </div>
  );
};
