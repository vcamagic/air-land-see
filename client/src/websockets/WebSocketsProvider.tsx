import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { cloneDeep } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import {
  calculateHostScore,
  calculateScore,
  declareWinner,
  highlightChanges,
  invertBoardState,
  makeBoardInstance,
} from '../helpers';
import { Board } from '../models/Board';
import { Message } from '../models/ServerDataModels/Message';
import { NotificationType } from '../models/ServerDataModels/NotificationType';
import { ServerBoard } from '../models/ServerDataModels/ServerBoard';
import { WebSocketProv } from './WebSocketContext';

interface WebSocketProviderProps {
  children: JSX.Element;
}
export const WebSocketsProvider = ({ children }: WebSocketProviderProps) => {
  const connection = useRef(
    new HubConnectionBuilder()
      //.withUrl('https://air-land-sea.herokuapp.com/game')
      .withUrl('http://localhost:5237/game')
      .configureLogging(LogLevel.Information)
      .build()
  );
  const [board, setBoard] = useState(new Board());
  const [playerTurn, setPlayerTurn] = useState(true);
  const [receivedTargetId, setReceivedTargetId] = useState(-1);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [open, setOpen] = React.useState(false);
  const [disableInput, setDisableInput] = useState(false);
  const [notification, setNotification] = useState(
    NotificationType.StandardRoundEnd
  );
  const gameId = useRef('');
  const host = useRef(true);
  const playerName = useRef('');
  const opponentName = useRef('');
  const previousBoard = useRef(new Board());
  const msgReceivedAudio = new Audio('/MsgNotif.mp3');
  const yourTurnAudio = new Audio('/yourturn.mp3');
  const opponentFizzle = useRef(false);
  msgReceivedAudio.volume = 0.2;
  yourTurnAudio.volume = 0.07;

  const savedUserInput = useRef('');

  const changeUserInput = (newVal: string) => {
    savedUserInput.current = newVal;
  };

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
          yourTurnAudio.play();
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
          overwriteTurn: boolean
        ) => {
          const temp = invertBoardState(makeBoardInstance(serverBoard));
          temp.calculateScores();
          updateBoardState(highlightChanges(previousBoard.current, temp));

          if (temp.fizzledCard !== null) {
            opponentFizzle.current = true;
            setTimeout(() => {
              temp.fizzledCard = null;
              temp.calculateScores();
              updateBoardState(cloneDeep(temp));
              opponentFizzle.current = false;
            }, 900);
          }

          if (overwriteTurn) {
            setPlayerTurn(true);
          } else {
            setPlayerTurn(declareTurn(temp));
          }
          setReceivedTargetId(targetId);
          yourTurnAudio.play();
        }
      );

      connection.current.on(
        'ReceiveNewRound',
        async (serverBoard: ServerBoard) => {
          const temp = invertBoardState(makeBoardInstance(serverBoard));
          setNotification(NotificationType.StandardRoundEnd);
          showStandardNotification(temp);
        }
      );

      connection.current.on(
        'EnemyConcede',
        async (serverBoard: ServerBoard) => {
          let temp = invertBoardState(makeBoardInstance(serverBoard));
          yourTurnAudio.play();
          setNotification(NotificationType.GameConcededByOpponent);
          showStandardNotification(temp);
        }
      );

      connection.current.on('EnemyQuit', () => {
        setOpen(true);
        setDisableInput(true);
        setNotification(NotificationType.OpponentQuit);
      });

      connection.current.on('ReceiveMessage', async (message: string) => {
        const msg = new Message(message, true);
        setMessages((prevState) => [msg, ...prevState]);
        msgReceivedAudio.play();
      });

      connection.current.on('GameEnded', () => {
        setOpen(true);
        setDisableInput(true);
        setNotification(NotificationType.ScoreLimitReached);

        setDisableInput(false);
        setGameEnded(true);
      });

      await connection.current.start();
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const turn = async (
    board: Board,
    targetId?: number,
    overwriteTurn?: boolean
  ) => {
    try {
      await connection.current.invoke(
        'Turn',
        gameId.current,
        board,
        targetId ?? -1,
        overwriteTurn ?? false
      );
      if (
        board.player.hand.length === 0 &&
        board.opponent.hand.length === 0 &&
        !board.targeting
      ) {
        roundFinished();
        return;
      }
      if (overwriteTurn) {
        setPlayerTurn(false);
      } else {
        setPlayerTurn(declareTurn(board));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const playAgain = async () => {
    await connection.current.invoke(
      'SubmitName',
      gameId.current,
      playerName.current
    );
    setGameStarted(false);
  };

  const roundFinished = async () => {
    try {
      let playerWon = true;
      if (!declareWinner(board, getIsHost())) {
        playerWon = false;
      }
      const tempBoard = board.nextRound();
      if (playerWon) {
        tempBoard.player.score += 6;
      } else {
        tempBoard.opponent.score += 6;
      }
      await connection.current.invoke(
        'RoundFinished',
        gameId.current,
        tempBoard
      );
      setNotification(NotificationType.StandardRoundEnd);
      showStandardNotification(tempBoard);
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
      console.error(e);
    }
  };

  const concede = async () => {
    try {
      const tempBoard = board.nextRound();
      tempBoard.opponent.score += getIsHost()
        ? calculateHostScore(board.player.hand.length)
        : calculateScore(board.player.hand.length);
      await connection.current.invoke('Concede', gameId.current, tempBoard);
      yourTurnAudio.play();
      setNotification(NotificationType.GameConcededByPlayer);
      showStandardNotification(tempBoard);
    } catch (e) {
      console.error(e);
    }
  };

  const getPopupText = (): string => {
    switch (notification) {
      case NotificationType.ScoreLimitReached:
        return board.player.score >= 12
          ? 'Congratulations Commander, Victory is yours.'
          : `Mission Failed, we'll get em next Time.`;
      case NotificationType.GameConcededByOpponent:
        return 'Opponent Forfeited the Round.';
      case NotificationType.GameConcededByPlayer:
        return 'Round Forfeited.';
      case NotificationType.OpponentQuit:
        return 'Opponent has left the game. Search for a new match?';
      default:
        return declareWinner(board, host.current)
          ? 'Round Won.'
          : 'Round Lost.';
    }
  };

  const closeNotification = (): void => {
    setOpen(false);
  };

  const updateDisableInput = (disabled: boolean) => {
    setDisableInput(disabled);
  };

  const requeue = (): void => {
    setOpen(false);
    setDisableInput(false);
    setGameStarted(false);
    setGameEnded(false);
    setMessages([]);
    connection.current.invoke('Requeue', gameId.current);
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

  const showStandardNotification = (tempBoard: Board): void => {
    setOpen(true);
    setDisableInput(true);
    setTimeout(() => {
      updateBoardState(tempBoard);
      if (!host.current) {
        if (tempBoard.player.score >= 12 || tempBoard.opponent.score >= 12) {
          endGame();
          return;
        }
      }
      host.current = !host.current;
      setPlayerTurn(host.current);
      setOpen(false);
      setDisableInput(false);
    }, 7000);
  };

  return (
    <WebSocketProv
      value={{
        board,
        playerTurn,
        receivedTargetId,
        gameEnded,
        gameStarted,
        messages,
        savedUserInput: savedUserInput.current,
        open,
        opponentFizzle: opponentFizzle.current,
        disableInput,
        joinGame,
        closeConnection,
        turn,
        updateBoardState,
        resetTargetId,
        getIsHost,
        endGame,
        getPlayerName,
        getOpponentName,
        getPopupText,
        sendMessage,
        changeUserInput,
        concede,
        requeue,
        closeNotification,
        updateDisableInput,
        playAgain,
      }}
    >
      {children}
    </WebSocketProv>
  );
};
