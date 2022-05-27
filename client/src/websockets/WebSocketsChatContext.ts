import React from 'react';

interface WebSocketChatContextProps {
  joinChat: () => Promise<void>;
}

const WebSocketChatContext = React.createContext<WebSocketChatContextProps>({
  joinChat: () => new Promise((resolve) => resolve()),
});

export const WebSocketsChatConsumer = WebSocketChatContext.Consumer;
export const WebSocketChatProvider = WebSocketChatContext.Provider;
export default WebSocketChatContext;
