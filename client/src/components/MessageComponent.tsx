import React from 'react';

interface MessageComponentProps {
  messageText: string;
  isReceived: boolean;
}

export const MessageComponent = (props: MessageComponentProps) => {
  return (
    <div
      className={`m-0.5 p-2 rounded-xl text-xs ${
        props.isReceived
          ? 'bg-gray-200 text-black text-left'
          : 'bg-orange-500 text-white text-right'
      }`}
    >
      {props.messageText}
    </div>
  );
};
