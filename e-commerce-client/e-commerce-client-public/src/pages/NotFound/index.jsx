import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className='flex flex-col items-center justify-center h-screen gap-6 p-5'>
      <h1 className='font-extrabold md:text-[45px] text-[35px] text-center leading-[1.4]'>
        Không tìm thấy trang. &#128531;
      </h1>
      <ul className='text-center'>
        <li className='font-bold md:leading-[1.6] leading-[1.4] text-center '>
          URL của trang này đã được thay đổi hoặc không còn tồn tại.
        </li>
        <li className='font-bold md:leading-[1.6] leading-[1.4] text-center '>
          Hãy thử truy cập lại từ trang chủ.
        </li>
      </ul>
      <Link
        to={'/'}
        className='px-4 py-2 font-bold uppercase transition-all border rounded-full border-color-febd69 text-color-febd69 hover:bg-color-febd69 hover:text-white'
      >
        Quay lại trang chủ
      </Link>
    </section>
  );
};

export default NotFound;
