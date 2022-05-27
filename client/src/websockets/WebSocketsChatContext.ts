import React from 'react';
import { Message } from '../models/Message';

interface WebSocketChatContextProps {
  joinChat: () => Promise<void>;
  sendMessage: (message: string) => void;
  messages: Message[];
}

const WebSocketChatContext = React.createContext<WebSocketChatContextProps>({
  joinChat: () => new Promise((resolve) => resolve()),
  messages: [],
  sendMessage: (message: string) => {},
});

export const WebSocketsChatConsumer = WebSocketChatContext.Consumer;
export const WebSocketChatProvider = WebSocketChatContext.Provider;
export default WebSocketChatContext;
