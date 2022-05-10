import React, { useState } from 'react';
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
} from '@microsoft/signalr';
import { WebSocketProv } from './WebSocketContext';
import { Board } from '../models/Board';

interface WebSocketProviderProps {
  children: JSX.Element;
}

export const WebSocketsProvider = ({ children }: WebSocketProviderProps) => {
  const [connection, setConnection] = useState({});
  const [board, setBoard] = useState(new Board());
  const [playerTurn, setPlayerTurn] = useState(true);

  let gameId = '';
  const joinGame = async (playerName: string) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl('https://localhost:7095/game')
        .configureLogging(LogLevel.Information)
        .build();

      connection.on('BoardUpdated', (board: Board) => {
        setBoard(board);
        setPlayerTurn(true);
      });

      connection.on('GameFound', async (id: string) => {
        gameId = id;
        await connection.invoke('SubmitName', [id, playerName]);
      });

      connection.on(
        'GameSetup',
        async (isHost: boolean, opponentName: string) => {
          if (isHost) {
            const board = new Board();
            await connection.invoke('PrepareGame', [board, gameId]);
            setBoard(board);
            setPlayerTurn(true);
          } else {
            setPlayerTurn(false);
          }
        }
      );

      connection.on('ReceivePreparedGame', (board: Board) => {
        setBoard(board);
      });

      await connection.start();
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  const updateBoard = async (board: Board, gameId: string) => {
    try {
      await (connection as HubConnection).invoke('UpdateBoard', board);
    } catch (e) {
      console.error(e);
    }
  };

  const closeConnection = async () => {
    try {
      await (connection as HubConnection).stop();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <WebSocketProv
      value={{ joinGame, closeConnection, updateBoard, board, playerTurn }}
    >
      {children}
    </WebSocketProv>
  );
};
