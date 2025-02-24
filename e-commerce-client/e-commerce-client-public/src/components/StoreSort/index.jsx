import { LuTally4 } from 'react-icons/lu';
import { TbTallymark3 } from 'react-icons/tb';

const StoreSort = ({ valueGrid, onSetGrid, total }) => {
  return (
    <div className='bg-white p-[15px] shadow-md rounded-[10px] flex flex-wrap items-center justify-center lg:justify-between gap-5  lg:flex-row flex-col-reverse'>
      <p className='text-xs text-color-777777'>{total} sản phẩm</p>
      <div className='flex items-center gap-3 shrink-0'>
        <div className='items-center hidden gap-2 lg:flex'>
          <button
            onClick={() => onSetGrid(4)}
            aria-label='Hiển thị dạng lưới 4 cột'
            className={` p-[5px] rounded-[3px] transition-none ${
              valueGrid === 4
                ? 'bg-color-232f3e text-white pointer-events-none'
                : 'bg-[#f2f2f2]'
            }`}
          >
            <LuTally4 size={20} />
          </button>
          <button
            onClick={() => onSetGrid(3)}
            aria-label='Hiển thị dạng lưới 3 cột'
            className={` p-[5px] rounded-[3px] transition-none ${
              valueGrid === 3
                ? 'bg-color-232f3e text-white pointer-events-none'
                : 'bg-[#f2f2f2]'
            }`}
          >
            <TbTallymark3 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreSort;
