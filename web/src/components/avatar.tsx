interface AvatarProps {
  name: string;
}

function Avatar(props: AvatarProps) {
  const { name } = props;

  return (
    <div className='placeholder avatar mr-4 flex flex-col items-center'>
      <div className='w-24 rounded-full'>
        <img src={`https://ui-avatars.com/api/?name=${name}`} />
      </div>
      <span className='mt-2 text-xl'>{name}</span>
    </div>
  );
}

export default Avatar;
