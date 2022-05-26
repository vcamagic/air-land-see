import { cloneDeep } from 'lodash';
import { Card } from './Cards/Card';
import { LaneDeployment } from './LaneDeployment';
import { LaneType } from './LaneType';

export class Lane {
  type!: LaneType;
  playerCards!: Card[];
  opponentCards!: Card[];
  highlight!: boolean;
  laneDeploymentStatus!: LaneDeployment;
  playerScore!: number;
  opponentScore!: number;

  constructor(type: LaneType) {
    this.type = type;
    this.playerCards = [];
    this.opponentCards = [];
    this.highlight = false;
    this.laneDeploymentStatus = LaneDeployment.DEFAULT;
    this.playerScore = 0;
    this.opponentScore = 0;
  }

  reset(): Lane {
    this.playerCards = [];
    this.opponentCards = [];
    this.highlight = false;
    this.laneDeploymentStatus = LaneDeployment.DEFAULT;
    this.playerScore = 0;
    this.opponentScore = 0;
    return cloneDeep(this);
  }

  getLastPlayerCard(): Card | null {
    if (this.playerCards.length === 0) {
      return null;
    }
    return this.playerCards[this.playerCards.length - 1];
  }

  getLastOpponentCard(): Card | null {
    if (this.opponentCards.length === 0) {
      return null;
    }
    return this.opponentCards[this.opponentCards.length - 1];
  }

  addPlayerCard(card: Card): void {
    this.playerCards = [...this.playerCards, card];
  }

  addOpponentCard(card: Card): void {
    this.opponentCards = [...this.opponentCards, card];
    this.opponentScore += card.power;
  }
}
