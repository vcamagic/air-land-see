import React, { useReducer } from 'react';
import './App.css';
import { CardComponent } from './components/CardComponent';
import {
  BoardContextProvider,
  boardReducer,
  initialBoardState,
} from './contexts/BoardContext';
import { Card } from './models/Cards/Card';
import { Maneuver } from './models/Cards/Maneuver';
import { Reinforce } from './models/Cards/Reinforce';
import { LaneType } from './models/LaneType';

function App() {
  const [boardState, boardDispatch] = useReducer(
    boardReducer,
    initialBoardState
  );

  const boardContextValues = {
    boardState,
    boardDispatch,
  };

  const cardToSend = new Maneuver(LaneType.AIR);
  const cardToSend1 = new Reinforce();
  return (
    <BoardContextProvider value={boardContextValues}>
      <div className='flex justify-center'>
        <CardComponent card={cardToSend} />
        <CardComponent card={cardToSend1} />
      </div>
    </BoardContextProvider>
  );
}

export default App;
