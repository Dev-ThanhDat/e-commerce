import { logout, restPassword } from '@/api/config';
import BreadCrumb from '@/components/BreadCrumb';
import { isLoggedOut } from '@/redux/auth/authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const schema = yup.object({
  oldPassword: yup.string().required('Vui lòng! Nhập mật khẩu củ của bạn.'),
  newPassword: yup.string().required('Vui lòng! Nhập mật khẩu mới của bạn.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Nhập lại mật khẩu mới không khớp!')
    .required('Vui lòng! Nhập lại mật khẩu mới của bạn.')
});

const ResetPassword = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [showOldPassword, setShowOldPassowrd] = useState(false);
  const [showNewPassword, setShowNewPassowrd] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    document.title = 'Đặt lại mật khẩu';
  }, []);

  const handleShowOldPassword = () => {
    setShowOldPassowrd(!showOldPassword);
  };

  const handleShowNewPassword = () => {
    setShowNewPassowrd(!showNewPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (data) => {
    const response = await restPassword(data.oldPassword, data.newPassword);
    if (response.success) {
      toast.success(response.message);
      reset({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      await logout();
      dispatch(isLoggedOut());
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <BreadCrumb title='Đặt lại mật khẩu' />
      <section className='w-full flex-1 flex items-center justify-center relative max-w-screen-xl mx-auto p-[15px]'>
        <div className='px-[30px] py-10 bg-white shadow-lg max-w-[500px] w-full rounded-lg'>
          <h3 className='mb-6 text-2xl font-bold text-center text-color-3b4149'>
            Đặt lại mật khẩu.
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-5'
          >
            <div>
              <div className='flex items-center gap-2 px-4 py-2 border rounded-lg'>
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  placeholder='Nhập mật khẩu củ...'
                  className='w-full outline-none '
                  {...register('oldPassword')}
                />
                <span
                  onClick={handleShowOldPassword}
                  className='pl-2 border-l cursor-pointer'
                >
                  {showOldPassword ? (
                    <FaRegEye size={15} />
                  ) : (
                    <FaRegEyeSlash size={15} />
                  )}
                </span>
              </div>
              <p className='text-[10px] text-red-500 mt-[2px]'>
                {errors.oldPassword?.message}
              </p>
            </div>
            <div>
              <div className='flex items-center gap-2 px-4 py-2 border rounded-lg'>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder='Nhập mật khẩu mới...'
                  className='w-full outline-none '
                  {...register('newPassword')}
                />
                <span
                  onClick={handleShowNewPassword}
                  className='pl-2 border-l cursor-pointer'
                >
                  {showNewPassword ? (
                    <FaRegEye size={15} />
                  ) : (
                    <FaRegEyeSlash size={15} />
                  )}
                </span>
              </div>
              <p className='text-[10px] text-red-500 mt-[2px]'>
                {errors.newPassword?.message}
              </p>
            </div>
            <div>
              <div className='flex items-center gap-2 px-4 py-2 border rounded-lg'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Nhập lại mật khẩu mới...'
                  className='w-full outline-none '
                  {...register('confirmPassword')}
                />
                <span
                  onClick={handleShowConfirmPassword}
                  className='pl-2 border-l cursor-pointer'
                >
                  {showConfirmPassword ? (
                    <FaRegEye size={15} />
                  ) : (
                    <FaRegEyeSlash size={15} />
                  )}
                </span>
              </div>
              <p className='text-[10px] text-red-500 mt-[2px]'>
                {errors.confirmPassword?.message}
              </p>
            </div>
            <div className='flex flex-col items-center justify-center'>
              <button
                disabled={isSubmitting}
                className={`text-white rounded-full md:max-w-[150px] flex items-center justify-center w-full transition-all font-bold bg-color-232f3e hover:bg-opacity-80 py-[8px] px-[15px] ${
                  isSubmitting && 'pointer-events-none opacity-80'
                }`}
              >
                {isSubmitting ? (
                  <div className='w-[20px] h-[20px] border-2 border-white rounded-full animate-spin border-t-transparent'></div>
                ) : (
                  'Đặt lại'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;
