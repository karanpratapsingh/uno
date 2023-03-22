import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import shortid from 'shortid';
import { defaultHandSize } from '../../lib/state';
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

  return (
    <>
      <input type='checkbox' id={`${action}-modal`} className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box'>
          <h3 className='text-2xl font-bold'>{action}</h3>
          <p className='py-4'>{action} a game by entering some details</p>
          <Input
            label='Enter a name'
            value={name}
            placeholder='eg. alex'
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
            <label
              className='btn'
              onClick={() => onStart(action, name, room, handSize)}
            >
              {action}
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default StartModal;
