import React from 'react';

interface MessageComponentProps {
  messageText: string;
  isReceived: boolean;
}

export const MessageComponent = (props: MessageComponentProps) => {
  return (
    <div
      className={`p-2 rounded-xl text-xs text-left ${
        props.isReceived ? 'bg-gray-200 text-black' : 'bg-orange-500 text-white'
      }`}
    >
      {props.messageText}
    </div>
  );
};
