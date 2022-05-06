import React, { useReducer } from 'react';
import './App.css';
import { BoardComponent } from './components/BoardComponent';
import {
  BoardContextProvider,
  boardReducer,
  initialBoardState,
} from './contexts/BoardContext';
import { WebSocketProvider } from './contexts/WebSocketProvider';

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
    <WebSocketProvider>
      <BoardContextProvider value={boardContextValues}>
        <div className='flex justify-center'>
          <BoardComponent />
        </div>
      </BoardContextProvider>
    </WebSocketProvider>
  );
}

export default App;
