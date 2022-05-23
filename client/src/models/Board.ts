import { Aerodrome } from './Cards/Air/Aerodrome';
import { AirDrop } from './Cards/Air/AirDrop';
import { Containment } from './Cards/Air/Containment';
import { Support } from './Cards/Air/Support';
import { Card } from './Cards/Card';
import { Heavy } from './Cards/Heavy';
import { Ambush } from './Cards/Land/Ambush';
import { CoverFire } from './Cards/Land/CoverFire';
import { Disrupt } from './Cards/Land/Disrupt';
import { Reinforce } from './Cards/Land/Reinforce';
import { Maneuver } from './Cards/Maneuver';
import { Blockade } from './Cards/Sea/Blockade';
import { Escalation } from './Cards/Sea/Escalation';
import { Redeploy } from './Cards/Sea/Redeploy';
import { Transport } from './Cards/Sea/Transport';
import { Lane } from './Lane';
import { LaneDeployment } from './LaneDeployment';
import { LaneType } from './LaneType';
import { Player } from './Player';

export class Board {
  lanes!: Lane[];
  player!: Player;
  opponent!: Player;
  deck!: Card[];
  targeting!: boolean;
  disruptSteps!: number;

  constructor(lastLane?: LaneType) {
    if(lastLane!==undefined) {
      this.lanes = [
        new Lane(lastLane + 1),
        new Lane(((lastLane + 1) % 3) + 1),
        new Lane(((lastLane + 2) % 3) + 1),
      ];
    } else {
      const firstLane = Math.floor(Math.random() * 3);
      this.lanes = [
        new Lane(firstLane + 1),
        new Lane(((firstLane + 1) % 3) + 1),
        new Lane(((firstLane + 2) % 3) + 1),
      ];
    }

    this.player = new Player();
    this.opponent = new Player();
    this.disruptSteps = 0;
    this.targeting = false;
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
    for (let i = 0; i < this.lanes.length; i++) {
      let temp = this.lanes[i].playerCards.find((x) => x.id === targetId);
      if (temp !== undefined) {
        return { card: temp, lane: this.lanes[i].type, playerOwned: true };
      }
      temp = this.lanes[i].opponentCards.find((x) => x.id === targetId);
      if (temp !== undefined) {
        return { card: temp, lane: this.lanes[i].type, playerOwned: false };
      }
    }
    return null;
  }

  clearHighlights(): void {
    this.lanes.forEach((lane: Lane) => {
      lane.highlight = false;
      lane.laneDeploymentStatus = LaneDeployment.DEFAULT;
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
            if (lane.playerCards[i].name === 'Cover Fire') {
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
            if (lane.opponentCards[i].name === 'Cover Fire') {
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
    if (support !== null && support.card.isFaceUp()) {
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
        lane.playerCards = lane.playerCards.filter(
          (card) => card.id !== cardId
        );
      });
    }
  }

  addCardToPlayerHand(cardId?: number): void {
    if (cardId !== undefined) {
      let card = this.getCardById(cardId);
      if (card !== null) {
        card.card.faceUp = true;
        card.card.highlight = false;
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
    this.player.hand = [...this.deck.slice(0, 3)];
    this.opponent.hand = [...this.deck.slice(3, 6)];
    this.deck = this.deck.slice(12);
  };

  survivesBlockade(selectedLane: LaneType): boolean {
    let temp = this.getCardById(17);
    if (temp !== null && temp.card.isFaceUp()) {
      let tempLane = this.getAdjacentLanes(temp.lane).find(
        (x) => x.type === selectedLane
      );
      if (tempLane !== undefined) {
        const count =
          (tempLane.playerCards ? tempLane.playerCards.length : 0) +
          (tempLane.opponentCards ? tempLane.opponentCards.length : 0);
        if (count >= 3) {
          return false;
        }
      }
    }
    return true;
  }

  survivesContainment(): boolean {
    let temp = this.getCardById(5);
    return temp !== null && temp.card.isFaceUp() ? false : true;
  }
}
