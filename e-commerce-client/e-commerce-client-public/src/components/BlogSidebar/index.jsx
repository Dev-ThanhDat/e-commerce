import DropdownCategory from '@/components/DropdownCategory';
import { getBCategories } from '@/redux/blogCategories/blogCategoriesAction';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const BlogSidebar = ({ onSearch }) => {
  const dispatch = useDispatch();
  const { bCategories } = useSelector((state) => state.bCategory);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    dispatch(getBCategories());
  }, [dispatch]);

  const handleSearch = useCallback(() => {
    onSearch({ search: title.trim(), category });
  }, [title, category, onSearch]);

  const handleClear = useCallback(() => {
    setTitle('');
    setCategory('');
    onSearch({ search: '', category: '' });
  }, [onSearch]);

  return (
    <aside className='lg:absolute flex flex-col mb-5 lg:mb-0 gap-5 lg:max-w-[300px] w-full'>
      <div className='bg-white shadow-md rounded-[10px] p-[15px] flex flex-col gap-3'>
        <div>
          <h5 className='font-semibold text-color-1c1c1b mb-[5px]'>
            Tìm kiếm:
          </h5>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Tìm kiếm tên sản phẩm...'
            className='w-full px-2 py-1 border outline-none'
          />
        </div>

        <div>
          <label
            htmlFor='blog-dropdown-category'
            className='font-semibold text-color-1c1c1b mb-[5px]'
          >
            Lọc danh mục:
          </label>
          <DropdownCategory
            inputId='blog-dropdown-category'
            options={bCategories?.map((category) => ({
              value: category.title,
              label: category.title
            }))}
            onChange={(selectedOption) => setCategory(selectedOption.value)}
            value={category ? { value: category, label: category } : null}
          />
        </div>

        <button
          onClick={handleSearch}
          className='w-full p-2 mt-3 text-white transition-all rounded-md hover:opacity-85 bg-color-febd69'
        >
          Tìm kiếm
        </button>

        <div className='pt-1 text-center border-t border-gray-500'>
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
