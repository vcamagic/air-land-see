import React, { useContext } from 'react';
import BoardContext from '../contexts/BoardContext';
import { HandComponent } from './HandComponent';
import { LaneComponent } from './LaneComponent';

export const BoardComponent = () => {
  const { boardState } = useContext(BoardContext);

  console.log(boardState);
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
          <img className='ml-auto' src='/images/face-down.png' alt='face-down' />
        </div>
      </div>
      <div>
        <HandComponent />
      </div>
    </div>
  );
};
