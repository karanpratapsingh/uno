import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import shortid from 'shortid';
import { defaultHandSize, maxHandSize, minHandSize } from '../../lib/state';
import { GameAction } from '../../types/game';
import Input from '../input';

interface StartModalProps {
  action: GameAction;
  onStart(
    action: GameAction,
    name: string,
    room: string,
    hand_size: number
  ): void;
}

function StartModal(props: StartModalProps): React.ReactElement {
  const { action, onStart } = props;
  const [name, setName] = useState<string>('');
  const [room, setRoom] = useState<string>('');
  const [handSize, setHandSize] = useState<number>(defaultHandSize);

  const [queryParams, setQueryParams] = useSearchParams();

  useEffect(() => {
    const room = queryParams.get('join');
    if (room) {
      setRoom(room);
      const modal = document.getElementById(
        `${GameAction.Join}-modal`
      ) as HTMLInputElement;
      if (modal) {
        modal.checked = true;
        setQueryParams();
      }
    }
  }, [queryParams]);

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
    const value = Number.parseInt(event.target.value);

    if (Number.isNaN(value)) {
      setHandSize(0);
    } else {
      setHandSize(value);
    }
  }

  function onSubmit(): void {
    if (name === '') {
      toast.error('name should not be blank');
      return;
    }

    if (name.includes(' ')) {
      toast.error('name should not contain blank spaces');
      return;
    }

    if (room === '') {
      toast.error('room id should not be empty');
      return;
    }

    if (handSize > maxHandSize) {
      toast.error(`hand size should not be greater than ${maxHandSize}`);
      return;
    }

    if (handSize < minHandSize) {
      toast.error(`hand size should not be less than ${minHandSize}`);
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
            placeholder='eg. kps99'
            onChange={onNameChange}
          />
          <Input
            label='Room'
            value={room}
            disabled={action === GameAction.Host}
            placeholder='eg. abcd'
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
            <label
              htmlFor={`${action}-modal`}
              className='btn-ghost btn text-red-400'
            >
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
