import React, { useContext, useState } from 'react';
import WebSocketContext from '../websockets/WebSocketContext';

interface NameInputFormProps {
  insertName: () => void;
}

export const NameInputForm = (props: NameInputFormProps) => {
  const [name, setName] = useState('');
  const { joinGame } = useContext(WebSocketContext);
  const handleNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const handleNameSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (name === '') return;
    await joinGame(name);
    props.insertName();
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
            required
          />
        </div>
        <button
          type='submit'
          className='text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
          Submit
        </button>
      </form>
    </div>
  );
};
