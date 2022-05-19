import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import React, { useCallback, useRef, useState } from 'react';
import { makeBoardInstance } from '../helpers';
import { Board } from '../models/Board';
import { Lane } from '../models/Lane';
import { ServerBoard } from '../models/ServerBoard';
import { WebSocketProv } from './WebSocketContext';

const invertBoardState = (board: Board): Board => {
  let temp: Board = new Board();
  temp.targeting = board.targeting;
  temp.disruptSteps = board.disruptSteps;
  temp.deck = board.deck;
  [temp.player, temp.opponent] = [board.opponent, board.player];
  board.lanes.forEach((lane: Lane, index: number) => {
    [
      temp.lanes[index].playerCards,
      temp.lanes[index].opponentCards,
      temp.lanes[index].playerScore,
      temp.lanes[index].opponentScore,
      temp.lanes[index].type,
      temp.lanes[index].highlight,
    ] = [
      lane.opponentCards,
      lane.playerCards,
      lane.opponentScore,
      lane.playerScore,
      lane.type,
      lane.highlight,
    ];
  });
  return temp;
};

interface WebSocketProviderProps {
  children: JSX.Element;
}
export const WebSocketsProvider = ({ children }: WebSocketProviderProps) => {
  const connection = useRef(
    new HubConnectionBuilder()
      .withUrl('http://localhost:5237/game')
      .configureLogging(LogLevel.Information)
      .build()
  );
  const [board, setBoard] = useState(new Board());
  const [playerTurn, setPlayerTurn] = useState(true);
  const [receivedTargetId, setReceivedTargetId] = useState(-1);
  const gameId = useRef('');
  const host = useRef(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  let playerName = useRef('');
  let opponentName = useRef('');

  const joinGame = useCallback(async (name: string) => {
    connection.current = new HubConnectionBuilder()
      .withUrl('http://localhost:5237/game')
      .configureLogging(LogLevel.Information)
      .build();

    try {
      connection.current.on('GameFound', async (id: string) => {
        gameId.current = id;
        playerName.current = name;
        await connection.current.invoke('SubmitName', id, name);
      });

      connection.current.on(
        'GameSetup',
        async (isHost: boolean, opponentNick: string) => {
          host.current = isHost;
          opponentName.current = opponentNick;
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
          setGameStarted(true);
        }
      );

      connection.current.on('ReceivePreparedGame', (board: ServerBoard) => {
        const temp = makeBoardInstance(board);
        setBoard(invertBoardState(temp));
      });

      connection.current.on(
        'OpponentTurn',
        (
          board: ServerBoard,
          targetId: number,
          overwriteTurn: boolean,
          isForfeit: boolean
        ) => {
          let temp = invertBoardState(makeBoardInstance(board));
          temp.calculateScores();
          setBoard(temp);
          if (overwriteTurn) {
            setPlayerTurn(true);
          } else {
            setPlayerTurn(declareTurn(temp));
          }

          if (isForfeit) {
            host.current = !host.current;
            setPlayerTurn(host.current);
          }
          console.log('primljen target id iz oponent turn metode', targetId);
          setReceivedTargetId(targetId);
          console.log('OPPONENT TURN', temp);
        }
      );

      connection.current.on('GameEnded', () => {
        setGameEnded(true);
      });

      await connection.current.start();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const turn = async (
    board: Board,
    targetId?: number,
    overwriteTurn?: boolean,
    isForfeit?: boolean
  ) => {
    try {
      await connection.current.invoke(
        'Turn',
        gameId.current,
        board,
        targetId ?? -1,
        overwriteTurn ?? false,
        isForfeit ?? false
      );
      if (overwriteTurn) {
        setPlayerTurn(false);
      } else {
        setPlayerTurn(declareTurn(board));
      }
      if (isForfeit) {
        host.current = !host.current;
        setPlayerTurn(host.current);
      }
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

  const declareTurn = (board: Board) => {
    let playersTurn!: boolean;
    if (host.current) {
      playersTurn = board.player.hand.length === board.opponent.hand.length;
    } else {
      playersTurn = board.player.hand.length > board.opponent.hand.length;
    }
    return playersTurn;
  };

  const resetTargetId = () => {
    setReceivedTargetId(-1);
  };

  const getIsHost = (): boolean => {
    return host.current;
  };


  const getPlayerName = (): string => {
    return playerName.current;
  };

  const getOpponentName = (): string => {
    return opponentName.current;
  };

  const endGame = async () => {
    try {
      await connection.current.invoke('EndGame', gameId.current);
    } catch (e) {
      console.error(e);
    }
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
        receivedTargetId,
        resetTargetId,
        getIsHost,
        endGame,
        gameEnded,
        gameStarted,
        getPlayerName,
        getOpponentName
      }}
    >
      {children}
    </WebSocketProv>
  );
};
