import { useRef, useState } from 'react';
import { BaseConfig } from '../config/AppConfig';
import { Board } from '../models/Board';
import { WebSocketProv } from './WebSocket';

interface WebSocketProviderProps {
  children: JSX.Element;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [wsState, setWsState] = useState(
    BaseConfig.webSocketState.NOTCONNECTED
  );
  const [board, setBoard] = useState(new Board(true));
  const wsRef = useRef(new WebSocket(BaseConfig.wsUrl));

  const connectWs = () => {
    setWsState(BaseConfig.webSocketState.CONNECTING);

    wsRef.current = new WebSocket(BaseConfig.wsUrl);

    wsRef.current.onopen = () => {
      setWsState(BaseConfig.webSocketState.OPEN);
    };

    wsRef.current.onmessage = (e) => {
      const responseJSON = JSON.parse(e.data);
      setBoard(responseJSON as Board);
    };

    wsRef.current.onclose = () => {
      setWsState(BaseConfig.webSocketState.CLOSED);
    };
  };

  const closeWs = () => {
    wsRef.current.close();
    setWsState(BaseConfig.webSocketState.CLOSED);
  };

  const send = (board: Board) => {
    wsRef.current.send(JSON.stringify(board));
  };

  return (
    <WebSocketProv value={{ closeWs, connectWs, send, wsState, board }}>
      {children}
    </WebSocketProv>
  );
};
