import { Card } from "./Cards/Card";
import { LaneType } from "./LaneType";

export class Lane {
    type!: LaneType;
    playerCards!: Card[];
    opponentCards!:Card[];
    highlight!: boolean;
    playerScore!: number;
    opponentScore!: number;

    constructor(type: LaneType) {
        this.type = type;
        this.playerCards = [];
        this.opponentCards = [];
        this.highlight = false;
        this.playerScore = 0;
        this.opponentScore = 0;
    }

    getLastPlayerCard(): Card | null {
        if(this.playerCards.length === 0) {
            return null;
        }
        return this.playerCards[this.playerCards.length];
    }

    getLastOpponentCard(): Card | null {
        if(this.opponentCards.length === 0) {
            return null;
        }
        return this.opponentCards[this.opponentCards.length];
    }

    addPlayerCard(card: Card): void {
        this.playerCards = [...this.playerCards, card];
    }

    addOpponentCard(card: Card): void {
        this.opponentCards = [...this.opponentCards, card];
    }
}