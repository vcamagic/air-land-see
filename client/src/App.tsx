import React, { useReducer } from 'react';
import './App.css';
import { BoardComponent } from './components/BoardComponent';
import {
  BoardContextProvider,
  boardReducer,
  initialBoardState,
} from './contexts/BoardContext';
import { WebSocketsProvider } from './websockets/WebSocketsProvider';

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
    <WebSocketsProvider>
      <BoardContextProvider value={boardContextValues}>
        <div className='flex justify-center'>
          <BoardComponent />
        </div>
      </BoardContextProvider>
    </WebSocketsProvider>
  );
}

export default App;
