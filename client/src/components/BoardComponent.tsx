import React, { useContext, useRef, useState } from 'react';
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

export const BoardComponent = () => {
  const {
    board,
    updateBoardState,
    playerTurn,
    turn,
    receivedTargetId,
    resetTargetId,
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
    // if (card instanceof Disrupt) {
    //   updateBoardState((card as Disrupt).deploy(board, lane.type));
    // }
    if (card instanceof Transport) {
      transportActive.current = true;
      tempBoard = card.selectLane(board);
    }
    if (card instanceof Redeploy) {
      tempBoard = (card as Redeploy).executeEffect(board, target.id);
    }
    const tempTarget = board.getCardById(target.id);
    if (tempBoard.targeting) {
      setClickedCard(tempTarget?.card as Card);
    }
    if (
      !tempBoard.targeting ||
      (!tempTarget !== null && !tempTarget?.playerOwned) // mozda se select targets desi pre invertovanja i onda daje kao mete oponent cards
    ) {
      tempBoard.calculateScores();
      turn(tempBoard, target.id);
    }
    resetTargetId();
    tempBoard.calculateScores();
    updateBoardState(tempBoard);
    console.log(tempBoard);
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
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
      turn((card as Disrupt).deploy(board, lane.type));
    }
    if (card instanceof Heavy) {
      boardTemp = (card as Heavy).deploy(board, lane.type);
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
      turn(boardTemp); //play posle flip fieste se desi samo lokalno, da li se uopste posalje, i sta
    }
    if (card instanceof Support) {
      boardTemp = (card as Support).deploy(board, lane.type);
      boardTemp.calculateScores();
      updateBoardState(boardTemp);
      turn(boardTemp);
    }
    if (card instanceof AirDrop) {
      boardTemp = (card as AirDrop).deploy(board, lane.type);
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
      if(temp!== null && temp.card.isFaceUp()){
        if(!card.selectTargets(boardTemp).targeting){
          turn(boardTemp);
        }
      }
      else{
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

  return (
    <div style={{ pointerEvents: `${playerTurn ? 'auto' : 'none'}` }}>
      <div className='flex justify-center h-69'>
        <LaneComponent
          board={board}
          updateClickedLane={updateClickedLane}
          updateTargetedCard={updateTargetedCard}
        />
      </div>
      <div className='h-31'>
        <HandComponent
          cards={board.player.hand}
          updateClickedCard={updateClickedCard}
        />
      </div>
    </div>
  );
};
