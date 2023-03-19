import { useState } from 'react';
import { GameAction } from '../../types/game';
import Input from '../input';

interface StartModalProps {
  action: GameAction;
  onStart(action: GameAction, name: string, room: string): void;
}

function StartModal(props: StartModalProps) {
  const { action, onStart } = props;
  const [name, setName] = useState<string>('karan');
  const [room, setRoom] = useState<string>('abcd');

  function onNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  function onRoomChange(event: React.ChangeEvent<HTMLInputElement>) {
    setRoom(event.target.value);
  }

  return (
    <>
      <input type='checkbox' id={`${action}-modal`} className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box'>
          <h3 className='text-lg font-bold'>{action}</h3>
          <p className='py-4'>Let's start by entering some details</p>
          <Input
            label='Enter a name'
            value={name}
            placeholder='eg. abcd'
            onChange={onNameChange}
          />
          <Input label='Room' value={room} onChange={onRoomChange} />
          <div className='modal-action'>
            <label htmlFor={`${action}-modal`} className='btn-ghost btn'>
              Cancel
            </label>
            <label className='btn' onClick={() => onStart(action, name, room)}>
              {action}
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default StartModal;
