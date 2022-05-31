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
import { Card } from '../models/Cards/Card';
import { Lane } from '../models/Lane';
import { Message } from '../models/Message';
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
  const [gameConceded, setGameConceded] = useState(false);
  const [gameConcededByPlayer, setGameConcededByPlayer] = useState(false);
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
          yourTurnAudio.play();
          if (
            temp.player.hand.length === 6 &&
            temp.opponent.hand.length === 6 &&
            isForfeit
          ) {
            setOpen(true);
            setTimeout(() => {
              setOpen(false);
            }, 4000);
          }
        }
      );

      connection.current.on(
        'EnemyConcede',
        async (serverBoard: ServerBoard) => {
          let temp = invertBoardState(makeBoardInstance(serverBoard));
          temp.calculateScores();
          updateBoardState(temp);
          host.current = !host.current;
          setPlayerTurn(host.current);
          setOpen(true);
          setGameConceded(true);
          setGameConcededByPlayer(false);
          yourTurnAudio.play();
          setTimeout(() => {
            setOpen(false);
            setGameConceded(false);
          }, 4000);
        }
      );

      connection.current.on('ReceiveMessage', async (message: string) => {
        const msg = new Message(message, true);
        setMessages((prevState) => [msg, ...prevState]);
        msgReceivedAudio.play();
      });

      connection.current.on('GameEnded', () => {
        setOpen(true);
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
      console.error(e);
    }
  };

  const concede = async () => {
    try {
      const tempBoard = board.nextRound();
      tempBoard.opponent.score += getIsHost()
        ? calculateHostScore(board.player.hand.length)
        : calculateScore(board.player.hand.length);
      updateBoardState(tempBoard);
      host.current = !host.current;
      setPlayerTurn(host.current);
      await connection.current.invoke('Concede', gameId.current, tempBoard);
      if (tempBoard.opponent.score >= 12) {
        endGame();
      } else {
        setOpen(true);
        setGameConceded(true);
        setGameConcededByPlayer(true);
        yourTurnAudio.play();
        setTimeout(() => {
          setOpen(false);
          setGameConceded(false);
        }, 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const showRoundEndModalAndRestartGame = () => {
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
    updateBoardState(tempBoard);
    turn(tempBoard, undefined, undefined, true);
    if (tempBoard.player.score >= 12 || tempBoard.opponent.score >= 12) {
      endGame();
    }

    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 4000);
  };

  const getPopupText = (): string => {
    if (board.player.score >= 12) {
      return 'Congratulations Commander, Victory is yours.';
    }
    if (board.opponent.score >= 12) {
      return `Mission Failed, we'll get em next Time.`;
    }
    if (gameConceded) {
      return gameConcededByPlayer
        ? 'Round Forfeit.'
        : 'Opponent Forfeit the Round.';
    }
    return declareWinner(board, !host.current) ? 'Round Won.' : 'Round Lost.';
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
