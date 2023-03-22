interface LoaderProps {
  label?: string;
}

function Loader(props: LoaderProps): React.ReactElement {
  const { label } = props;
  return (
    <div className='flex flex-1 flex-col items-center justify-center'>
      <div className='loader' />
      <span className='mt-8 text-center text-xl italic text-gray-500'>
        {label}
      </span>
    </div>
  );
}

export default Loader;
