import DropdownCategory from '@/components/DropdownCategory';
import { getPCategories } from '@/redux/productCategories/productCategoriesAction';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useDispatch, useSelector } from 'react-redux';
import ReactStars from 'react-stars';

const StoreSidebar = ({ onSearch }) => {
  const dispatch = useDispatch();
  const { pCategories } = useSelector((state) => state.pCategory);

  const [filters, setFilters] = useState({
    title: '',
    valuePriceFrom: null,
    valuePriceTo: null,
    category: '',
    selectedRating: 0
  });

  useEffect(() => {
    dispatch(getPCategories());
  }, [dispatch]);

  const categoryOptions = useMemo(() => {
    return pCategories?.map((cat) => ({
      value: cat.title,
      label: cat.title
    }));
  }, [pCategories]);

  const handleInputChange = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSearch = useCallback(() => {
    onSearch({
      search: filters.title,
      minPrice: filters.valuePriceFrom,
      maxPrice: filters.valuePriceTo,
      category: filters.category,
      totalRating: filters.selectedRating
    });
  }, [filters, onSearch]);

  const handleClear = () => {
    const defaultFilters = {
      title: '',
      valuePriceFrom: null,
      valuePriceTo: null,
      category: '',
      selectedRating: 0
    };
    setFilters(defaultFilters);
    onSearch({
      search: '',
      minPrice: null,
      maxPrice: null,
      category: '',
      totalRating: 0
    });
  };

  const renderRatingOptions = () =>
    [5, 4, 3, 2, 1].map((rating) => (
      <label
        key={rating}
        className='flex items-center gap-2 cursor-pointer w-fit'
      >
        <input
          type='radio'
          name='rating'
          value={rating}
          checked={filters.selectedRating === rating}
          onChange={() => handleInputChange('selectedRating', rating)}
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
    ));

  return (
    <aside className='lg:absolute flex flex-col mb-5 lg:mb-0 gap-5 lg:max-w-[300px] w-full'>
      <div className='bg-white flex-1 shadow-md rounded-[10px] p-[15px] flex flex-col gap-3'>
        <div>
          <h5 className='mb-1 font-semibold text-color-1c1c1b'>Tìm kiếm:</h5>
          <input
            type='text'
            value={filters.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder='Tìm kiếm tên sản phẩm...'
            className='w-full px-2 py-1 border rounded-md outline-none'
          />
        </div>

        <div>
          <h5 className='mb-1 font-semibold text-color-1c1c1b'>Giá:</h5>
          <div className='flex items-center gap-1'>
            <div className='flex items-center w-full gap-1 px-2 py-1 border border-gray-300 rounded-md'>
              <CurrencyInput
                value={filters.valuePriceFrom}
                onValueChange={(value) =>
                  handleInputChange(
                    'valuePriceFrom',
                    isNaN(+value) ? null : +value
                  )
                }
                intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
                placeholder='Từ'
                className='w-full outline-none'
              />
            </div>
            <span>&#8722;</span>
            <div className='flex items-center w-full gap-1 px-2 py-1 border border-gray-300 rounded-md'>
              <CurrencyInput
                value={filters.valuePriceTo}
                onValueChange={(value) =>
                  handleInputChange(
                    'valuePriceTo',
                    isNaN(+value) ? null : +value
                  )
                }
                intlConfig={{ locale: 'vi-VN', currency: 'VND' }}
                placeholder='Đến'
                className='w-full outline-none'
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor='dropdown-category'
            className='mb-1 font-semibold text-color-1c1c1b'
          >
            Lọc danh mục:
          </label>
          <DropdownCategory
            inputId='dropdown-category'
            options={categoryOptions}
            value={
              filters.category
                ? { value: filters.category, label: filters.category }
                : null
            }
            onChange={(option) => handleInputChange('category', option.value)}
          />
        </div>

        <div>
          <label className='mb-1 font-semibold text-color-1c1c1b'>
            Đánh giá:
          </label>
          <div className='flex flex-col'>{renderRatingOptions()}</div>
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

export default StoreSidebar;
