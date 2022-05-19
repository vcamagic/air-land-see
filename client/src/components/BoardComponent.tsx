import React, { useContext, useEffect, useRef, useState } from 'react';
import { Board } from '../models/Board';
import { Aerodrome } from '../models/Cards/Air/Aerodrome';
import { AirDrop } from '../models/Cards/Air/AirDrop';
import { Containment } from '../models/Cards/Air/Containment';
import { Support } from '../models/Cards/Air/Support';
import { Card } from '../models/Cards/Card';
import { Heavy } from '../models/Cards/Heavy';
import { Ambush } from '../models/Cards/Land/Ambush';
import { CoverFire } from '../models/Cards/Land/CoverFire';
import { Disrupt } from '../models/Cards/Land/Disrupt';
import { Reinforce } from '../models/Cards/Land/Reinforce';
import { Maneuver } from '../models/Cards/Maneuver';
import { Blockade } from '../models/Cards/Sea/Blockade';
import { Escalation } from '../models/Cards/Sea/Escalation';
import { Redeploy } from '../models/Cards/Sea/Redeploy';
import { Transport } from '../models/Cards/Sea/Transport';
import { Lane } from '../models/Lane';
import WebSocketContext from '../websockets/WebSocketContext';
import { HandComponent } from './HandComponent';
import { LaneComponent } from './LaneComponent';
import { ScoreComponent } from './ScoreComponent';

