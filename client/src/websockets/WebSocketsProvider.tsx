import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import React, { useCallback, useRef, useState } from 'react';
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

  const turn = async (board: Board) => {
    console.log(board);
    console.log('Game id', gameId.current);
    try {
      await connection.current.invoke('Turn', [gameId.current, board]);
      setPlayerTurn(false);
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
    turn(board);
  };

  return (
    <WebSocketProv
      value={{
        joinGame,
        closeConnection,
        turn,
        board,
        updateBoardState,
        playerTurn,
      }}
    >
      {children}
    </WebSocketProv>
  );
};
