import { applyCoupon, createOrders } from '@/api/config';
import BreadCrumb from '@/components/BreadCrumb';
import ColorItem from '@/components/ColorItem';
import { getCarts } from '@/redux/cart/cartAction';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoIosArrowBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const schema = yup.object({
  firstname: yup.string().required('Vui lòng! Nhập tên của bạn.'),
  lastname: yup.string().required('Vui lòng! Nhập họ của bạn.'),
  address: yup.string().required('Vui lòng! Nhập địa chỉ của bạn.'),
  city: yup.string().required('Vui lòng! Nhập thành phố của bạn.'),
  phone: yup
    .string()
    .required('Vui lòng! Nhập số điện thoại của bạn.')
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ.')
});

const CheckOut = () => {
  const { user, carts } = useSelector((state) => ({
    user: state.auth.user,
    carts: state.cart.carts
  }));
  const [coupon, setCoupon] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const dispatch = useDispatch();
  const navigation = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Thanh toán';
    if (user?._id) dispatch(getCarts(user._id));
  }, [user, dispatch]);

  const handleApplyCoupon = async () => {
    if (!coupon) return toast.error('Vui lòng nhập mã giảm giá!');
    const response = await applyCoupon(coupon);
    if (response.success) {
      toast.success(response.message);
      dispatch(getCarts(user._id));
      setCoupon('');
    } else {
      toast.error(response.message);
    }
  };

  const onSubmit = async (data) => {
    const response = await createOrders({
      couponApplied: !!coupon,
      ...data
    });
    if (response.success) {
      toast.success(response.message);
      reset();
      dispatch(getCarts(user._id));
      navigation('/don-hang');
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <BreadCrumb title='Thanh toán' />
      <section className='w-full max-w-screen-xl mx-auto p-[15px] flex flex-col items-start lg:flex-row gap-5 mb-5'>
        <div className='flex flex-col order-2 gap-5 shadow-lg p-5 bg-white rounded-lg lg:order-1 w-full lg:w-[60%]'>
          <ul className='flex items-center'>
            <li>
              <Link
                to='/gio-hang'
                className='transition-all hover:text-color-febd69'
              >
                Giỏ hàng
              </Link>
            </li>
            &nbsp; / &nbsp;
            <li className='font-semibold text-color-febd69'>Thông tin</li>
            &nbsp; / &nbsp;
            <li>Thanh toán</li>
          </ul>
          <div className='flex flex-col gap-2'>
            <h3 className='text-2xl font-bold text-color-131921'>
              Thông tin liên hệ
            </h3>
            <p>{`${user?.firstname} ${user?.lastname} (${user?.email})`}</p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete='off'
            className='flex flex-col w-full gap-5'
          >
            <div className='flex flex-col gap-5 lg:flex-row'>
              <div className='flex-1'>
                <input
                  {...register('firstname')}
                  defaultValue={user?.firstname}
                  placeholder='Tên của bạn...'
                  className='w-full border outline-none rounded-md p-[10px]'
                />
                <p className='text-[10px] text-red-500 mt-[2px]'>
                  {errors.firstname?.message}
                </p>
              </div>
              <div className='flex-1'>
                <input
                  {...register('lastname')}
                  defaultValue={user?.lastname}
                  placeholder='Họ của bạn...'
                  className='w-full border outline-none rounded-md p-[10px]'
                />
                <p className='text-[10px] text-red-500 mt-[2px]'>
                  {errors.lastname?.message}
                </p>
              </div>
            </div>
            <div>
              <input
                {...register('address')}
                placeholder='Địa chỉ...'
                className='w-full border outline-none rounded-md p-[10px]'
              />
              <p className='text-[10px] text-red-500 mt-[2px]'>
                {errors.address?.message}
              </p>
            </div>
            <div className='flex flex-col gap-5 lg:flex-row'>
              <div className='flex-1'>
                <input
                  {...register('city')}
                  placeholder='Thành phố...'
                  className='w-full border outline-none rounded-md p-[10px]'
                />
                <p className='text-[10px] text-red-500 mt-[2px]'>
                  {errors.city?.message}
                </p>
              </div>
              <div className='flex-1'>
                <input
                  {...register('phone')}
                  placeholder='Số điện thoại...'
                  className='w-full border outline-none rounded-md p-[10px]'
                />
                <p className='text-[10px] text-red-500 mt-[2px]'>
                  {errors.phone?.message}
                </p>
              </div>
            </div>

            <div className='flex flex-col items-center justify-between gap-5 lg:flex-row'>
              <Link
                to='/gio-hang'
                className='flex items-center gap-2 transition-all w-fit text-color-777777 hover:opacity-80'
              >
                <IoIosArrowBack size={20} />
                <span className='text-base font-semibold'>
                  Quay trở lại giỏ hàng
                </span>
              </Link>
              <button
                disabled={isSubmitting}
                className={`text-white rounded-full flex items-center justify-center w-fit transition-all font-bold bg-color-232f3e hover:bg-opacity-80 py-[8px] px-[15px] ${
                  isSubmitting && 'pointer-events-none opacity-80'
                }`}
              >
                {isSubmitting ? (
                  <div className='w-[20px] h-[20px] border-2 border-white rounded-full animate-spin border-t-transparent'></div>
                ) : (
                  'Tiến hành thanh toán'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className='flex-1 order-1 lg:order-2'>
          <div className='mb-[10px] border-b pb-[10px]'>
            {carts?.products?.map((item) => (
              <div
                key={item.product._id}
                className='flex items-center gap-5 mb-3'
              >
                <div className='w-[80px] relative shrink-0 rounded-lg border'>
                  <img
                    loading='lazy'
                    src={item?.product?.images[0] || ''}
                    alt='Image product'
                    className='object-cover w-full h-full rounded-lg'
                  />
                  <span className='absolute top-[-10px] right-[-10px] w-[26px] p-[1px] h-[26px] flex items-center justify-center text-xs text-white rounded-full bg-color-232f3e'>
                    {item?.quantity}
                  </span>
                </div>
                <div className='flex flex-col items-start flex-1 gap-3 lg:items-center lg:flex-row'>
                  <div className='flex flex-col gap-1'>
                    <h3 className='font-semibold line-clamp-2 text-color-232f3e'>
                      {item?.product?.title}
                    </h3>
                    <div className='flex items-center text-xs pointer-events-none line-clamp-1 text-color-777777'>
                      <span>{item?.product?.category}</span> &nbsp; / &nbsp;{' '}
                      <ColorItem color={item?.product?.color} />
                    </div>
                  </div>
                  <div className='ml-auto'>
                    <span className='font-bold line-clamp-1'>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(item?.product?.price * item?.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='flex flex-col gap-2 mb-[15px] border-b pb-[10px]'>
            <div className='flex items-center justify-between gap-5'>
              <span className='font-medium text-color-777777'>Tổng tiền:</span>
              <span className='font-bold text-color-232f3e'>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(carts?.cartTotal || 0)}
              </span>
            </div>
            <div className='flex items-center justify-between gap-5'>
              <span className='font-medium text-color-777777'>
                Tiền khi đã giảm:
              </span>
              <span className='font-bold text-color-232f3e'>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(carts?.totalAfterDiscount || 0)}
              </span>
            </div>
          </div>
          <div className='flex items-center justify-between gap-5 text-xl'>
            <span className='font-bold text-color-232f3e'>Thành tiền:</span>
            <span className='font-bold text-red-500'>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(carts?.totalAfterDiscount || carts?.cartTotal || 0)}
            </span>
          </div>

          <div className='flex items-center gap-3 mt-5'>
            <input
              type='text'
              placeholder='Nhập mã giảm giá...'
              value={coupon.toUpperCase()}
              onChange={(e) => setCoupon(e.target.value)}
              className='w-full border outline-none rounded-md p-[10px]'
            />
            <button
              onClick={handleApplyCoupon}
              className='transition-all bg-color-232f3e hover:bg-opacity-80 text-white font-bold shrink-0 py-[10px] px-[15px] rounded-md'
            >
              Áp dụng
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckOut;
