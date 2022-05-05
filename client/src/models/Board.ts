import { Ambush } from './Cards/Ambush';
import { Card } from './Cards/Card';
import { CoverFire } from './Cards/CoverFire';
import { Heavy } from './Cards/Heavy';
import { Maneuver } from './Cards/Maneuver';
import { Redeploy } from './Cards/Redeploy';
import { Reinforce } from './Cards/Reinforce';
import { Lane } from './Lane';
import { LaneType } from './LaneType';
import { Player } from './Player';

export class Board {
  lanes!: Lane[];
  player!: Player;
  opponent!: Player;
  playerTurn!: boolean;
  deck!: Card[];

  constructor(playerTurn: boolean) {
    const firstLane = Math.floor(Math.random() * 3);
    this.lanes = [
      new Lane(firstLane),
      new Lane((firstLane + 1) % 3),
      new Lane((firstLane + 2) % 3),
    ];
    this.player = new Player('Player');
    this.opponent = new Player('Opponent');
    this.playerTurn = playerTurn;
    this.deck = [
      new Maneuver(LaneType.AIR),
      new Reinforce(),
      new Ambush(),
      new CoverFire(),
      new Heavy(LaneType.LAND),
      new Redeploy(),
    ];
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
}
