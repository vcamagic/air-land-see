import React from 'react';
import { Board } from '../models/Board';

interface WebSocketContextProps {
  connectWs: () => void;
  closeWs: () => void;
  send: (board: Board) => void;
  wsState: number;
  board: Board;
}
const WebSocketContext = React.createContext<WebSocketContextProps>({
  connectWs: () => {},
  closeWs: () => {},
  send: (board: Board) => {},
  wsState: 0,
  board: new Board(true),
});
export const WebSocketConsumer = WebSocketContext.Consumer;
export const WebSocketProv = WebSocketContext.Provider;
export default WebSocketContext;
