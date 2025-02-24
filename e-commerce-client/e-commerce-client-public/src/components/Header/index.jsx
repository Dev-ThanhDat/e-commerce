import HeaderBottom from '@/components/Header/HeaderBottom';
import HeaderMiddle from '@/components/Header/HeaderMiddle';
import HeaderTop from '@/components/Header/HeaderTop';

const Header = () => {
  return (
    <header className='flex flex-col text-white '>
      <div className='bg-color-131921 px-[15px]'>
        <div className='w-full max-w-screen-xl mx-auto'>
          <HeaderTop />
          <HeaderMiddle />
        </div>
      </div>
      <HeaderBottom />
    </header>
  );
};

export default Header;
