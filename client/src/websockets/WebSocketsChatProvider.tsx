import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import React, {
  Children,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { Message } from '../models/Message';
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
  const { connection, getOpponentName, getPlayerName, gameId } =
    useContext(WebSocketContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const joinChat = useCallback(async () => {
    try {
      connection.on('MessageReceived', async (message: string) => {
        const msg = new Message(message, true);
        setMessages((prevState) => [...prevState, msg]);
        console.log(msg);
      });
    } catch (e) {
      console.error(e);
    }
  }, [getOpponentName, gameId, getPlayerName]);

  const sendMessage = (message: string) => {
    connection.invoke('SendMessageAsync', gameId, message);
    const msg = new Message(message, false);
    setMessages((prevState) => [...prevState, msg]);
  };

  return (
    <WebSocketChatProvider value={{ joinChat, messages, sendMessage }}>
      {children}
    </WebSocketChatProvider>
  );
};
