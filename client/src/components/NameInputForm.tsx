import React, { useContext, useState } from 'react';
import WebSocketContext from '../websockets/WebSocketContext';

interface NameInputFormProps {
  insertName: () => void;
}

function isEmptyOrSpaces(str: string) {
  return str === null || str.match(/^ *$/) !== null;
}

export const NameInputForm = (props: NameInputFormProps) => {
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const { joinGame } = useContext(WebSocketContext);
  const handleNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const handleNameSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (name === '' || name.length > 10 || isEmptyOrSpaces(name)) {
      setErrorMessage(true);
      return;
    }
    props.insertName();
    await joinGame(name);
  };

  return (
    <div className='grid place-items-center h-screen'>
      <form onSubmit={handleNameSubmit} className='w-247'>
        <div className='mb-3'>
          <label
            htmlFor='name'
            className='block mb-2 text-2xl font-medium text-white'
          >
            Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            className='border border-gray-300 text-sm rounded-lg focus:ring-white focus:border-white block w-full p-3'
            onChange={handleNameChange}
            maxLength={10}
          />
        </div>
        <button
          type='submit'
          className='text-white bg-green-500 hover:bg-green-600 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center'
        >
          Submit
        </button>
        <div
          className={`text-red-300 font-bold text-xl ${
            errorMessage ? 'visible' : 'invisible'
          }`}
        >
          Name is required and can't be longer than 10 chars.
        </div>
      </form>
    </div>
  );
};
