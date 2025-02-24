import { AiOutlineDash } from 'react-icons/ai';

const HeaderTop = () => {
  return (
    <div className='flex flex-col items-center justify-between py-3 text-xs border-b md:flex-row border-b-color-3b4149 font-Playwrite'>
      <p>Welcome to E-Commerce.</p>
      <span>
        <AiOutlineDash size={25} />
      </span>
      <p>Wish you a happy shopping.</p>
    </div>
  );
};

export default HeaderTop;
