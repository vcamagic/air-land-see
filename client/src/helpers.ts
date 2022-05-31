import { cloneDeep } from 'lodash';
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
  let tempBoard = new Board();
  tempBoard.targeting = board.targeting;
  tempBoard.disruptSteps = board.disruptSteps;
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
  tempBoard.player.score = board.player.score;
  tempBoard.player.hand = board.player.hand.map((card) =>
    makeCardInstance(card)
  );
  tempBoard.opponent.aerodrome = board.opponent.aerodrome;
  tempBoard.opponent.airdrop = board.opponent.airdrop;
  tempBoard.opponent.score = board.opponent.score;
  tempBoard.opponent.hand = board.opponent.hand.map((card) =>
    makeCardInstance(card)
  );
  tempBoard.deck = tempDeck;
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

export const calculateHostScore = (cardsLeft: number): number => {
  return cardsLeft === 0
    ? 6
    : cardsLeft === 1
    ? 4
    : cardsLeft >= 2 && cardsLeft <= 3
    ? 3
    : 2;
};

export const calculateScore = (cardsLeft: number): number => {
  return cardsLeft >= 0 && cardsLeft <= 1
    ? 6
    : cardsLeft === 2
    ? 4
    : cardsLeft >= 3 && cardsLeft <= 4
    ? 3
    : 2;
};

export const invertBoardState = (board: Board): Board => {
  let temp: Board = new Board();
  temp.targeting = board.targeting;
  temp.disruptSteps = board.disruptSteps;
  temp.deck = board.deck;
  [temp.player, temp.opponent] = [board.opponent, board.player];
  board.lanes.forEach((lane: Lane, index: number) => {
    [
      temp.lanes[index].playerCards,
      temp.lanes[index].opponentCards,
      temp.lanes[index].playerScore,
      temp.lanes[index].opponentScore,
      temp.lanes[index].type,
      temp.lanes[index].highlight,
    ] = [
      lane.opponentCards,
      lane.playerCards,
      lane.opponentScore,
      lane.playerScore,
      lane.type,
      lane.highlight,
    ];
  });
  return temp;
};

export const highlightChanges = (originalBoard: Board, newBoard: Board): Board => {
    newBoard.lanes.forEach((lane: Lane, index: number) => {
      lane.playerCards.forEach((card: Card, cardIndex: number) => {
        const originalCard = originalBoard.lanes[index].playerCards[cardIndex];
        if (
          originalCard === undefined ||
          (originalCard.isFaceUp() !== card.isFaceUp() &&
            originalCard.id === card.id)
        ) {
          card.highlightChange = true;
        } else {
          card.highlightChange = false;
        }
      });
      lane.opponentCards.forEach((card: Card, cardIndex: number) => {
        const originalCard =
          originalBoard.lanes[index].opponentCards[cardIndex];
        if (
          originalCard === undefined ||
          (originalCard.isFaceUp() !== card.isFaceUp() &&
            originalCard.id === card.id)
        ) {
          card.highlightChange = true;
        } else {
          card.highlightChange = false;
        }
      });
    });
    return cloneDeep(newBoard);
  };

  export const declareWinner = (board: Board, isHost: boolean): boolean => {
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
