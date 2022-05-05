import _ from 'lodash';
import React, { createContext } from 'react';
import { Board } from '../models/Board';
import { Card } from '../models/Cards/Card';
export interface Action {
  type: string;
  payload: any;
}
interface BoardContextProps {
  boardState: Board;
  boardDispatch: React.Dispatch<Action>;
}

export const initialBoardState = new Board(true);

export const boardReducer = (state: Board, action: Action) => {
  let copyState = _.cloneDeep(state);
  switch (action.type) {
    case 'CardDeployed':
      let card = action.payload.card as Card;
      let newState = _.cloneDeep(
        action.payload.card.deploy(copyState, card.type)
      );
      return newState;
    case 'PlayerHandChange':
      return state;
    default:
      return state;
  }
};

const BoardContext = createContext<BoardContextProps>({
  boardState: initialBoardState,
  boardDispatch: () => {},
});

export const BoardContextConsumer = BoardContext.Consumer;
export const BoardContextProvider = BoardContext.Provider;
export default BoardContext;
