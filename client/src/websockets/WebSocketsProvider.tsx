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
  const [board, setBoard] = useState(new Board(true));

  const joinGame = async (user: any) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl('https//localhost:7095/game')
        .configureLogging(LogLevel.Information)
        .build();

      connection.on('BoardUpdated', (board: Board) => {
        setBoard(board);
      });

      connection.on('GameStarted', async () => {
        await connection.invoke('GameStart', { board: new Board(true) });
      });

      await connection.start();
      await connection.invoke('JoinGame', { user });
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  };

  const updateBoard = async (board: Board) => {
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
    <WebSocketProv value={{ joinGame, closeConnection, updateBoard, board }}>
      {children}
    </WebSocketProv>
  );
};
