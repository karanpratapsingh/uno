import clsx from 'clsx';

interface AvatarProps {
  className?: string;
  name: string;
  size?: 'small' | 'default';
  type?: 'row' | 'col';
}

function Avatar(props: AvatarProps): React.ReactElement {
  const { className, name, size = 'default', type = 'col' } = props;

  return (
    <div
      className={clsx(
        type === 'col' && 'flex-col',
        'placeholder avatar mr-4 flex items-center',
        className
      )}
    >
      <div
        className={clsx(
          size === 'default' && 'w-24',
          size === 'small' && 'w-8',
          'rounded-full'
        )}
      >
        <img
          src={`https://ui-avatars.com/api/?name=${name}&background=random`}
        />
      </div>
      <span
        className={clsx(type === 'col' && 'mt-2', type === 'row' && 'ml-2')}
      >
        {name}
      </span>
    </div>
  );
}

export default Avatar;
