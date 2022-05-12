import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import React, { useCallback, useRef, useState } from 'react';
import { makeBoardInstance } from '../helpers';
import { Board } from '../models/Board';
import { Lane } from '../models/Lane';
import { ServerBoard } from '../models/ServerBoard';
import { WebSocketProv } from './WebSocketContext';
const invertBoardState = (board: Board): Board => {
  let temp: Board = new Board();
  temp.deck = board.deck;
  [temp.player, temp.opponent] = [board.opponent, board.player];
  board.lanes.forEach((lane: Lane, index: number) => {
    [
      temp.lanes[index].playerCards,
      temp.lanes[index].opponentCards,
      temp.lanes[index].playerScore,
      temp.lanes[index].opponentScore,
      temp.lanes[index].type,
    ] = [
      lane.opponentCards,
      lane.playerCards,
      lane.opponentScore,
      lane.playerScore,
      lane.type,
    ];
  });
  console.log('INVERTED', temp);
  return temp;
};

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

  const joinGame = useCallback(async (name: string) => {
    connection.current = new HubConnectionBuilder()
      .withUrl('https://localhost:7095/game')
      .configureLogging(LogLevel.Information)
      .build();

    try {
      connection.current.on('GameFound', async (id: string) => {
        gameId.current = id;
        await connection.current.invoke('SubmitName', id, name);
      });

      connection.current.on(
        'GameSetup',
        async (isHost: boolean, opponentName: string) => {
          if (isHost) {
            const board = new Board();
            await connection.current.invoke(
              'PrepareGame',
              board,
              gameId.current
            );
            setBoard(board);
            setPlayerTurn(true);
          } else {
            setPlayerTurn(false);
          }
        }
      );

      connection.current.on('ReceivePreparedGame', (board: ServerBoard) => {
        const temp = makeBoardInstance(board);
        setBoard(invertBoardState(temp));
      });

      connection.current.on('OpponentTurn', (board: ServerBoard) => {
        const temp = makeBoardInstance(board);
        setBoard(invertBoardState(temp));
        setPlayerTurn(true);
      });

      await connection.current.start();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const turn = async (board: Board) => {
    try {
      await connection.current.invoke('Turn', gameId.current, board);
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
