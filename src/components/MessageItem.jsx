import React from 'react'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';

const MessageItem = ({ message, id, onDelete }) => {
  return (
    <div className='bg-white py-2 px-3 shadow-md hover:shadow-none rounded-md relative my-3'>
      <h2 className='text-lg font-black'>{message.property}</h2>
      <h4 className=" font-sm"><span className='font-extrabold'>From : </span>{message.email}</h4>
      <p className='text-lg'>{message.message}</p>

      {onDelete && <DeleteIcon className='w-5 absolute top-2 right-3' fill='rgb(231, 76, 60)' onClick={() => onDelete(id)} />}
    </div>
  )
}

export default MessageItem