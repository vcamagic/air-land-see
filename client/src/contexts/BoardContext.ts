import React, { createContext } from 'react';
import { Board } from '../models/Board';

interface Action {
  type: string;
  payload: any;
}
interface BoardContextProps {
  boardState: Board;
  boardDispatch: React.Dispatch<Action>;
}

export const initialBoardState = new Board(true);

export const boardReducer = (state: Board, action: Action) => {
  switch (action.type) {
    case 'AddedToLane':
      return state;
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
