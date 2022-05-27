import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import React, { Children, useCallback, useRef } from 'react';
import WebSocketChatContext, { WebSocketChatProvider } from './WebSocketsChatContext';

interface WebSocketsChatProviderProps {
  children: JSX.Element;
}

export const WebSocketsChatProvider = ({
  children,
}: WebSocketsChatProviderProps) => {
    const connection = useRef(new HubConnectionBuilder()
    .withUrl('http://localhost:5237/chat')
    .configureLogging(LogLevel.Information)
    .build()
    );
  const joinChat = useCallback(async ()=>{

  },[])

  return (
    <WebSocketChatProvider value={{ joinChat }}>{children}</WebSocketChatProvider>
  );
};
