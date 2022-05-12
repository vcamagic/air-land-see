import { Card } from './Cards/Card';
import { Lane } from './Lane';
import { Player } from './Player';

export class ServerBoard {
  lanes!: Lane[];
  player!: Player;
  opponent!: Player;
  deck!: Card[];
  playerTurn!: boolean;
}