export const BoardComponent = () => {
  let audio = new Audio("/DROPDABOMBMAN.mp3");
  const {
    board,
    updateBoardState,
    playerTurn,
    turn,
    receivedTargetId,
    resetTargetId,
    gameEnded,
    gameStarted,
    getIsHost,
  } = useContext(WebSocketContext);
  const [clickedCard, setClickedCard] = useState({});
  const [targetedCard, setTargetedCard] = useState({});
  const transportActive = useRef(false);

  const updateClickedCard = (card: Card) => {
    if (!board.targeting) {
      setClickedCard(card);
    }
  };

  const updateClickedLane = (lane: Lane, deploy?: boolean) => {
    if (receivedTargetId !== -1) {
      setTargetedCard(board.getCardById(receivedTargetId)?.card as Card);
    }
    if (deploy === true) {
      checkCardTypeAndDeploy(clickedCard as Card, lane);
    }
    if (deploy === false) {
      improvise(clickedCard as Card, lane);
    }
    if (deploy === undefined && lane.highlight) {
      let tempBoard = new Board();
      if (
        clickedCard instanceof Reinforce ||
        targetedCard instanceof Reinforce
      ) {
        if (clickedCard instanceof Reinforce) {
          tempBoard = clickedCard.executeEffect(board, undefined, lane);
        } else {
          tempBoard = (targetedCard as Reinforce).executeEffect(
            board,
            undefined,
            lane
          );
        }
      }
      if (transportActive.current === true) {
        const transport = board.getCardById(13)?.card as Transport;
        tempBoard = transport.executeEffect(
          board,
          (targetedCard as Card).id,
          lane
        );
        transportActive.current = false;
      }

      if (!tempBoard.targeting && tempBoard.disruptSteps === 1) {
        const disrupt = tempBoard.getCardById(11);
        if (disrupt !== null && disrupt.card.faceUp) {
          setClickedCard(disrupt.card);
          (disrupt.card as Disrupt).selectTargetsNext(tempBoard);
          if (!disrupt.playerOwned) {
            turn(tempBoard, disrupt.card.id, true);
          }
        }
        tempBoard.calculateScores();
        resetTargetId();
        updateBoardState(tempBoard);
        return;
      }

      tempBoard.calculateScores();
      updateBoardState(tempBoard);
      resetTargetId();
      turn(tempBoard);
    }
  };

  const improvise = (card: Card, lane: Lane) => {
    const tempBoard = card.improvise(board, lane.type);
    tempBoard.calculateScores();
    updateBoardState(tempBoard);
    turn(tempBoard);
  };

  const updateTargetedCard = (card: Card) => {
    setTargetedCard(card);
    if (receivedTargetId !== -1) {
      const tempTargetCard = board.getCardById(receivedTargetId)?.card as Card;
      setClickedCard(tempTargetCard);
      checkCardTypeExecute(tempTargetCard as Card, card);
    } else {
      checkCardTypeExecute(clickedCard as Card, card);
    }
  };

  const checkCardTypeExecute = (card: Card, target: Card) => {
    let tempBoard: Board = board;
    if (card instanceof Ambush) {
      tempBoard = card.executeEffect(board, target.id);
    }
    if (card instanceof Maneuver) {
      tempBoard = card.executeEffect(board, target.id);
    }
    if (card instanceof Disrupt) {
      const temp = board.getCardById(11);
      if (temp !== null && temp.card.faceUp) {
        tempBoard = card.executeEffect(board, target.id);
        if (tempBoard.disruptSteps === 1 && !getIsHost()) {
          if (tempBoard.player.hand.length < tempBoard.opponent.hand.length) {
            resetTargetId();
            tempBoard.disruptSteps = (tempBoard.disruptSteps + 1) % 2;
            tempBoard.calculateScores();
            updateBoardState(tempBoard);
            turn(tempBoard, target.id, true);
            return;
          }
        }
        tempBoard.disruptSteps = (tempBoard.disruptSteps + 1) % 2;
      }
    }
    if (card instanceof Transport) {
      transportActive.current = true;
      tempBoard = card.selectLane(board);
    }
    if (card instanceof Redeploy) {
      tempBoard = (card as Redeploy).executeEffect(board, target.id);
    }

    const tempTarget = board.getCardById(target.id);

    //ako je disrupt bio target nekog flip efekta, hendla kome da passuje priority
    if (
      tempTarget?.card.name === 'Disrupt' &&
      tempTarget.card.faceUp &&
      (card.name === 'Maneuver' || card.name === 'Ambush')
    ) {
      tempBoard.calculateScores();
      resetTargetId();
      setClickedCard(tempTarget.card as Card);
      tempBoard.disruptSteps = 0;
      updateBoardState(tempBoard);
      if (tempTarget.playerOwned) {
        turn(tempBoard, target.id);
      }
      return;
    }

    if (!tempBoard.targeting && tempBoard.disruptSteps === 1) {
      const disrupt = tempBoard.getCardById(11);
      if (disrupt !== null && disrupt.card.faceUp) {
        setClickedCard(disrupt.card);
        (disrupt.card as Disrupt).selectTargetsNext(tempBoard);
        if (!disrupt.playerOwned) {
          turn(tempBoard, disrupt.card.id, true);
        }
      }
      tempBoard.calculateScores();
      resetTargetId();
      updateBoardState(tempBoard);
      return;
    }

    if (tempBoard.targeting && !(card instanceof Transport)) {
      //azuriraj clicked card jer clicked card handler ne reaguje ako je targeting active
      setClickedCard(tempTarget?.card as Card);
    }

    if (
      !tempBoard.targeting ||
      (!tempTarget !== null && !tempTarget?.playerOwned)
    ) {
      //ili je gotov potez jer targetinga vise nema, ili je potreban input od oponenta jer je targetovana karta njegova ***ovo se salje i ako karta nema efekat??***
      tempBoard.calculateScores();
      if (card instanceof Redeploy && tempBoard.disruptSteps === 1) {
        turn(tempBoard, undefined, true);
      } else {
        turn(tempBoard, target.id);
      }
    }
    resetTargetId();
    tempBoard.calculateScores();
    updateBoardState(tempBoard);
  };

  const checkCardTypeAndDeploy = (card: Card, lane: Lane) => {
    let boardTemp!: Board;
    if (card instanceof Reinforce) {
      boardTemp = (card as Reinforce).deploy(board, lane.type);
      const temp = boardTemp.getCardById(card.id);
      if (temp !== null && temp.card.isFaceUp()) {
        boardTemp = card.selectTargets(boardTemp, lane.type);
      } else {
        turn(boardTemp);
      }
      updateBoardState(boardTemp);
    }
    if (card instanceof Ambush) {
      boardTemp = (card as Ambush).deploy(board, lane.type);
      const temp = boardTemp.getCardById(card.id);
      if (temp === null || !temp.card.isFaceUp()) {
        turn(boardTemp);
      }
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
    }
    if (card instanceof Maneuver) {
      boardTemp = (card as Maneuver).deploy(board, lane.type);
      const temp = boardTemp.getCardById(card.id);
      if (temp !== null && temp.card.isFaceUp()) {
        if (!card.selectTargets(boardTemp, lane.type).targeting) {
          turn(boardTemp);
        }
      } else {
        turn(boardTemp);
      }
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
    }
    if (card instanceof CoverFire) {
      boardTemp = (card as CoverFire).deploy(board, lane.type);
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
      turn(boardTemp);
    }
    if (card instanceof Disrupt) {
      boardTemp = (card as Disrupt).deploy(board, lane.type);
      const temp = boardTemp.getCardById(card.id);
      if (temp !== null && temp.card.isFaceUp()) {
        if (card.selectTargets(boardTemp).targeting) {
          // found target on opposing side, calling turn method
          boardTemp.disruptSteps = 0;
          turn(boardTemp, card.id);
        } else {
          // no targets found on opponent side, call selectTargetNext
          boardTemp.disruptSteps = 1;
          card.selectTargetsNext(boardTemp);
        }
      } else {
        turn(boardTemp);
      }
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
    }
    if (card instanceof Heavy) {
      boardTemp = (card as Heavy).deploy(board, lane.type);
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
      turn(boardTemp); //play posle flip fieste se desi samo lokalno, da li se uopste posalje, i sta
    }
    if (card instanceof Support) {
      boardTemp = (card as Support).deploy(board, lane.type);
      audio.play();
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
      turn(boardTemp);
    }
    if (card instanceof AirDrop) {
      boardTemp = (card as AirDrop).deploy(board, lane.type);
      audio.play();
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
      turn(boardTemp);
    }
    if (card instanceof Aerodrome) {
      boardTemp = (card as Aerodrome).deploy(board, lane.type);
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
      turn(boardTemp);
    }
    if (card instanceof Containment) {
      boardTemp = (card as Containment).deploy(board, lane.type);
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
      turn(boardTemp);
    }
    if (card instanceof Transport) {
      boardTemp = (card as Transport).deploy(board, lane.type);
      const temp = boardTemp.getCardById(card.id);
      if (temp === null || !temp.card.isFaceUp()) {
        turn(boardTemp);
      }
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
    }
    if (card instanceof Escalation) {
      boardTemp = (card as Escalation).deploy(board, lane.type);
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
      turn(boardTemp);
    }
    if (card instanceof Redeploy) {
      boardTemp = (card as Redeploy).deploy(board, lane.type);
      const temp = boardTemp.getCardById(card.id);
      if (temp !== null && temp.card.isFaceUp()) {
        if (!card.selectTargets(boardTemp).targeting) {
          turn(boardTemp);
        }
      } else {
        turn(boardTemp);
      }
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
    }
    if (card instanceof Blockade) {
      boardTemp = (card as Blockade).deploy(board, lane.type);
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
      turn(boardTemp);
    }
  };

  useEffect(() => {
    if (gameEnded) window.location.reload();
  }, [gameEnded]);

  const Bbbboard = () =>
    gameStarted ? (
      <div style={{ pointerEvents: `${playerTurn ? 'auto' : 'none'}` }}>
        <div className='flex justify-center h-69'>
          <LaneComponent
            board={board}
            updateClickedLane={updateClickedLane}
            updateTargetedCard={updateTargetedCard}
          />
        </div>
        <div className='h-31 flex'>
          <HandComponent
            cards={board.player.hand}
            updateClickedCard={updateClickedCard}
          />
          <div className='flex-none'>
            <ScoreComponent
              playerScore={board.player.score}
              opponentScore={board.opponent.score}
            />
          </div>
        </div>
      </div>
    ) : (
      <div className='p-3 text-7xl text-white grid place-items-center h-screen'>
        Looking for opponent...
      </div>
    );

  return <Bbbboard />;
};
