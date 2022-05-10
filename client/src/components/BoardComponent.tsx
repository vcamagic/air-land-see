import React, { useContext, useEffect } from 'react';
import BoardContext from '../contexts/BoardContext';
import WebSocketContext from '../contexts/WebSocket';
import { HandComponent } from './HandComponent';
import { LaneComponent } from './LaneComponent';

export const BoardComponent = () => {
  //const { boardState } = useContext(BoardContext);
  const { connectWs, board, wsState } = useContext(WebSocketContext);

  useEffect(() => {
    connectWs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('WEB SOCKET BOARD.', board);
    console.log('WEB SOCKET STATE', wsState);
  }, [board]);

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
