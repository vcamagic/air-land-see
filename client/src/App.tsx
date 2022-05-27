import React, { useState } from 'react';
import './App.css';
import { BoardComponent } from './components/BoardComponent';
import { NameInputForm } from './components/NameInputForm';
import { WebSocketsChatProvider } from './websockets/WebSocketsChatProvider';
import { WebSocketsProvider } from './websockets/WebSocketsProvider';
function App() {
  const [nameInserted, setNameInserted] = useState(false);

  const insertName = () => {
    setNameInserted(true);
  };

  return (
    <WebSocketsProvider>
      <WebSocketsChatProvider>
        {nameInserted ? (
          <BoardComponent />
        ) : (
          <NameInputForm insertName={insertName} />
        )}
      </WebSocketsChatProvider>
    </WebSocketsProvider>
  );
}

export default App;
