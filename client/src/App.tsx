import React, { useState } from 'react';
import './App.css';
import { BoardComponent } from './components/BoardComponent';
import { NameInputForm } from './components/NameInputForm';
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
