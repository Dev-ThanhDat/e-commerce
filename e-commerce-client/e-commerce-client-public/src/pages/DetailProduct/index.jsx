import { addToWishlist, createCarts, getAProducts } from '@/api/config';
import BreadCrumb from '@/components/BreadCrumb';
import ColorItem from '@/components/ColorItem';
import ProductCard from '@/components/ProductCard';
import ReviewsProduct from '@/components/ReviewsProduct';
import { getProducts } from '@/redux/product/productAction';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    document.title = `${data?.title}`;
  }, [data]);

  const fetchAProduct = async (productId) => {
    const response = await getAProducts(productId);
    if (response.success) {
      setData(response.product);
    }
  };

  useEffect(() => {
    fetchAProduct(productId);
  }, [productId]);

  useEffect(() => {
    if (data?.category) {
      dispatch(getProducts({ category: data.category, limit: 5 }));
    }
  }, [data, dispatch]);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const addWishlist = async (productId) => {
    try {
      const response = await addToWishlist(productId);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  const handleAddCart = async () => {
    if (!activeColor) {
      return toast.error('Vui lòng chọn màu sắc!');
    }
    if (quantity <= 0) {
      return toast.error('Vui lòng chọn số lượng!');
    }
    try {
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
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  const filteredProducts = products.filter(
    (product) => product._id !== productId
  );

  return (
    <>
      <BreadCrumb title='Sản phẩm 1' />
      <section className='w-full relative max-w-screen-xl mx-auto p-[15px]'>
        <div className='grid grid-cols-1 gap-5 p-5 bg-white rounded-lg shadow-lg lg:grid-cols-2'>
          <div className='p-3 border shrink-0'>
            <div className='w-full h-auto lg:h-[450px] mb-5'>
              <img
                src={data?.images[0]}
                alt='Primary image product'
                className='object-contain w-full h-full'
              />
            </div>
            <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
              {data?.images?.slice(1)?.map((item, index) => (
                <div
                  key={index}
                  className='p-3 border'
                >
                  <img
                    src={item}
                    alt='Secondary image product'
                    className='block object-contain w-full h-full'
                  />
                </div>
              ))}
            </div>
          </div>

          <div className='shrink-0'>
            <h3 className='pb-3 mb-3 text-xl font-bold border-b text-color-1c1c1b'>
              {data?.title}
            </h3>
            <div className='pb-3 mb-3 border-b'>
              <p className='text-base font-semibold'>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(data?.price)}
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
                  Đựa trên {data?.ratings.length} đánh giá
                </p>
              </div>
            </div>
            <div className='flex flex-col gap-4 pb-3 mb-3 border-b'>
              <div className='flex items-center gap-2'>
                <h3 className='font-semibold text-color-1c1c1b shrink-0'>
                  Thương hiệu:
                </h3>
                <p className='text-color-777777'>{data?.brand}</p>
              </div>
              <div className='flex items-center gap-2'>
                <h3 className='font-semibold text-color-1c1c1b shrink-0'>
                  Loại:
                </h3>
                <p className='text-color-777777'>{data?.category}</p>
              </div>
              <div className='flex items-center gap-2'>
                <h3 className='font-semibold text-color-1c1c1b shrink-0'>
                  Số lượng còn:
                </h3>
                <p className='text-color-777777'>{data?.quantity}</p>
              </div>
              <div className='flex items-center gap-2'>
                <h3 className='font-semibold text-color-1c1c1b shrink-0'>
                  Màu:
                </h3>
                <ul className='flex flex-wrap items-center gap-2'>
                  {data?.color[0]?.split(',')?.map((item, index) => (
                    <ColorItem
                      key={index}
                      handleClick={() =>
                        setActiveColor((prev) => (prev === item ? '' : item))
                      }
                      active={activeColor}
                      color={item}
                    />
                  ))}
                </ul>
              </div>
              <div className='flex items-center gap-2'>
                <h3 className='font-semibold text-color-1c1c1b shrink-0'>
                  Số lượng:
                </h3>
                <input
                  type='number'
                  value={quantity}
                  onChange={(e) => {
                    const value = Math.max(
                      0,
                      parseInt(e.target.value, 10) || 0
                    );
                    setQuantity(value);
                  }}
                  className='w-[60px] h-[40px] outline-none border p-1'
                />
              </div>
              <div className='flex flex-col gap-3 md:items-center md:flex-row'>
                <button
                  onClick={handleAddCart}
                  className='text-white rounded-full transition-all font-semibold bg-color-232f3e hover:bg-opacity-80 py-[8px] px-[15px]'
                >
                  Thêm vào giỏ hàng
                </button>
                {/* <button className='text-color-232f3e rounded-full transition-all font-semibold bg-color-febd69 hover:bg-opacity-80 py-[8px] px-[15px]'>
                  Mua sản phẩm
                </button> */}
              </div>
            </div>
            <div className='flex items-center gap-3 font-semibold text-color-777777'>
              <FaRegHeart
                onClick={() => addWishlist(data?._id)}
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
              className={`${showFullDescription ? '' : 'line-clamp-4'}`}
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

        <ReviewsProduct
          data={data}
          fetch={fetchAProduct}
        />

        <div className='py-10'>
          <h2 className='text-[26px] font-bold mb-[30px]'>
            Sản phẩm phổ biến.
          </h2>
          <div className='flex items-center gap-5'>
            <div className='grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5'>
              {filteredProducts &&
                filteredProducts.length > 0 &&
                filteredProducts.map((item) => (
                  <ProductCard
                    key={item._id}
                    data={item}
                    addToWishlist={addWishlist}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailProduct;
