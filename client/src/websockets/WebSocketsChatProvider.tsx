import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import React, {
  Children,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import WebSocketContext from './WebSocketContext';
import WebSocketChatContext, {
  WebSocketChatProvider,
} from './WebSocketsChatContext';

interface WebSocketsChatProviderProps {
  children: JSX.Element;
}

export const WebSocketsChatProvider = ({
  children,
}: WebSocketsChatProviderProps) => {
  const { getOpponentName, getPlayerName, gameId } =
    useContext(WebSocketContext);
  const connection = useRef(
    new HubConnectionBuilder()
      .withUrl('http://localhost:5237/chat')
      .configureLogging(LogLevel.Information)
      .build()
  );
  const [messages, setMessages] = useState<string[]>([]);
  const joinChat = useCallback(async () => {
    try {
      connection.current.on('MessageReceived', async (message: string) => {
        const msg = `${getOpponentName()}: ${message}`;
        setMessages((prevState) => [...prevState, msg]);
      });
    } catch (e) {
      console.error(e);
    }
  }, [getOpponentName, gameId, getPlayerName]);

  const sendMessage = (message: string) => {
    connection.current.invoke('SendMessageAsync', gameId, message);
    const msg = `${getPlayerName()}: ${message}`;
    setMessages((prevState) => [...prevState, msg]);
  };

  return (
    <WebSocketChatProvider value={{ joinChat, messages, sendMessage }}>
      {children}
    </WebSocketChatProvider>
  );
};
