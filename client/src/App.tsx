import React, { useReducer } from 'react';
import './App.css';
import { BoardComponent } from './components/BoardComponent';
import {
  BoardContextProvider,
  boardReducer,
  initialBoardState
} from './contexts/BoardContext';

function App() {
  const [boardState, boardDispatch] = useReducer(
    boardReducer,
    initialBoardState
  );

  const boardContextValues = {
    boardState,
    boardDispatch,
  };

  return (
    <BoardContextProvider value={boardContextValues}>
      <div className='flex justify-center'>
        <BoardComponent />
      </div>
    </BoardContextProvider>
  );
}

export default App;
