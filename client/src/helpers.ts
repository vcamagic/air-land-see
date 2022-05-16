import { Board } from './models/Board';
import { Aerodrome } from './models/Cards/Air/Aerodrome';
import { AirDrop } from './models/Cards/Air/AirDrop';
import { Containment } from './models/Cards/Air/Containment';
import { Support } from './models/Cards/Air/Support';
import { Card } from './models/Cards/Card';
import { Heavy } from './models/Cards/Heavy';
import { Ambush } from './models/Cards/Land/Ambush';
import { CoverFire } from './models/Cards/Land/CoverFire';
import { Disrupt } from './models/Cards/Land/Disrupt';
import { Reinforce } from './models/Cards/Land/Reinforce';
import { Maneuver } from './models/Cards/Maneuver';
import { Blockade } from './models/Cards/Sea/Blockade';
import { Escalation } from './models/Cards/Sea/Escalation';
import { Redeploy } from './models/Cards/Sea/Redeploy';
import { Transport } from './models/Cards/Sea/Transport';
import { Lane } from './models/Lane';
import { ServerBoard } from './models/ServerBoard';
import { ServerCard } from './models/ServerCard';

export const makeBoardInstance = (board: ServerBoard): Board => {
  console.log('SERVER BOARD', board);
  let tempBoard = new Board();
  tempBoard.targeting = board.targeting;
  let tempLanes = board.lanes.map((lane) => {
    let ret = new Lane(lane.type);
    ret.highlight = lane.highlight;
    ret.laneDeploymentStatus = lane.laneDeploymentStatus;
    ret.opponentCards = lane.opponentCards.map((card) =>
      makeCardInstance(card)
    );
    ret.playerCards = lane.playerCards.map((card) => makeCardInstance(card));
    return ret;
  });

  let tempDeck = board.deck.map((card) => makeCardInstance(card));
  tempBoard.lanes = tempLanes;
  tempBoard.player.aerodrome = board.player.aerodrome;
  tempBoard.player.airdrop = board.player.airdrop;
  tempBoard.player.name = board.player.name;
  tempBoard.player.score = board.player.score;
  tempBoard.player.hand = board.player.hand.map((card) =>
    makeCardInstance(card)
  );
  tempBoard.opponent.aerodrome = board.opponent.aerodrome;
  tempBoard.opponent.airdrop = board.opponent.airdrop;
  tempBoard.opponent.name = board.opponent.name;
  tempBoard.opponent.score = board.opponent.score;
  tempBoard.opponent.hand = board.opponent.hand.map((card) =>
    makeCardInstance(card)
  );
  tempBoard.deck = tempDeck;
  console.log('INSTANCE BOARD', tempBoard);
  return tempBoard;
};

const makeCardInstance = (card: ServerCard): Card => {
  let returnCard;
  if (card.name === 'Reinforce') {
    returnCard = new Reinforce();
  } else if (card.name === 'Ambush') {
    returnCard = new Ambush();
  } else if (card.name === 'Maneuver') {
    returnCard = new Maneuver(card.type);
  } else if (card.name === 'Cover Fire') {
    returnCard = new CoverFire();
  } else if (card.name === 'Disrupt') {
    returnCard = new Disrupt();
  } else if (
    card.name === 'Bismark' ||
    card.name === 'Red Baron' ||
    card.name === 'Heavy Tanks'
  ) {
    returnCard = new Heavy(card.type);
  } else if (card.name === 'Support') {
    returnCard = new Support();
  } else if (card.name === 'Air Drop') {
    returnCard = new AirDrop();
  } else if (card.name === 'Aerodrome') {
    returnCard = new Aerodrome();
  } else if (card.name === 'Containment') {
    returnCard = new Containment();
  } else if (card.name === 'Transport') {
    returnCard = new Transport();
  } else if (card.name === 'Escalation') {
    returnCard = new Escalation();
  } else if (card.name === 'Redeploy') {
    returnCard = new Redeploy();
  } else {
    returnCard = new Blockade();
  }
  returnCard.highlight = card.highlight;
  returnCard.faceUp = card.faceUp;
  return returnCard;
};
