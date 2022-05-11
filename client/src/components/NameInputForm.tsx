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
    <form onSubmit={handleNameSubmit}>
      <div className='mb-3'>
        <label
          htmlFor='name'
          className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
        >
          Name
        </label>
        <input
          type='text'
          id='name'
          name='name'
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          onChange={handleNameChange}
          required
        />
      </div>
      <button
        type='submit'
        className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
      >
        Submit
      </button>
    </form>
  );
};
