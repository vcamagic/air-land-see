import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { cloneDeep } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { makeBoardInstance } from '../helpers';
import { Board } from '../models/Board';
import { Card } from '../models/Cards/Card';
import { Lane } from '../models/Lane';
import { Message } from '../models/Message';
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
      .withUrl('https://air-land-sea.herokuapp.com/game')
      .configureLogging(LogLevel.Information)
      .build()
  );
  const [board, setBoard] = useState(new Board());
  const [playerTurn, setPlayerTurn] = useState(true);
  const [receivedTargetId, setReceivedTargetId] = useState(-1);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const gameId = useRef('');
  const host = useRef(true);
  const playerName = useRef('');
  const opponentName = useRef('');
  const previousBoard = useRef(new Board());

  const joinGame = useCallback(async (name: string) => {
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
          serverBoard: ServerBoard,
          targetId: number,
          overwriteTurn: boolean,
          isForfeit: boolean
        ) => {
          let temp = invertBoardState(makeBoardInstance(serverBoard));
          temp.calculateScores();
          updateBoardState(highlightChanges(previousBoard.current, temp));
          if (overwriteTurn) {
            setPlayerTurn(true);
          } else {
            setPlayerTurn(declareTurn(temp));
          }

          if (isForfeit) {
            host.current = !host.current;
            setPlayerTurn(host.current);
          }
          setReceivedTargetId(targetId);
          console.log('OPPONENT TURN', temp);
        }
      );

      connection.current.on('ReceiveMessage', async (message: string) => {
        const msg = new Message(message, true);
        setMessages((prevState) => [msg, ...prevState]);
      });

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
      if (
        board.player.hand.length === 0 &&
        board.opponent.hand.length === 0 &&
        !board.targeting
      ) {
        showRoundEndModalAndRestartGame();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = async (message: string) => {
    try {
      await connection.current.invoke(
        'SendMessageAsync',
        gameId.current,
        message
      );
      const msg = new Message(message, false);
      setMessages((prevState) => [msg, ...prevState]);
    } catch (e) {
      console.log(e);
    }
  };

  const showRoundEndModalAndRestartGame = () => {
    if (!getIsHost()) {
      let playerWon = true;
      if (!declareWinner(board, getIsHost())) {
        playerWon = false;
      }
      let tempBoard = board.nextRound();
      if (playerWon) {
        tempBoard.player.score += 6;
      } else {
        tempBoard.opponent.score += 6;
      }
      setTimeout(() => {
        if (tempBoard.player.score >= 12 || tempBoard.opponent.score >= 12) {
          endGame();
        }
        updateBoardState(tempBoard);
        turn(tempBoard, undefined, undefined, true);
      }, 4000);
    }
  };

  const declareWinner = (board: Board, isHost: boolean): boolean => {
    let playerWin = 0;
    let opponentWin = 0;
    board.lanes.forEach((lane) => {
      if (lane.playerScore >= lane.opponentScore) {
        if (lane.playerScore === lane.opponentScore) {
          if (isHost) {
            playerWin += 1;
          } else {
            opponentWin += 1;
          }
        } else {
          playerWin += 1;
        }
      } else {
        opponentWin += 1;
      }
    });
    return playerWin > opponentWin;
  };

  const won = (): boolean => {
    return declareWinner(board, host.current);
  };

  const closeConnection = async () => {
    try {
      await connection.current.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const updateBoardState = (board: Board) => {
    previousBoard.current = board;
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

  const getPlayerName = useCallback(() => {
    return playerName.current;
  }, []);

  const getOpponentName = useCallback(() => {
    return opponentName.current;
  }, []);

  const endGame = async () => {
    try {
      await connection.current.invoke('EndGame', gameId.current);
    } catch (e) {
      console.error(e);
    }
  };

  const highlightChanges = (originalBoard: Board, newBoard: Board): Board => {
    newBoard.lanes.forEach((lane: Lane, index: number) => {
      lane.playerCards.forEach((card: Card, cardIndex: number) => {
        const originalCard = originalBoard.lanes[index].playerCards[cardIndex];
        if (
          originalCard === undefined ||
          (originalCard.isFaceUp() !== card.isFaceUp() &&
            originalCard.id === card.id)
        ) {
          card.highlightChange = true;
        } else {
          card.highlightChange = false;
        }
      });
      lane.opponentCards.forEach((card: Card, cardIndex: number) => {
        const originalCard =
          originalBoard.lanes[index].opponentCards[cardIndex];
        if (
          originalCard === undefined ||
          (originalCard.isFaceUp() !== card.isFaceUp() &&
            originalCard.id === card.id)
        ) {
          card.highlightChange = true;
        } else {
          card.highlightChange = false;
        }
      });
    });
    return cloneDeep(newBoard);
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
        getOpponentName,
        won,
        sendMessage,
        messages,
      }}
    >
      {children}
    </WebSocketProv>
  );
};
