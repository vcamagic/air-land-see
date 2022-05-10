import React, { useContext, useEffect } from 'react';
import WebSocketContext from '../websockets/WebSocketContext';
import { HandComponent } from './HandComponent';
import { LaneComponent } from './LaneComponent';

export const BoardComponent = () => {
  const { joinGame } = useContext(WebSocketContext);

  useEffect(() => {
    console.log('eff');
    joinGame('username');
  }, []);

  return (
    <div>
      <div className='flex justify-center flex-wrap'>
        <div className='w-247 h-392'>
          <img src='/images/face-down.png' alt='face-down' />
        </div>
      </div>
      <div className='flex justify-center'>
        <LaneComponent />
        <div className='w-247 h-392'>
          <img
            className='ml-auto'
            src='/images/face-down.png'
            alt='face-down'
          />
        </div>
      </div>
      <div>
        <HandComponent />
      </div>
    </div>
  );
};
