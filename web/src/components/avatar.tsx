interface AvatarProps {
  name: string;
}

function Avatar(props: AvatarProps): React.ReactElement {
  const { name } = props;

  return (
    <div className='placeholder avatar mr-4 flex flex-col items-center'>
      <div className='w-24 rounded-full'>
        <img
          src={`https://ui-avatars.com/api/?name=${name}&background=random`}
        />
      </div>
      <span className='mt-2'>{name}</span>
    </div>
  );
}

export default Avatar;
