import { addToWishlist } from '@/api/config';
import BreadCrumb from '@/components/BreadCrumb';
import WishlistCard from '@/components/WishlistCard';
import { getWishlist } from '@/redux/user/userAction';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.user);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    document.title = 'Yêu thích';
  }, []);

  useEffect(() => {
    dispatch(getWishlist(user?._id));
  }, [dispatch, user]);

  const deleteWishlist = async (productId) => {
    try {
      const response = await addToWishlist(productId);
      if (response.success) {
        setTimeout(() => {
          dispatch(getWishlist(user?._id));
        }, 300);
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  return (
    <>
      <BreadCrumb title='Sản phẩm yêu thích' />
      <section className='w-full relative max-w-screen-xl mx-auto p-[15px]'>
        {wishlist && wishlist.length > 0 ? (
          <div className='grid grid-cols-1 gap-5 lg:grid-cols-5 md:grid-cols-3'>
            {wishlist.map((item) => (
              <WishlistCard
                key={item._id}
                data={item}
                deleteToWishlist={deleteWishlist}
              />
            ))}
          </div>
        ) : (
          <div className='flex items-start justify-center'>
            <img
              src='/Images/product-not-found.jpeg'
              alt='Product not found'
              className='w-[250px]'
            />
          </div>
        )}
      </section>
    </>
  );
};

export default Wishlist;
