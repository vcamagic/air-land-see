import React, { useContext, useEffect, useRef, useState } from 'react';
import { Message } from '../models/Message';
import WebSocketContext from '../websockets/WebSocketContext';
import { MessageComponent } from './MessageComponent';

export const ChatComponent = () => {
  const [typedMsg, setTypedMsg] = useState('');
  const { sendMessage, messages } = useContext(WebSocketContext);

  const htmlElRef = useRef<HTMLInputElement>(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  useEffect(() => {
    setFocus();
  },[]);

  const handleTypedMsgChange = (e: any) => {
    setTypedMsg(e.currentTarget.value);
  };

  const sendMsg = () => {
    sendMessage(typedMsg);
    setTypedMsg('');
    console.log(htmlElRef.current);
  };

  const checkForEnter = (e: any) => {
    if (e.key === 'Enter') {
      sendMsg();
      console.log(htmlElRef.current);
    }
  };

  return (
    <div className='flex-col flex w-64 mb-2 ml-2'>
      <div className='flex-1 w-full flex-col flex mb-2 bg-white opacity-80 overflow-y-auto'>
        {messages.map((msg: Message, index) => (
          <div
            key={index}
            className={`${msg.isReceived ? 'items-start' : 'items-end'}`}
          >
            <MessageComponent
              messageText={msg.messageText}
              isReceived={msg.isReceived}
            />
          </div>
        ))}
      </div>
      <div className='flex w-full'>
        <input
          className='flex-1 rounded-xl p-2 mr-2'
          type='text'
          value={typedMsg}
          onChange={handleTypedMsgChange}
          onKeyUp={checkForEnter}
          ref={htmlElRef}
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
