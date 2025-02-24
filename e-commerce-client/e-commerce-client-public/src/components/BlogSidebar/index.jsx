import DropdownCategory from '@/components/DropdownCategory';
import { useState } from 'react';

const BlogSidebar = ({ onSearch }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = () => {
    onSearch({
      search: title,
      category
    });
  };

  const handleClear = () => {
    setTitle('');
    setCategory('');
    onSearch({
      search: '',
      category: ''
    });
  };

  const options = [
    { value: 'Game', label: 'Game' },
    { value: 'Code', label: 'Code' },
    { value: 'Tin tức', label: 'Tin tức' }
  ];

  return (
    <aside className='lg:absolute flex flex-col mb-5 lg:mb-0 gap-5 lg:max-w-[300px] w-full'>
      <div className='bg-white shadow-md rounded-[10px]  flex flex-col gap-3 p-[15px]'>
        <div className='flex flex-col'>
          <h5 className='font-semibold capitalize text-color-1c1c1b mb-[5px]'>
            Tìm kiếm:
          </h5>
          <div>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Tìm kiếm tên sản phẩm...'
              className='w-full px-2 py-1 border outline-none'
            />
          </div>
        </div>
        <div>
          <h5 className='font-semibold capitalize text-color-1c1c1b mb-[5px]'>
            Lọc danh mục:
          </h5>
          <DropdownCategory
            options={options}
            onChange={(selectedOption) => setCategory(selectedOption.value)}
          />
        </div>
        <button
          onClick={handleSearch}
          className='w-full p-2 mt-3 text-white transition-all rounded-md hover:opacity-85 bg-color-febd69'
        >
          Tìm kiếm
        </button>
        <div className='pt-1 text-center border-t border-t-gray-500'>
          <span
            onClick={handleClear}
            className='inline-block transition-all cursor-pointer hover:text-red-500'
          >
            Bỏ chọn
          </span>
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;
