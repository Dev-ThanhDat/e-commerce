import { LuComponent } from 'react-icons/lu';
import { NavLink } from 'react-router-dom';

const HeaderBottom = () => {
  return (
    <div className='px-[15px] bg-color-232f3e'>
      <div className='flex flex-col-reverse items-center w-full max-w-screen-xl gap-2 py-4 mx-auto md:gap-5 md:flex-row'>
        <LuComponent size={25} />
        <div className='flex items-center pb-[10px] md:pb-0 border-b md:border-none border-white gap-x-5'>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `uppercase font-semibold transition-all ${
                isActive ? 'text-color-febd69' : 'hover:text-color-febd69'
              }`
            }
          >
            Trang chủ
          </NavLink>
          <NavLink
            to='/cua-hang'
            className={({ isActive }) =>
              `uppercase font-semibold transition-all ${
                isActive ? 'text-color-febd69' : 'hover:text-color-febd69'
              }`
            }
          >
            Cửa hàng
          </NavLink>
          <NavLink
            to='/bai-viet'
            className={({ isActive }) =>
              `uppercase font-semibold transition-all ${
                isActive ? 'text-color-febd69' : 'hover:text-color-febd69'
              }`
            }
          >
            Bài viết
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
