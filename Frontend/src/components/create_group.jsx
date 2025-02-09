import React, { useEffect, useState } from 'react';
import { create_group } from '../api/endpoints';

function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const [allGroups, setAllGroups] = useState([])
  const [loading, setLoading] = useState(true)

  const handleCreateGroup = async (event) => {
    event.preventDefault();
    try {
      const response = await create_group(groupName, description)
      setMessage(`Group created: ${response.group_name}`);
      setGroupName('');
      setDescription('');
    } catch (error) {
      setMessage('Failed to create group. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-xl font-bold'>Create a New Group</h2>
      <form className='w-full flex flex-col gap-4' onSubmit={handleCreateGroup}>
        <div className='flex flex-col gap-2'>
          <label className="text-lg font-semibold">Group Name:</label>
          <input className='bg-gray-100 w-full border-1 border-gray-300 rounded-sm p-2'
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className="text-lg font-semibold">Description:</label>
          <textarea className='bg-gray-100 w-full border-1 border-gray-300 rounded-sm p-2'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button className='bg-blue-500 text-lg text-white rounded-sm p-2' type="submit">Create Group</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CreateGroup;
