import { Ambush } from './Cards/Land/Ambush';
import { Card } from './Cards/Card';
import { CoverFire } from './Cards/Land/CoverFire';
import { Heavy } from './Cards/Heavy';
import { Maneuver } from './Cards/Maneuver';
import { Redeploy } from './Cards/Sea/Redeploy';
import { Reinforce } from './Cards/Land/Reinforce';
import { Lane } from './Lane';
import { LaneType } from './LaneType';
import { Player } from './Player';
import { Disrupt } from './Cards/Land/Disrupt';
import { Blockade } from './Cards/Sea/Blockade';
import { Transport } from './Cards/Sea/Transport';
import { Escalation } from './Cards/Sea/Escalation';
import { Support } from './Cards/Air/Support';
import { AirDrop } from './Cards/Air/AirDrop';
import { Aerodrome } from './Cards/Air/Aerodrome';
import { Containment } from './Cards/Air/Containment';

export class Board {
  lanes!: Lane[];
  player!: Player;
  opponent!: Player;
  deck!: Card[]; 

  constructor() {
    const firstLane = Math.floor(Math.random() * 3);

    this.lanes = [
      new Lane(firstLane + 1),
      new Lane(((firstLane + 1) % 3) + 1),
      new Lane(((firstLane + 2) % 3) + 1),
    ];

    this.player = new Player('Player');
    this.opponent = new Player('Opponent');
    this.deck = [
      new Support(),
      new AirDrop(),
      new Maneuver(LaneType.AIR),
      new Aerodrome(),
      new Containment(),
      new Heavy(LaneType.AIR),
      new Reinforce(),
      new Ambush(),
      new Maneuver(LaneType.LAND),
      new CoverFire(),
      new Disrupt(),
      new Heavy(LaneType.LAND),
      new Transport(),
      new Escalation(),
      new Maneuver(LaneType.SEA),
      new Redeploy(),
      new Blockade(),
      new Heavy(LaneType.SEA),
    ];
    this.shuffleDeck();
    this.dealCards();
  }

  nextRound(): void {
    this.deck = [];
    this.lanes.forEach((lane: Lane) => {
      lane.playerCards = [];
      lane.opponentCards = [];
    });
    this.lanes = [this.lanes[2], this.lanes[0], this.lanes[1]];
  }

  getAdjacentLanes(lane: LaneType): Lane[] {
    let adjacent: Lane[] = [];
    switch (this.lanes.findIndex((x) => x.type === lane)) {
      case 0:
        adjacent = [this.lanes[1]];
        break;
      case 1:
        adjacent = [this.lanes[0], this.lanes[2]];
        break;
      case 2:
        adjacent = [this.lanes[1]];
        break;
    }
    return adjacent;
  }

  getLane(type: LaneType): Lane {
    return this.lanes.find((x) => x.type === type) as Lane;
  }

  getCardById(
    targetId: number
  ): { card: Card; lane: LaneType; playerOwned: boolean } | null {
    this.lanes.forEach((lane: Lane) => {
      let temp = lane.playerCards.find((x) => x.id === targetId);
      if (temp !== null) {
        return { card: temp, lane: lane.type, playerOwned: true };
      }
      temp = lane.opponentCards.find((x) => x.id === targetId);
      if (temp !== null) {
        return { card: temp, lane: lane.type, playerOwned: false };
      }
    });
    return null;
  }

  clearHighlights(): void {
    this.lanes.forEach((lane: Lane) => {
      lane.highlight = false;
      lane.playerCards.forEach((card: Card) => {
        card.highlight = false;
      });
      lane.opponentCards.forEach((card: Card) => {
        card.highlight = false;
      });
    });
  }
  calculateScores(): void {
    const escalation = this.getCardById(14);
    this.lanes.forEach((lane: Lane) => {
      let total: number = 0;
      let coveringFire: boolean = false;
      for (let i = lane.playerCards.length - 1; i >= 0; i--) {
        if (coveringFire) {
          total += 4;
        } else {
          if (lane.playerCards[i].isFaceUp()) {
            total += lane.playerCards[i].power;
            if (lane.playerCards[i].name === 'Covering Fire') {
              coveringFire = true;
            }
          } else {
            if (
              escalation !== null &&
              escalation.playerOwned &&
              escalation.card.isFaceUp()
            ) {
              total += 4;
            } else {
              total += 2;
            }
          }
        }
      }
      lane.playerScore = total;
      total = 0;
      coveringFire = false;
      for (let i = lane.opponentCards.length - 1; i >= 0; i--) {
        if (coveringFire) {
          total += 4;
        } else {
          if (lane.opponentCards[i].isFaceUp()) {
            total += lane.opponentCards[i].power;
            if (lane.opponentCards[i].name === 'Covering Fire') {
              coveringFire = true;
            }
          } else {
            if (
              escalation !== null &&
              !escalation.playerOwned &&
              escalation.card.isFaceUp()
            ) {
              total += 4;
            } else {
              total += 2;
            }
          }
        }
      }
      lane.opponentScore = total;
    });
    const support = this.getCardById(1);
    if (support !== null && support.card.isFaceUp) {
      this.getAdjacentLanes(support.lane).forEach((lane: Lane) => {
        if (support.playerOwned) {
          lane.playerScore += 3;
        } else {
          lane.opponentScore += 3;
        }
      });
    }
  }

  removeCardFromLane(cardId?: number): void {
    if (cardId !== undefined) {
      this.lanes.forEach((lane) => {
        lane.playerCards.filter((card) => card.id === cardId);
      });
    }
  }

  addCardToPlayerHand(cardId?: number): void {
    if (cardId !== undefined) {
      let card = this.getCardById(cardId);
      if (card !== null) {
        this.player.hand = [...this.player.hand, card.card];
      }
    }
  }

  removeCardFromPlayerHand(cardId: number): void {
    this.player.hand = this.player.hand.filter((card) => card.id !== cardId);
  }

  private shuffleDeck = () => {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  };

  private dealCards = () => {
    this.player.hand = [...this.deck.slice(0, 3), ...this.deck.slice(6, 9)];
    this.opponent.hand = [...this.deck.slice(3, 6), ...this.deck.slice(9, 12)];
    this.deck = this.deck.slice(12);
  };

  invertBoardState(): Board {
    let temp: Board = new Board();
    temp.deck = this.deck;
    [temp.player, temp.opponent] = [this.opponent, this.player];
    this.lanes.forEach((lane: Lane, index: number) => {
      [temp.lanes[index].playerCards, temp.lanes[index].opponentCards, temp.lanes[index].playerScore, temp.lanes[index].opponentScore] = 
      [lane.opponentCards, lane.playerCards, lane.opponentScore, lane.playerScore];
    });
    return temp;
  }
}
