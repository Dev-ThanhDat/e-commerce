import { deleteProductCarts, updateCarts } from '@/api/config';
import BreadCrumb from '@/components/BreadCrumb';
import ColorItem from '@/components/ColorItem';
import { getCarts } from '@/redux/cart/cartAction';
import { useCallback, useEffect } from 'react';
import { CiTrash } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Carts = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { carts } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    document.title = 'Giỏ hàng';
  }, []);

  useEffect(() => {
    if (user?._id) {
      dispatch(getCarts(user._id));
    }
  }, [user, dispatch]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleQuantityChange = useCallback(
    async (productId, quantity) => {
      if (quantity <= 0) {
        toast.error('Số lượng phải lớn hơn 0');
        return;
      }

      const response = await updateCarts(productId, quantity);
      if (response.success) {
        dispatch(getCarts(user._id));
      } else {
        toast.error(response.message);
      }
    },
    [dispatch, user]
  );

  const handleRemoveProduct = useCallback(
    async (productId) => {
      const response = await deleteProductCarts(productId);
      if (response.success) {
        dispatch(getCarts(user._id));
      } else {
        toast.error(response.message);
      }
    },
    [dispatch, user]
  );

  return (
    <>
      <BreadCrumb title='Giỏ hàng' />
      <section className='p-[15px]'>
        <div className='mt-5 overflow-auto'>
          {carts ? (
            <table className='w-full table-fixed'>
              <thead>
                <tr>
                  <th className='pb-3 shrink-0 font-black uppercase w-[675px] min-w-[490px] border-b text-color-777777'>
                    Sản phẩm
                  </th>
                  <th className='pb-3 shrink-0 font-black uppercase border-b w-[221px] min-w-[130px] text-color-777777'>
                    Giá
                  </th>
                  <th className='pb-3 shrink-0 font-black uppercase w-[185px] min-w-[120px] border-b text-color-777777'>
                    Số lượng
                  </th>
                  <th className='pb-3 shrink-0 font-black uppercase w-[219px] min-w-[130px] border-b text-color-777777'>
                    Tổng giá
                  </th>
                  <th className='pb-3 shrink-0 font-black w-[189px] min-w-[140px] uppercase border-b text-color-777777'>
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {carts?.products?.map((product) => (
                  <tr key={product._id}>
                    <td className='p-3 shrink-0 w-[675px] min-w-[490px]'>
                      <div className='flex items-center gap-5'>
                        <img
                          loading='lazy'
                          src={product?.product?.images[0] || ''}
                          alt='Image product'
                          className='w-[110px] object-cover shrink-0'
                        />
                        <div className='flex flex-col gap-2'>
                          <h3 className='font-bold line-clamp-2 text-color-777777'>
                            {product?.product?.title}
                          </h3>
                          <p className='flex items-center gap-1 text-color-777777 line-clamp-1'>
                            <span className='font-bold'>Loại:</span>
                            {product?.product?.category}
                          </p>
                          <p className='flex items-center gap-1 pointer-events-none text-color-777777 line-clamp-1'>
                            <span className='font-bold'>Màu:</span>
                            <ColorItem color={product?.product?.color} />
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className='p-3 shrink-0 text-center w-[221px] min-w-[130px]'>
                      <p className='font-bold text-color-232f3e'>
                        {formatCurrency(product?.product?.price)}
                      </p>
                    </td>
                    <td className='p-3 shrink-0 text-center w-[185px] min-w-[120px]'>
                      <input
                        type='number'
                        value={product?.quantity}
                        onChange={(e) => {
                          const value = Math.max(
                            0,
                            parseInt(e.target.value, 10) || 0
                          );
                          handleQuantityChange(product.product._id, value);
                        }}
                        className='w-[60px] h-[30px] outline-none border p-1'
                      />
                    </td>
                    <td className='p-3 shrink-0 text-center w-[219px] min-w-[130px]'>
                      <p className='font-bold text-color-232f3e'>
                        {formatCurrency(
                          product?.product?.price * product?.quantity
                        )}
                      </p>
                    </td>
                    <td className='p-3 shrink-0 text-center w-[189px] min-w-[140px]'>
                      <span
                        onClick={() => handleRemoveProduct(product.product._id)}
                        className='inline-block p-2 text-white transition-all rounded-full cursor-pointer hover:opacity-80 bg-color-232f3e'
                      >
                        <CiTrash size={20} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className='flex items-center justify-center mt-2'>
              <img
                loading='lazy'
                src='/Images/product-not-found.jpeg'
                alt='Product not found'
                className='w-[150px]'
              />
            </div>
          )}
        </div>
        {carts && (
          <div className='flex flex-col items-end gap-5 mt-10'>
            <div className='flex gap-3 text-base text-color-232f3e'>
              <p className='font-bold'>Tổng đơn:</p>
              <span className='font-medium'>
                {formatCurrency(carts?.cartTotal || 0)}
              </span>
            </div>
            <Link
              to='/thanh-toan'
              className='transition-all max-w-[200px] w-full text-center font-bold bg-color-febd69 hover:bg-opacity-80 py-[8px] px-[15px] text-color-131921 rounded-full'
            >
              Mua hàng
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default Carts;
