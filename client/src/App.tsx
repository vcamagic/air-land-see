import React, { useState } from 'react';
import './App.css';
import { BoardComponent } from './components/BoardComponent';
import { WebSocketsProvider } from './websockets/WebSocketsProvider';
import { NameInputForm } from './components/NameInputForm';
import { CardInLaneComponent } from './components/CardInLaneComponent';
function App() {
  const [nameInserted, setNameInserted] = useState(false);

  const insertName = () => {
    setNameInserted(true);
  };

  return (
    <WebSocketsProvider>
      <div className='flex justify-center'>
        {nameInserted ? (
          <BoardComponent />
        ) : (
          <NameInputForm insertName={insertName} />
        )}
      </div>
    </WebSocketsProvider>
  );
}

export default App;
