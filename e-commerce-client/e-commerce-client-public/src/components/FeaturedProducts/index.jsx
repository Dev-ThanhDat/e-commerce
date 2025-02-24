import { addToWishlist } from '@/api/config';
import ProductCard from '@/components/ProductCard';
import Skeleton from '@/components/Skeleton';
import { getProducts } from '@/redux/product/productAction';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts({ limit: 10 }));
  }, [dispatch]);

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

  return (
    <section className='pb-10'>
      <h2 className='text-[26px] font-bold mb-[30px]'>Sản phẩm nổi bật.</h2>
      <div className='grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5'>
        {!isLoading ? (
          products &&
          products.length > 0 &&
          products.map((item) => (
            <ProductCard
              key={item._id}
              data={item}
              addToWishlist={addWishlist}
            />
          ))
        ) : (
          <>
            {Array(10)
              .fill(0)
              .map((item, index) => (
                <div
                  key={index}
                  className='p-[15px]  bg-white rounded-[10px] shadow-lg relative overflow-hidden'
                >
                  <Skeleton
                    circle={true}
                    width='100%'
                    height='240px'
                  />
                  <div className='flex flex-col gap-2 mt-3'>
                    <Skeleton
                      width='30%'
                      height='10px'
                    />
                    <Skeleton
                      width='100%'
                      height='20px'
                    />
                    <Skeleton
                      width='50%'
                      height='15px'
                    />
                    <Skeleton
                      width='80%'
                      height='15px'
                    />
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
