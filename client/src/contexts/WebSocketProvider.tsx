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
      console.log('socket open');
      setWsState(BaseConfig.webSocketState.OPEN);
    };

    wsRef.current.onmessage = (e) => {
      const responseJSON = JSON.parse(e.data);
      setBoard(responseJSON as Board);
    };

    wsRef.current.onclose = () => {
      console.log('socket closed by server');
      setWsState(BaseConfig.webSocketState.CLOSED);
    };
  };

  const closeWs = () => {
    wsRef.current.close();
    console.log('socket closed by client');
    setWsState(BaseConfig.webSocketState.CLOSED);
  };

  return (
    <WebSocketProv value={{ closeWs, connectWs, wsState, board }}>
      {children}
    </WebSocketProv>
  );
};
