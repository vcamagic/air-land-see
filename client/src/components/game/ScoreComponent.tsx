import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import React, { useContext } from 'react';
import { calculateHostScore, calculateScore } from '../../helpers';
import WebSocketContext from '../../websockets/WebSocketContext';

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
    open,
    playerTurn,
    disableInput,
    getPlayerName,
    getOpponentName,
    getPopupText,
    concede,
    requeue,
    getIsHost,
    closeNotification,
  } = useContext(WebSocketContext);

  const handleForfeitClick = () => {
    if (!playerTurn) {
      return;
    }
    concede();
  };

  const handleRequeueClick = () => {
    requeue();
  };

  const handleCloseClick = () => {
    closeNotification();
  };

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className='p-3 mx-3 flex flex-col items-center h-full w-64'>
      <Modal open={open}>
        <Box sx={style} className='rounded-xl'>
          <Typography sx={{ mt: 1, mb: 1, textAlign: 'center' }}>
            <div>
              <div>{getPopupText()}</div>
              {getPopupText() ===
              'Opponent has left the game. Search for a new match?' ? (
                <button
                  className='mt-4 px-3 py-2 rounded-xl bg-green-400 text-white'
                  onClick={handleRequeueClick}
                >
                  Find new Match
                </button>
              ) : (
                <button
                  className='mt-4 px-3 py-2 rounded-xl bg-green-400 text-white'
                  onClick={handleCloseClick}
                >
                  View Battlefield
                </button>
              )}
            </div>
          </Typography>
        </Box>
      </Modal>
      <div className='text-white text-2xl flex flex-col items-center w-full'>
        <div className='flex justify-end text-xl w-full'>
          <h1 className='mr-auto w-5/12 text-left'>{`${getPlayerName()}`}</h1>
          <h1 className='w-2/12 text-center italic'>VS</h1>
          <h1 className='ml-auto w-5/12 text-right'>{`${getOpponentName()}`}</h1>
        </div>
        <div className='flex'>
          <div>
            {board.player.aerodrome}
            {board.player.airdrop}
          </div>
          <h1 className='italic'>{`${playerScore} - ${opponentScore}`}</h1>
          <div></div>
        </div>
      </div>
      <button
        onClick={handleForfeitClick}
        disabled={!playerTurn}
        className={`p-2 rounded-xl mt-3 bg-gray-400 text-white`}
      >
        Forfeit round
        <div
          className={`text-xs italic ${
            disableInput ? 'pointer-events-none' : ''
          }`}
        >
          Opponent gains{' '}
          <span className='ml-1 mr-1'>
            {getIsHost()
              ? calculateHostScore(board.player.hand.length)
              : calculateScore(board.player.hand.length)}
          </span>
          points
        </div>
      </button>
      <div className='mt-auto w-full text-center text-white'>
        <div className='mb-4 flex items-center'>
          <div>Opponent's cards: {`${board.opponent.hand.length}`}</div>
          {getIsHost() ? (
            <div className='rounded-full bg-green-400 p-2 ml-auto italic'>
              1st
            </div>
          ) : (
            <div className='rounded-full bg-amber-600 p-2 ml-auto italic'>
              2nd
            </div>
          )}
        </div>
        {playerTurn ? (
          <div className='bg-green-500 text-white animate-bounce rounded-xl w-full'>
            <h1 className='p-2'>YOUR MOVE</h1>
          </div>
        ) : (
          <div className='bg-red-500 text-white rounded-xl w-full'>
            <h1 className='p-2'>OPPONENT'S MOVE</h1>
          </div>
        )}
      </div>
    </div>
  );
};
