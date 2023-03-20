interface InputProps {
  label: string;
  value: string | number;
  placeholder?: string;
  disabled?: boolean;
  onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
}

function Input(props: InputProps) {
  const { label, value, placeholder, disabled = false, onChange } = props;

  return (
    <div className='form-control w-full max-w-xs'>
      <label className='label'>
        <span className='label-text'>{label}</span>
      </label>
      <input
        type='text'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className='input-bordered input w-full max-w-xs'
      />
    </div>
  );
}
export default Input;
