interface ConfirmModalProps {
  onConfirm(): void;
}

function ConfirmModal(props: ConfirmModalProps): React.ReactElement {
  const { onConfirm } = props;

  return (
    <>
      <input
        type='checkbox'
        id='confirm-leave-modal'
        className='modal-toggle'
      />
      <div className='modal'>
        <div className='modal-box'>
          <h3 className='text-2xl font-bold'>Leave Game</h3>
          <p className='py-4'>Are you sure you want to leave the game?</p>
          <div className='modal-action'>
            <label
              htmlFor={`confirm-leave-modal`}
              className='btn-ghost btn text-red-400'
            >
              Cancel
            </label>
            <label className='btn' onClick={onConfirm}>
              Confirm
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmModal;
