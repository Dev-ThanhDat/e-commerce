import DropdownCategory from '@/components/DropdownCategory';
import { getPCategories } from '@/redux/productCategories/productCategoriesAction';
import { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useDispatch, useSelector } from 'react-redux';
import ReactStars from 'react-stars';

const StoreSidebar = ({ onSearch }) => {
  const [title, setTitle] = useState('');
  const [valuePriceFrom, setValuePriceFrom] = useState(null);
  const [valuePriceTo, setValuePriceTo] = useState(null);
  const [category, setCategory] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const { pCategories } = useSelector((state) => state.pCategory);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPCategories());
  }, [dispatch]);

  const handleSearch = () => {
    onSearch({
      search: title,
      minPrice: valuePriceFrom,
      maxPrice: valuePriceTo,
      category,
      totalRating: selectedRating
    });
  };

  const handleClear = () => {
    setTitle('');
    setValuePriceFrom(null);
    setValuePriceTo(null);
    setCategory('');
    setSelectedRating(0);
    onSearch({
      search: '',
      minPrice: null,
      maxPrice: null,
      category: '',
      totalRating: 0
    });
  };

  return (
    <aside className='lg:absolute flex flex-col mb-5 lg:mb-0 gap-5 lg:max-w-[300px] w-full'>
      <div className='bg-white flex-1 shadow-md rounded-[10px] flex flex-col gap-3 p-[15px]'>
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
            Giá:
          </h5>
          <div className='flex items-center gap-1'>
            <div className='flex items-center w-full gap-1 px-2 py-1 border border-gray-300 rounded-md'>
              <CurrencyInput
                onValueChange={(value) =>
                  setValuePriceFrom(isNaN(+value) ? null : +value)
                }
                intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
                placeholder='Từ'
                className='w-full outline-none'
              />
            </div>
            <span>&#8722;</span>
            <div className='flex items-center w-full gap-1 px-2 py-1 border border-gray-300 rounded-md'>
              <CurrencyInput
                onValueChange={(value) =>
                  setValuePriceTo(isNaN(+value) ? null : +value)
                }
                intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
                placeholder='Đến'
                className='w-full outline-none'
              />
            </div>
          </div>
        </div>

        <div>
          <h5 className='font-semibold capitalize text-color-1c1c1b mb-[5px]'>
            Lọc danh mục:
          </h5>
          <DropdownCategory
            options={pCategories?.map((category) => ({
              value: category.title,
              label: category.title
            }))}
            onChange={(selectedOption) => setCategory(selectedOption.value)}
          />
        </div>
        <div>
          <h5 className='font-semibold capitalize text-color-1c1c1b mb-[5px]'>
            Đánh giá:
          </h5>
          <div className='flex flex-col '>
            {[5, 4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className='flex items-center gap-2 cursor-pointer w-fit'
              >
                <input
                  type='radio'
                  name='rating'
                  value={rating}
                  checked={selectedRating === rating}
                  onChange={() => setSelectedRating(rating)}
                />
                <ReactStars
                  count={5}
                  size={20}
                  value={rating}
                  edit={false}
                  half={false}
                  color2='#ffd700'
                />
              </label>
            ))}
          </div>
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

export default StoreSidebar;
