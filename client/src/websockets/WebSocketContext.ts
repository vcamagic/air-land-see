import React from 'react';
import { Board } from '../models/Board';
import { Message } from '../models/ServerDataModels/Message';

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
  getPopupText: () => string;
  sendMessage: (message: string) => void;
  messages: Message[];
  savedUserInput: string;
  changeUserInput: (newVal: string) => void;
  concede: () => void;
  requeue: () => void;
  open: boolean;
  opponentFizzle: boolean;
  closeNotification: () => void;
  disableInput: boolean;
  playAgain: () => void;
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
  getPopupText: () => '',
  sendMessage: (message: string) => {},
  messages: [],
  savedUserInput: '',
  changeUserInput: (newVal: string) => {},
  concede: () => {},
  requeue: () => {},
  open: false,
  opponentFizzle: false,
  closeNotification: () => {},
  disableInput: false,
  playAgain: () => {},
});
export const WebSocketConsumer = WebSocketContext.Consumer;
export const WebSocketProv = WebSocketContext.Provider;
export default WebSocketContext;
