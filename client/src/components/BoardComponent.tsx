import React, { useContext, useState } from 'react';
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
  const { board, updateBoardState, playerTurn, turn, receivedTargetId } =
    useContext(WebSocketContext);
  const [clickedCard, setClickedCard] = useState({});
  const [targetedCard, setTargetedCard] = useState({});
  const [clickedLane, setClickedLane] = useState({});

  const updateClickedCard = (card: Card) => {
    if (!board.targeting) {
      setClickedCard(card);
    }
  };
  const updateClickedLane = (lane: Lane, deploy?: boolean) => {
    console.log(lane, deploy);
    if (receivedTargetId !== -1) {
      setTargetedCard(board.getCardById(receivedTargetId)?.card as Card);
    }
    console.log(targetedCard);
    setClickedLane(lane);
    if (deploy === true) {
      checkCardTypeAndDeploy(clickedCard as Card, lane);
    }
    if (deploy === false) {
      improvise(clickedCard as Card, lane);
    }
    if (
      deploy === undefined &&
      lane.highlight &&
      (clickedCard instanceof Reinforce || targetedCard instanceof Reinforce)
    ) {
      let tempBoard;
      if (clickedCard instanceof Reinforce) {
        tempBoard = clickedCard.executeEffect(board, undefined, lane);
      } else {
        tempBoard = (targetedCard as Reinforce).executeEffect(
          board,
          undefined,
          lane
        );
      }
      console.log('reinforce after lane selection board', tempBoard);
      updateBoardState(tempBoard);
      turn(tempBoard);
    }
  };

  const improvise = (card: Card, lane: Lane) => {
    const tempBoard = card.improvise(board, lane.type);
    updateBoardState(tempBoard);
    turn(tempBoard);
  };

  const updateTargetedCard = (card: Card) => {
    setTargetedCard(card);
    checkCardTypeExecute(clickedCard as Card, card);
  };

  const checkCardTypeExecute = (card: Card, target: Card) => {
    if (receivedTargetId !== -1) {
      setClickedCard(board.getCardById(receivedTargetId)?.card as Card);
    }
    let tempBoard: Board = board;
    if (card instanceof Ambush) {
      tempBoard = (card as Ambush).executeEffect(board, target.id);
    }
    if (card instanceof Maneuver) {
      tempBoard = (card as Maneuver).executeEffect(board, target.id);
    }
    // if (card instanceof Disrupt) {
    //   updateBoardState((card as Disrupt).deploy(board, lane.type));
    // }
    // if (card instanceof Transport) {
    //   updateBoardState((card as Transport).deploy(board, lane.type)); //mora da se bira prvo karta koja se pomera pa lejn... crap
    // }
    if (card instanceof Redeploy) {
      tempBoard = (card as Redeploy).executeEffect(board, target.id);
    }
    const tempTarget = board.getCardById(target.id);
    if (
      !tempBoard.targeting ||
      (!tempTarget !== null && !tempTarget?.playerOwned)
    ) {
      turn(tempBoard, target.id);
    }
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
      }
      updateBoardState(boardTemp);
    }
    if (card instanceof Ambush) {
      let boardTemp = (card as Ambush).deploy(board, lane.type);
      if (!card.selectTargets(boardTemp).targeting) {
        turn(boardTemp);
      }
      updateBoardState(boardTemp);
    }
    if (card instanceof Maneuver) {
      boardTemp = (card as Maneuver).deploy(board, lane.type);
      const temp = boardTemp.getCardById(card.id);
      if (temp !== null && temp.card.isFaceUp()) {
        if (!card.selectTargets(boardTemp, lane.type).targeting) {
          turn(boardTemp);
        }
      }
      updateBoardState(boardTemp);
    }
    if (card instanceof CoverFire) {
      updateBoardState((card as CoverFire).deploy(board, lane.type));
    }
    if (card instanceof Disrupt) {
      updateBoardState((card as Disrupt).deploy(board, lane.type));
      turn((card as Disrupt).deploy(board, lane.type));
    }
    if (card instanceof Heavy) {
      const tempBoard = (card as Heavy).deploy(board, lane.type);
      updateBoardState(tempBoard);
      console.log('tempBoard posle igranja heavy', tempBoard);
      turn(tempBoard); //play posle flip fieste se desi samo lokalno, da li se uopste posalje, i sta
    }
    if (card instanceof Support) {
      updateBoardState((card as Support).deploy(board, lane.type));
    }
    if (card instanceof AirDrop) {
      updateBoardState((card as AirDrop).deploy(board, lane.type));
    }
    if (card instanceof Aerodrome) {
      const tempBoard = (card as Aerodrome).deploy(board, lane.type);
      updateBoardState(tempBoard);
      turn(tempBoard);
    }
    if (card instanceof Containment) {
      updateBoardState((card as Containment).deploy(board, lane.type));
    }
    if (card instanceof Transport) {
      updateBoardState((card as Transport).deploy(board, lane.type));
    }
    if (card instanceof Escalation) {
      updateBoardState((card as Escalation).deploy(board, lane.type));
    }
    if (card instanceof Redeploy) {
      updateBoardState((card as Redeploy).deploy(board, lane.type));
    }
    if (card instanceof Blockade) {
      updateBoardState((card as Blockade).deploy(board, lane.type));
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
