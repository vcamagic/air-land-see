import React from 'react';
import './App.css';
import { BoardComponent } from './components/BoardComponent';
import { WebSocketsProvider } from './websockets/WebSocketsProvider';

function App() {
  return (
    <WebSocketsProvider>
      <div className='flex justify-center'>
        <BoardComponent />
      </div>
    </WebSocketsProvider>
  );
}

export default App;
