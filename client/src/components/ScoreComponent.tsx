import { cloneDeep } from 'lodash';
import React, { useContext, useEffect } from 'react';
import { Board } from '../models/Board';
import WebSocketContext from '../websockets/WebSocketContext';

const calculateHostScore = (cardsLeft: number): number => {
  return cardsLeft === 0
    ? 6
    : cardsLeft === 1
    ? 4
    : cardsLeft >= 2 && cardsLeft <= 3
    ? 3
    : 2;
};

const calculateScore = (cardsLeft: number): number => {
  return cardsLeft >= 0 && cardsLeft <= 1
    ? 6
    : cardsLeft === 2
    ? 4
    : cardsLeft >= 3 && cardsLeft <= 4
    ? 3
    : 2;
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

interface ScoreComponentProps {
  playerScore: number;
  opponentScore: number;
  deleteName: () => void;
}

export const ScoreComponent = ({
  playerScore,
  opponentScore,
  deleteName,
}: ScoreComponentProps) => {
  const { board, getIsHost, turn, updateBoardState, endGame } =
    useContext(WebSocketContext);

  const setBoardForNewRound = (): Board => {
    let tempBoard = new Board();
    const playerHand = cloneDeep(tempBoard.player.hand);
    const opponentHand = cloneDeep(tempBoard.opponent.hand);
    tempBoard.player = cloneDeep(board.player);
    tempBoard.opponent = cloneDeep(board.opponent);
    tempBoard.opponent.score += getIsHost()
      ? calculateHostScore(board.player.hand.length)
      : calculateScore(board.player.hand.length);

    if (tempBoard.opponent.score >= 12) endGame();
    tempBoard.player.hand = playerHand;
    tempBoard.opponent.hand = opponentHand;

    return tempBoard;
  };

  const handleForfeitClick = () => {
    const tempBoard = setBoardForNewRound();

    updateBoardState(tempBoard);
    turn(tempBoard, undefined, undefined,true);
  };

  useEffect(() => {
    if (board.player.hand.length === 0 && board.opponent.hand.length === 0) {
      if (!getIsHost()) {
        console.log('ENDGAME');
        let tempBoard = new Board();
        const playerHand = cloneDeep(tempBoard.player.hand);
        const opponentHand = cloneDeep(tempBoard.opponent.hand);
        tempBoard.player = cloneDeep(board.player);
        tempBoard.opponent = cloneDeep(board.opponent);

        if (declareWinner(board, getIsHost())) {
          tempBoard.player.score += 6;
        } else {
          tempBoard.opponent.score += 6;
        }

        tempBoard.player.hand = playerHand;
        tempBoard.opponent.hand = opponentHand;
        console.log('ENDGAME BOARD', tempBoard);

        if (tempBoard.player.score >= 12 || tempBoard.opponent.score >= 12) {
          deleteName();
          endGame();
        }

        updateBoardState(tempBoard);
        turn(tempBoard, undefined, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  return (
    <div className='p-3 flex flex-col items-center'>
      <h1>{`${playerScore} - ${opponentScore}`}</h1>
      <button onClick={handleForfeitClick} className='p-2 border-2 rounded-xl'>
        Forfeit round
      </button>
    </div>
  );
};
