import { Card } from "./Cards/Card";
import { Lane } from "./Lane";
import { LaneType } from "./LaneType";
import { Player } from "./Player";

export class Board {
    lanes!: Lane[];
    player!: Player;
    opponent!: Player;
    playerTurn!: boolean;
    deck!: Card[];


    constructor(playerTurn: boolean) {
        const firstLane = Math.floor(Math.random() * 3);
        this.lanes = [new Lane(firstLane), new Lane((firstLane + 1) % 3), new Lane((firstLane + 2) % 3)];
        this.player = new Player('Player');
        this.opponent = new Player('Opponent');
        this.playerTurn = playerTurn;
        this.deck = [];
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
        switch(this.lanes.findIndex(x=>x.type === lane)) {
            case 0: adjacent = [this.lanes[1]]; break;
            case 1: adjacent = [this.lanes[0], this.lanes[2]]; break;
            case 2: adjacent =  [this.lanes[1]]; break;
        }
        return adjacent;
    }

    getLane(type: LaneType): Lane {
        return this.lanes.find(x=>x.type === type) as Lane;
    }

    getCardById(targetId: number): {card: Card, lane: LaneType, playerOwned: boolean} | null {
        this.lanes.forEach((lane: Lane) => {
            let temp = lane.playerCards.find(x=>x.id === targetId);
            if(temp !== null){
                return {card: temp, lane: lane.type, playerOwned: true };
            }
            temp = lane.opponentCards.find(x => x.id === targetId);
            if(temp !== null) {
                return {card: temp, lane: lane.type, playerOwned: false };
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
        })
    }

    calculateScores(): void {
        const escalation = this.getCardById(14);
        this.lanes.forEach((lane: Lane) => {
            let total: number = 0;
            let coveringFire: boolean = false;
            for(let i = lane.playerCards.length - 1; i>=0; i--){
                if(coveringFire) {
                    total+=4;
                } else {
                    if(lane.playerCards[i].isFaceUp()){
                        total+=lane.playerCards[i].power;
                        if(lane.playerCards[i].name === 'Covering Fire') {
                            coveringFire = true;
                        }
                    } else {
                        if(escalation!==null && escalation.playerOwned && escalation.card.isFaceUp()){
                            total+=4;
                        } else {
                            total+=2;
                        }
                    }
                }
            }
        });
    }
}