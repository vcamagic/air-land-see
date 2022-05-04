import { Lane } from "./Lane";
import { Player } from "./Player";

export class Board {
    lanes!: Lane[];
    player!: Player;
    opponent!: Player;
    playerTurn!: boolean;

    constructor(playerTurn: boolean){
        this.lanes = [];
        this.player = new Player('Player');
        this.opponent = new Player('Opponent');
        this.playerTurn = playerTurn;
    }
}