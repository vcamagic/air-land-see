import React, { useContext, useState } from 'react';
import { Message } from '../models/Message';
import WebSocketContext from '../websockets/WebSocketContext';
import { MessageComponent } from './MessageComponent';

export const ChatComponent = () => {
  const [typedMsg, setTypedMsg] = useState('');
  const { sendMessage, messages } = useContext(WebSocketContext);
  const handleTypedMsgChange = (e: any) => {
    setTypedMsg(e.currentTarget.value);
  };

  const sendMsg = () => {
    sendMessage(typedMsg);
    setTypedMsg('');
  };

  const checkForEnter = (e: any) => {
    if (e.key === 'Enter') {
      sendMsg();
    }
  };

  return (
    <div className='flex-col flex w-64 mb-2 ml-2'>
      <div className='flex-1 flex-col-reverse flex mb-2 bg-white opacity-80 overflow-y-auto overflow-x-hidden'>
        {messages.map((msg: Message, index) => (
          <div
            key={index}
            className={`flex-none ${
              msg.isReceived ? 'self-start' : 'self-end'
            }`}
          >
            <MessageComponent
              messageText={msg.messageText}
              isReceived={msg.isReceived}
            />
          </div>
        ))}
      </div>
      <div className='flex'>
        <input
          className='flex-1 rounded-xl p-2 mr-2'
          type='text'
          value={typedMsg}
          onChange={handleTypedMsgChange}
          onKeyUp={checkForEnter}
          autoFocus
        ></input>
        <button
          onClick={sendMsg}
          className='flex-initial w-14 rounded-xl bg-orange-500 text-white p-2'
        >
          Send
        </button>
      </div>
    </div>
  );
};
