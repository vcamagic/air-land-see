import axios from 'axios';
import { Board } from '../models/Board';

export const updateBoard = (board: Board) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        'https://localhost:7095/api/board',
        board
      );
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
};
