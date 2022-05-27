import React from 'react';

interface MessageComponentProps {
  messageText: string;
  isReceived: boolean;
}

export const MessageComponent = (props: MessageComponentProps) => {
  return (
    <div
      className={`my-0.5 p-2 rounded-xl text-xs ${
        props.isReceived
          ? 'bg-gray-200 text-black ml-1'
          : 'bg-orange-500 text-white mr-1'
      }`}
    >
      {props.messageText}
    </div>
  );
};
