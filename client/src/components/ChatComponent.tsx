import React, { useContext, useEffect, useRef, useState } from 'react';
import { Message } from '../models/Message';
import WebSocketContext from '../websockets/WebSocketContext';
import { MessageComponent } from './MessageComponent';

export const ChatComponent = () => {
  const [typedMsg, setTypedMsg] = useState('');
  const { sendMessage, messages } = useContext(WebSocketContext);
  const [focus, setToggleFocus] = useState(false);

  const htmlElRef = useRef<HTMLInputElement>(null);
  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  useEffect(() => {
    setFocus();
  }, [focus]);

  const handleTypedMsgChange = (e: any) => {
    setTypedMsg(e.currentTarget.value);
  };

  const sendMsg = () => {
    if (isEmptyOrSpaces(typedMsg)) {
      setTypedMsg('');
      return;
    }
    sendMessage(typedMsg);
    setTypedMsg('');
    setToggleFocus(true);
    console.log(htmlElRef.current);
  };

  const checkForEnter = (e: any) => {
    if (e.key === 'Enter') {
      sendMsg();
      console.log(htmlElRef.current);
      setToggleFocus(true);
    }
  };

  const isEmptyOrSpaces = (str: string) => {
    return str === null || str.match(/^ *$/) !== null;
  };

  return (
    <div className='flex-col flex w-64 h-full'>
      <div
        className='flex-1 flex-col-reverse flex p-2 mb-2 bg-white overflow-y-scroll overflow-x-hidden'
        style={{ background: 'rgba(0, 0, 0, 0.6)' }}
      >
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