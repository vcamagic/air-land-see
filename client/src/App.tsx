import React, { useContext, useState } from 'react';
import './App.css';
import { BoardComponent } from './components/BoardComponent';
import { NameInputForm } from './components/NameInputForm';
import WebSocketContext from './websockets/WebSocketContext';
import { WebSocketsProvider } from './websockets/WebSocketsProvider';
function App() {
  const [nameInserted, setNameInserted] = useState(false);

  const insertName = () => {
    setNameInserted(true);
  };

  const deleteName = () => {
    setNameInserted(false);
  };

  return (
    <WebSocketsProvider>
      {nameInserted ? (
        <BoardComponent deleteName={deleteName} />
      ) : (
        <NameInputForm insertName={insertName} />
      )}
    </WebSocketsProvider>
  );
}

export default App;
