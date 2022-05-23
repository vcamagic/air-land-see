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
}

export const ScoreComponent = ({
  playerScore,
  opponentScore,
}: ScoreComponentProps) => {
  const {
    board,
    getIsHost,
    turn,
    updateBoardState,
    endGame,
    playerTurn,
    getPlayerName,
    getOpponentName,
  } = useContext(WebSocketContext);

  const setBoardForNewRound = (): Board => {
    let tempBoard = new Board(board.lanes[2].type - 1);
    const playerHand = cloneDeep(tempBoard.player.hand);
    const opponentHand = cloneDeep(tempBoard.opponent.hand);
    tempBoard.player = cloneDeep(board.player);
    tempBoard.player.aerodrome = false;
    tempBoard.player.airdrop = false;
    tempBoard.opponent = cloneDeep(board.opponent);
    tempBoard.opponent.aerodrome = false;
    tempBoard.opponent.airdrop = false;
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
    turn(tempBoard, undefined, undefined, true);
  };

  useEffect(() => {
    if (
      board.player.hand.length === 0 &&
      board.opponent.hand.length === 0 &&
      !board.targeting
    ) {
      if (!getIsHost()) {
        let tempBoard = new Board(board.lanes[2].type - 1);
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
        setTimeout(() => {
          if (tempBoard.player.score >= 12 || tempBoard.opponent.score >= 12) {
            endGame();
          }
          updateBoardState(tempBoard);
          turn(tempBoard, undefined, true);
        }, 2500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  return (
    <div className='p-3 mx-3 flex flex-col items-center h-full w-64'>
      <div className='text-white text-2xl flex flex-col items-center w-full'>
        <div className='flex justify-end text-xl w-full'>
          <h1 className='mr-auto w-5/12 text-left'>{`${getPlayerName()}`}</h1>
          <h1 className='w-2/12 text-center'>VS</h1>
          <h1 className='ml-auto w-5/12 text-right'>{`${getOpponentName()}`}</h1>
        </div>
        <h1>{`${playerScore} - ${opponentScore}`}</h1>
      </div>
      <button
        onClick={handleForfeitClick}
        className='p-2 rounded-xl mt-3 bg-gray-400 text-white hover:cursor-pointer'
      >
        Forfeit round
      </button>
      <div className='mt-auto w-full text-center text-white'>
        <div className='mb-4'>
          Opponent's hand size: {`${board.opponent.hand.length}`}
        </div>
        {playerTurn ? (
          <div className='bg-green-500 text-white animate-bounce rounded-xl w-full'>
            <h1 className='p-2'>YOUR MOVE</h1>
          </div>
        ) : (
          <div className='bg-red-500 text-white rounded-xl w-full'>
            <h1 className='p-2'>OPPONENT MOVE</h1>
          </div>
        )}
      </div>
    </div>
  );
};
