import {
    HubConnectionBuilder,
    LogLevel
} from '@microsoft/signalr';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Board } from '../models/Board';
import { WebSocketProv } from './WebSocketContext';

interface WebSocketProviderProps {
  children: JSX.Element;
}

export const WebSocketsProvider = ({ children }: WebSocketProviderProps) => {
  const connection = useRef(
    new HubConnectionBuilder()
      .withUrl('https://localhost:7095/game')
      .configureLogging(LogLevel.Information)
      .build()
  );
  const [board, setBoard] = useState(new Board());
  const [playerTurn, setPlayerTurn] = useState(true);
  const gameId = useRef('');
  const renderOnce = useRef(0);

  const joinGame = useCallback(async (playerName: string) => {
    connection.current = new HubConnectionBuilder()
      .withUrl('https://localhost:7095/game')
      .configureLogging(LogLevel.Information)
      .build();

    try {
      connection.current.on('GameFound', async (id: string) => {
        gameId.current = id;
        await connection.current.invoke('SubmitName', [id, playerName]);
      });

      connection.current.on(
        'GameSetup',
        async (isHost: boolean, opponentName: string) => {
          if (isHost) {
            const board = new Board();
            await connection.current.invoke('PrepareGame', [
              board,
              gameId.current,
            ]);
            setBoard(board);
            setPlayerTurn(true);
          } else {
            setPlayerTurn(false);
          }
        }
      );

      connection.current.on('ReceivePreparedGame', (board: Board) => {
        setBoard(board.invertBoardState());
      });

      connection.current.on('OpponentTurn', (board: Board) => {
        setBoard(board.invertBoardState());
        setPlayerTurn(true);
      });

      await connection.current.start();
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (renderOnce.current === 0) {
      renderOnce.current++;
      joinGame('player');
    }
  }, [joinGame]);

  const updateBoard = async (board: Board, gameId: string) => {
    try {
      await connection.current.invoke('UpdateBoard', board);
    } catch (e) {
      console.error(e);
    }
  };

  const closeConnection = async () => {
    try {
      await connection.current.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const updateBoardState = (board: Board) => {
    setBoard(board);
  };
  return (
    <WebSocketProv
      value={{
        joinGame,
        closeConnection,
        updateBoard,
        board,
        updateBoardState,
        playerTurn
      }}
    >
      {children}
    </WebSocketProv>
  );
};
