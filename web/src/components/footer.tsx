import { version } from '../../package.json';

function Footer(): React.ReactElement {
  return (
    <footer className='footer text flex items-center justify-center text-gray-500'>
      v{version}
    </footer>
  );
}

export default Footer;
