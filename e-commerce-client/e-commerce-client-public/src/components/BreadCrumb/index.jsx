import { Link } from 'react-router-dom';

const BreadCrumb = ({ title }) => {
  return (
    <div className='flex items-center justify-center py-4 bg-white shadow-sm'>
      <p className='flex items-center gap-2 font-medium'>
        <Link
          to='/'
          className='transition-all hover:text-color-febd69'
        >
          Trang chủ
        </Link>
        <span>&#47;</span>
        <span className='font-bold text-color-febd69'>{title}</span>
      </p>
    </div>
  );
};

export default BreadCrumb;
