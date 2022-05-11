import React, { useContext, useState } from 'react';
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
  const { board, updateBoardState } = useContext(WebSocketContext);
  const [clickedCard, setClickedCard] = useState({});
  const [clickedLane, setClickedLane] = useState({});

  const updateClickedCard = (card: Card) => {
    if (!board.targeting) {
      setClickedCard(card);
    }
  };
  const updateClickedLane = (lane: Lane) => {
    setClickedLane(lane);
    checkCardTypeAndDeploy(clickedCard as Card, lane);
  };

  const updateTargetedCard = (card: Card) => {
    checkCardTypeExecute(clickedCard as Card, card);
  };

  const checkCardTypeExecute = (card: Card, target: Card) => {
    // if (card instanceof Reinforce) {
    //   updateBoardState((card as Reinforce).executeEffect(board, lane.type));
    // }
    if (card instanceof Ambush) {
      updateBoardState((card as Ambush).executeEffect(board, target.id));
    }
    if (card instanceof Maneuver) {
      updateBoardState((card as Maneuver).executeEffect(board, target.id));
    }
    // if (card instanceof Disrupt) {
    //   updateBoardState((card as Disrupt).deploy(board, lane.type));
    // }
    // if (card instanceof Transport) {
    //   updateBoardState((card as Transport).deploy(board, lane.type)); //mora da se bira prvo karta koja se pomera pa lejn... crap
    // }
    if (card instanceof Redeploy) {
      updateBoardState((card as Redeploy).deploy(board, target.id));
    }
  };

  const checkCardTypeAndDeploy = (card: Card, lane: Lane) => {
    if (card instanceof Reinforce) {
      updateBoardState((card as Reinforce).deploy(board, lane.type));
    }
    if (card instanceof Ambush) {
      updateBoardState((card as Ambush).deploy(board, lane.type));
    }
    if (card instanceof Maneuver) {
      updateBoardState((card as Maneuver).deploy(board, lane.type));
    }
    if (card instanceof CoverFire) {
      updateBoardState((card as CoverFire).deploy(board, lane.type));
    }
    if (card instanceof Disrupt) {
      updateBoardState((card as Disrupt).deploy(board, lane.type));
    }
    if (card instanceof Heavy) {
      updateBoardState((card as Heavy).deploy(board, lane.type));
    }
    if (card instanceof Support) {
      updateBoardState((card as Support).deploy(board, lane.type));
    }
    if (card instanceof AirDrop) {
      updateBoardState((card as AirDrop).deploy(board, lane.type));
    }
    if (card instanceof Aerodrome) {
      updateBoardState((card as Aerodrome).deploy(board, lane.type));
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
    console.log(board);
  };

  return (
    <>
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
    </>
  );
};
