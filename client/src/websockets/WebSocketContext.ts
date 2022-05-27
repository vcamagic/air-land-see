import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import React from 'react';
import { Board } from '../models/Board';

interface WebSocketContextProps {
  joinGame: (user: any) => Promise<void>;
  closeConnection: () => Promise<void>;
  turn: (
    board: Board,
    targetId?: number,
    overwriteTurn?: boolean,
    isForfeit?: boolean
  ) => Promise<void>;
  board: Board;
  updateBoardState: (board: Board) => void;
  playerTurn: boolean;
  receivedTargetId: number;
  resetTargetId: () => void;
  getIsHost: () => boolean;
  endGame: () => void;
  gameEnded: boolean;
  gameStarted: boolean;
  getPlayerName: () => string;
  getOpponentName: () => string;
  won: () => boolean;
  gameId: string;
  connection: HubConnection;
}
const WebSocketContext = React.createContext<WebSocketContextProps>({
  joinGame: (user: any) => new Promise((resolve) => resolve()),
  closeConnection: () => new Promise((resolve) => resolve()),
  turn: (
    board: Board,
    targetId?: number,
    overwriteTurn?: boolean,
    isForfeit?: boolean
  ) => new Promise((resolve) => resolve()),
  updateBoardState: (board: Board) => {},
  board: new Board(),
  playerTurn: true,
  receivedTargetId: -1,
  resetTargetId: () => {},
  getIsHost: () => true,
  endGame: () => {},
  gameEnded: false,
  gameStarted: false,
  getPlayerName: () => '',
  getOpponentName: () => '',
  won: () => false,
  gameId: '',
  connection: new HubConnectionBuilder()
      .withUrl('https://air-land-sea.herokuapp.com/game')
      .build()
});
export const WebSocketConsumer = WebSocketContext.Consumer;
export const WebSocketProv = WebSocketContext.Provider;
export default WebSocketContext;
