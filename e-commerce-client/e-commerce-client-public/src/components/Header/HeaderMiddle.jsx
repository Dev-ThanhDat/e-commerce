import Tippy from '@tippyjs/react';
import { BsCart4 } from 'react-icons/bs';
import { FaUserAstronaut } from 'react-icons/fa6';
import { GiHeartBottle } from 'react-icons/gi';
import { MdWarehouse } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const HeaderMiddle = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className='flex flex-col items-center justify-between gap-5 py-4 md:flex-row'>
      <Link
        className='flex items-center gap-2'
        to='/'
      >
        <img
          loading='lazy'
          src='/Images/logo.png'
          alt='Logo website'
          className='object-cover w-[50px] shrink-0 h-full'
        />
        <span className='text-3xl font-extrabold font-Playwrite'>Sun.</span>
      </Link>

      <div className='flex flex-wrap items-center gap-5'>
        <Tippy
          content='Đơn hàng'
          placement='bottom'
        >
          <Link
            to='/don-hang'
            className='flex items-center gap-[10px] justify-center'
            aria-label='Đơn hàng'
          >
            <MdWarehouse size={25} />
          </Link>
        </Tippy>
        <Tippy
          content='Sản phẩm yêu thích'
          placement='bottom'
        >
          <Link
            to='/yeu-thich'
            className='flex items-center gap-[10px] justify-center'
            aria-label='Sản phẩm yêu thích'
          >
            <GiHeartBottle size={25} />
          </Link>
        </Tippy>

        {!user ? (
          <Link
            to='/dang-nhap'
            className='flex items-center gap-[10px] justify-center'
          >
            <FaUserAstronaut size={25} />
            <p>Đăng nhập</p>
          </Link>
        ) : (
          <Link
            to='/tai-khoan'
            className='flex items-center gap-[10px] justify-center'
          >
            <FaUserAstronaut size={25} />
            <p>Tài khoản</p>
          </Link>
        )}
        <Link
          to='/gio-hang'
          className='flex items-center gap-[5px]'
          aria-label='Giỏ hàng'
        >
          <BsCart4
            size={25}
            className='text-color-febd69'
          />
        </Link>
      </div>
    </div>
  );
};

export default HeaderMiddle;
