import React from 'react';
import { Board } from '../models/Board';

interface WebSocketContextProps {
  joinGame: (user: any) => Promise<void>;
  closeConnection: () => Promise<void>;
  turn: (board: Board, targetId?:number, overwriteTurn?: boolean) => Promise<void>;
  board: Board;
  updateBoardState: (board: Board) => void;
  playerTurn: boolean;
  receivedTargetId: number;
  resetTargetId: () => void; 
}
const WebSocketContext = React.createContext<WebSocketContextProps>({
  joinGame: (user: any) => new Promise((resolve) => resolve()),
  closeConnection: () => new Promise((resolve) => resolve()),
  turn: (board: Board, targetId?: number, overwriteTurn?: boolean) =>
    new Promise((resolve) => resolve()),
  updateBoardState: (board: Board) => {},
  board: new Board(),
  playerTurn: true,
  receivedTargetId: -1,
  resetTargetId: () => {},
});
export const WebSocketConsumer = WebSocketContext.Consumer;
export const WebSocketProv = WebSocketContext.Provider;
export default WebSocketContext;
