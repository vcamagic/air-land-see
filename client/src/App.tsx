import React, { useState } from 'react';
import './App.css';
import { BoardComponent } from './components/game/BoardComponent';
import { NameInputForm } from './components/utils/NameInputForm';
import { WebSocketsProvider } from './websockets/WebSocketsProvider';
function App() {
  const [nameInserted, setNameInserted] = useState(false);

  const insertName = () => {
    setNameInserted(true);
  };

  return (
    <WebSocketsProvider>
      {nameInserted ? (
        <BoardComponent />
      ) : (
        <NameInputForm insertName={insertName} />
      )}
    </WebSocketsProvider>
  );
}

export default App;
