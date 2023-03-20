import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { defaultHandSize, maxHandSize } from '../../lib/state';
import { GameAction } from '../../types/game';
import Input from '../input';
import shortid from 'shortid';

interface StartModalProps {
  action: GameAction;
  onStart(
    action: GameAction,
    name: string,
    room: string,
    hand_size: number
  ): void;
}

function StartModal(props: StartModalProps) {
  const { action, onStart } = props;
  const [name, setName] = useState<string>('');
  const [room, setRoom] = useState<string>('');
  const [handSize, setHandSize] = useState<number>(defaultHandSize);

  useEffect(() => {
    if (action === GameAction.Host) {
      setRoom(shortid.generate());
    }
  }, [action]);

  function onNameChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { value } = event.target;
    setName(value);
  }

  function onRoomChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { value } = event.target;
    setRoom(value);
  }

  function onHandSizeChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { value } = event.target;
    setHandSize(Number.parseInt(value));
  }

  function onSubmit(): void {
    if (name === '') {
      toast.error('name should be blank');
      return;
    }

    if (name.includes(' ')) {
      toast.error('name should not contain blank spaces');
      return;
    }

    // TODO: generate room shortid

    if (handSize > maxHandSize) {
      toast.error(`hand size should not be greater than ${maxHandSize}`);
      return;
    }

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
          <Input
            label='Room'
            value={room}
            disabled={action === GameAction.Host}
            onChange={onRoomChange}
          />
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
