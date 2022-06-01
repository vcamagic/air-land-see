import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
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
import { Message } from '../models/Message';
import { NotificationType } from '../models/NotificationType';
import { ServerBoard } from '../models/ServerBoard';
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
          overwriteTurn: boolean,
          isForfeit: boolean
        ) => {
          const temp = invertBoardState(makeBoardInstance(serverBoard));
          temp.calculateScores();
          updateBoardState(highlightChanges(previousBoard.current, temp));
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
        setNotification(NotificationType.OpponentQuit);
        setTimeout(() => {
          setOpen(false);
          setGameStarted(false);
          setMessages([]);
          connection.current.invoke('Requeue');
        }, 4000);
      });

      connection.current.on('ReceiveMessage', async (message: string) => {
        const msg = new Message(message, true);
        setMessages((prevState) => [msg, ...prevState]);
        msgReceivedAudio.play();
      });

      connection.current.on('GameEnded', () => {
        setOpen(true);
        setNotification(NotificationType.ScoreLimitReached);
        setTimeout(() => {
          setOpen(false);
          setGameEnded(true);
        }, 6000);
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
      if (
        board.player.hand.length === 0 &&
        board.opponent.hand.length === 0 &&
        !board.targeting
      ) {
        roundFinished();
      }
    } catch (e) {
      console.error(e);
    }
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
        return 'Opponent has left the game. Searching for new match...';
      default:
        return declareWinner(board, host.current)
          ? 'Round Won.'
          : 'Round Lost.';
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
    setTimeout(() => {
      updateBoardState(tempBoard);
      host.current = !host.current;
      setPlayerTurn(host.current);
      setOpen(false);
      if (host.current) {
        if (tempBoard.player.score >= 12 || tempBoard.opponent.score >= 12) {
          endGame();
        }
      }
    }, 4000);
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
      }}
    >
      {children}
    </WebSocketProv>
  );
};
