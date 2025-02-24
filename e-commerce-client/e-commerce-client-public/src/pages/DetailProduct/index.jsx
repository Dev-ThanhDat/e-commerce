import { addToWishlist, createCarts, getAProducts } from '@/api/config';
import BreadCrumb from '@/components/BreadCrumb';
import ColorItem from '@/components/ColorItem';
import ProductCard from '@/components/ProductCard';
import ReviewsProduct from '@/components/ReviewsProduct';
import { getProducts } from '@/redux/product/productAction';
import { useCallback, useEffect, useState } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import ReactStars from 'react-stars';
import { toast } from 'react-toastify';

const DetailProduct = () => {
  const { pathname } = useLocation();
  const { productId } = useParams();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(0);
  const [data, setData] = useState(null);
  const [activeColor, setActiveColor] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { products } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);

  const fetchProduct = useCallback(async () => {
    const res = await getAProducts(productId);
    if (res.success) {
      setData(res.product);
    }
  }, [productId]);

  const filteredProducts = products?.filter((p) => p._id !== productId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchProduct();
  }, [pathname, fetchProduct]);

  useEffect(() => {
    if (data?.title) {
      document.title = data.title;
    }
  }, [data]);

  useEffect(() => {
    if (data?.category) {
      dispatch(getProducts({ category: data.category, limit: 5 }));
    }
  }, [data?.category, dispatch]);

  const toggleDescription = () => setShowFullDescription((prev) => !prev);

  const handleAddToWishlist = async (id) => {
    try {
      if (!user) {
        toast.error('Vui lòng đăng nhập!');
        return;
      }
      const response = await addToWishlist(id);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const handleAddToCart = async () => {
    if (!activeColor) return toast.error('Vui lòng chọn màu sắc!');
    if (quantity <= 0) return toast.error('Vui lòng chọn số lượng!');

    try {
      if (!user) {
        toast.error('Vui lòng đăng nhập!');
        return;
      }
      const response = await createCarts({
        productId,
        quantity,
        color: activeColor
      });
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.error('Cart error:', err);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);

  return (
    <>
      <BreadCrumb title='Chi tiết sản phẩm' />
      <section className='w-full max-w-screen-xl mx-auto p-[15px]'>
        <div className='grid gap-5 p-5 bg-white rounded-lg shadow-lg lg:grid-cols-2'>
          <div className='p-3 border'>
            <div className='w-full mb-5 h-auto lg:h-[450px]'>
              <img
                loading='lazy'
                src={data?.images?.[0]}
                alt='Primary'
                className='object-contain w-full h-full'
              />
            </div>
            <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
              {data?.images?.slice(1)?.map((img, idx) => (
                <div
                  key={idx}
                  className='p-3 border'
                >
                  <img
                    loading='lazy'
                    src={img}
                    alt='Secondary'
                    className='object-contain w-full h-full'
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className='pb-3 mb-3 text-xl font-bold border-b text-color-1c1c1b'>
              {data?.title}
            </h3>
            <div className='pb-3 mb-3 border-b'>
              <p className='text-base font-semibold'>
                {formatCurrency(data?.price)}
              </p>
              <div className='flex items-center gap-2'>
                <ReactStars
                  count={5}
                  size={15}
                  value={data?.totalRating}
                  edit={false}
                  activeColor='#ffd700'
                />
                <p className='text-color-777777'>
                  Dựa trên {data?.ratings?.length || 0} đánh giá
                </p>
              </div>
            </div>

            <div className='flex flex-col gap-4 pb-3 mb-3 border-b'>
              {[
                { label: 'Thương hiệu', value: data?.brand },
                { label: 'Loại', value: data?.category },
                { label: 'Số lượng còn', value: data?.quantity }
              ].map((item, i) => (
                <div
                  key={i}
                  className='flex items-center gap-2'
                >
                  <h3 className='font-semibold shrink-0 text-color-1c1c1b'>
                    {item.label}:
                  </h3>
                  <p className='text-color-777777'>{item.value}</p>
                </div>
              ))}

              <div className='flex items-center gap-2'>
                <h3 className='font-semibold text-color-1c1c1b shrink-0'>
                  Màu:
                </h3>
                <ul className='flex flex-wrap items-center gap-2'>
                  {data?.color?.[0]?.split(',')?.map((color, idx) => (
                    <li key={idx}>
                      <ColorItem
                        color={color}
                        active={activeColor}
                        handleClick={() =>
                          setActiveColor((prev) =>
                            prev === color ? '' : color
                          )
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className='flex items-center gap-2'>
                <label
                  htmlFor='product-quantity'
                  className='font-semibold w-fit text-color-1c1c1b shrink-0'
                >
                  Số lượng:
                </label>
                <input
                  type='number'
                  id='product-quantity'
                  min='0'
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className='w-[60px] h-[40px] border p-1 outline-none'
                />
              </div>

              <div className='flex flex-col gap-3 md:flex-row md:items-center'>
                <button
                  onClick={handleAddToCart}
                  className='bg-color-232f3e text-white rounded-full font-semibold py-[8px] px-[15px] hover:bg-opacity-80 transition-all'
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>

            <div className='flex items-center gap-3 font-semibold text-color-777777'>
              <FaRegHeart
                onClick={() => handleAddToWishlist(data?._id)}
                size={20}
                className='transition-all cursor-pointer hover:text-red-500'
              />
              <span>Thêm vào yêu thích</span>
            </div>
          </div>
        </div>

        <div className='py-5'>
          <h4 className='text-[26px] font-bold mb-[10px]'>Mô tả:</h4>
          <div className='p-5 bg-white rounded-lg shadow-lg'>
            <div
              className={showFullDescription ? '' : 'line-clamp-4'}
              dangerouslySetInnerHTML={{ __html: data?.description }}
            ></div>
            <button
              onClick={toggleDescription}
              className='mt-3 transition-all text-color-febd69 hover:opacity-80'
            >
              {showFullDescription ? 'Ẩn bớt' : 'Xem thêm'}
            </button>
          </div>
        </div>

        {user && (
          <ReviewsProduct
            data={data}
            fetch={fetchProduct}
          />
        )}

        <div className='py-10'>
          <h2 className='text-[26px] font-bold mb-[30px]'>
            Sản phẩm phổ biến.
          </h2>
          <div className='grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5'>
            {filteredProducts?.map((item) => (
              <ProductCard
                key={item._id}
                data={item}
                addToWishlist={handleAddToWishlist}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailProduct;
