import { useState } from 'react';
import { defaultHandSize } from '../../lib/state';
import { GameAction } from '../../types/game';
import Input from '../input';

interface StartModalProps {
  action: GameAction;
  onStart(
    action: GameAction,
    name: string,
    room: string,
    hand_size?: number
  ): void;
}

function StartModal(props: StartModalProps) {
  const { action, onStart } = props;
  const [name, setName] = useState<string>('karan');
  const [room, setRoom] = useState<string>('abcd');
  const [handSize, setHandSize] = useState<number>(defaultHandSize);

  function onNameChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setName(event.target.value);
  }

  function onRoomChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setRoom(event.target.value);
  }

  function onHandSizeChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setHandSize(Number.parseInt(event.target.value));
  }

  function onSubmit(): void {
    // TODO: validate
    onStart(action, name, room, handSize);
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
          {action === GameAction.Host && (
            <Input
              label='Hand size'
              value={handSize}
              onChange={onHandSizeChange}
            />
          )}
          <div className='modal-action'>
            <label htmlFor={`${action}-modal`} className='btn-ghost btn'>
              Cancel
            </label>
            <label className='btn' onClick={onSubmit}>
              {action}
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default StartModal;
