import React from 'react';
import { Board } from '../models/Board';

interface WebSocketContextProps {
  joinGame: (user: any) => Promise<void>;
  closeConnection: () => Promise<void>;
  updateBoard: (board: Board, gameId: string) => Promise<void>;
  board: Board;
  playerTurn: boolean;
}
const WebSocketContext = React.createContext<WebSocketContextProps>({
  joinGame: (user: any) => new Promise((resolve) => resolve()),
  closeConnection: () => new Promise((resolve) => resolve()),
  updateBoard: (board: Board, gameId: string) =>
    new Promise((resolve) => resolve()),
  board: new Board(),
  playerTurn: true,
});
export const WebSocketConsumer = WebSocketContext.Consumer;
export const WebSocketProv = WebSocketContext.Provider;
export default WebSocketContext;
