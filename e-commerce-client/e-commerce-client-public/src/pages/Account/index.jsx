import { getAUser, logout } from '@/api/config';
import BreadCrumb from '@/components/BreadCrumb';
import { updateUser } from '@/redux/auth/authAction';
import { isLoggedOut } from '@/redux/auth/authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const schema = yup.object({
  firstname: yup.string().required('Vui lòng! Nhập tên của bạn.'),
  lastname: yup.string().required('Vui lòng! Nhập họ của bạn.')
});

const Account = () => {
  const { user, isSuccess, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [data, setData] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const fetchUser = async () => {
    if (!user?._id) return;
    const response = await getAUser(user._id);
    if (response.success) {
      setData(response.user);
      setValue('firstname', response.user.firstname);
      setValue('lastname', response.user.lastname);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onSubmit = async (data) => {
    dispatch(updateUser(data));
    if (isSuccess) {
      fetchUser();
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.success) {
        toast.success(response.message);
        dispatch(isLoggedOut());
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  return (
    <>
      <BreadCrumb title='Tài khoản' />
      <section className='w-full max-w-screen-xl mx-auto p-[15px] flex flex-col items-start gap-5 mb-5'>
        <div className='w-full mb-5 text-center'>
          <h2 className='mb-3 text-2xl text-color-febd69'>
            {`${data?.firstname || ''} ${data?.lastname || ''}`}
          </h2>
          <p>{data?.email}</p>
          <button
            className='mt-3 text-white rounded-full md:max-w-[150px] w-full transition-all font-bold bg-color-bf4800 hover:bg-opacity-80 py-[4px] px-[10px]'
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete='off'
          className='flex flex-col gap-5 w-full max-w-[400px] mx-auto'
        >
          <div>
            <input
              type='text'
              placeholder='Nhập tên...'
              className='w-full px-4 py-2 border rounded-lg outline-none'
              {...register('firstname')}
            />
            <p className='text-[10px] text-red-500 mt-[2px]'>
              {errors.firstname?.message}
            </p>
          </div>

          <div>
            <input
              type='text'
              placeholder='Nhập họ...'
              className='w-full px-4 py-2 border rounded-lg outline-none'
              {...register('lastname')}
            />
            <p className='text-[10px] text-red-500 mt-[2px]'>
              {errors.lastname?.message}
            </p>
          </div>

          <div className='flex flex-col items-center justify-center gap-2 md:gap-5 md:flex-row'>
            <button
              type='submit'
              disabled={isSubmitting}
              className={`text-white rounded-full md:max-w-[150px] w-full flex items-center justify-center transition-all font-bold bg-color-232f3e hover:bg-opacity-80 py-[8px] px-[15px] ${
                isSubmitting && 'pointer-events-none opacity-80'
              }`}
            >
              {isSubmitting ? (
                <div className='w-[20px] h-[20px] border-2 border-white rounded-full animate-spin border-t-transparent'></div>
              ) : (
                'Cập nhật'
              )}
            </button>
            <Link
              to='/dat-lai-mat-khau'
              className='text-color-232f3e rounded-full md:max-w-[150px] text-center w-full transition-all font-bold bg-color-febd69 hover:bg-opacity-80 py-[8px] px-[15px]'
            >
              Đặt lại mật khẩu
            </Link>
          </div>
        </form>
      </section>
    </>
  );
};

export default Account;
