import React, { useReducer } from 'react';
import './App.css';
import { CardComponent } from './components/CardComponent';
import {
  BoardContextProvider,
  boardReducer,
  initialBoardState
} from './contexts/BoardContext';
import { Card } from './models/Cards/Card';
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

  const cardToSend = new Card('Bismarck', 6, LaneType.SEA);
  return (
    <BoardContextProvider value={boardContextValues}>
      <div className='flex justify-center'>
        <CardComponent card={cardToSend} />
      </div>
    </BoardContextProvider>
  );
}

export default App;
