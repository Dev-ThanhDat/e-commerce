import { login } from '@/api/config';
import BreadCrumb from '@/components/BreadCrumb';
import { isLoggedIn } from '@/redux/auth/authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const schema = yup.object({
  email: yup
    .string()
    .email('Vui lòng nhập đúng định dạng email.')
    .required('Vui lòng nhập email của bạn.'),
  password: yup.string().required('Vui lòng nhập mật khẩu của bạn.')
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [showPassword, setShowPassword] = useState(false);

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
    document.title = 'Đăng nhập';
  }, [pathname]);

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data) => {
    try {
      const response = await login(data.email, data.password);
      if (response.success) {
        dispatch(isLoggedIn(response));
        toast.success(response.message);
        navigate('/');
        reset();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <>
      <BreadCrumb title='Đăng nhập' />
      <section className='w-full flex-1 flex items-center justify-center relative max-w-screen-xl mx-auto p-[15px]'>
        <div className='px-[30px] py-10 bg-white shadow-lg max-w-[500px] w-full rounded-lg'>
          <h3 className='mb-6 text-2xl font-bold text-center text-color-3b4149'>
            Đăng nhập
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-5'
          >
            <div>
              <input
                type='text'
                placeholder='Nhập email...'
                className='w-full px-4 py-2 border rounded-lg outline-none'
                {...register('email')}
              />
              <p className='text-[10px] text-red-500 mt-[2px]'>
                {errors.email?.message}
              </p>
            </div>

            <div>
              <div className='flex items-center gap-2 px-4 py-2 border rounded-lg'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Nhập mật khẩu...'
                  className='w-full outline-none'
                  {...register('password')}
                />
                <span
                  onClick={handleShowPassword}
                  className='pl-2 border-l cursor-pointer'
                >
                  {showPassword ? (
                    <FaRegEye size={15} />
                  ) : (
                    <FaRegEyeSlash size={15} />
                  )}
                </span>
              </div>
              <p className='text-[10px] text-red-500 mt-[2px]'>
                {errors.password?.message}
              </p>
            </div>

            <div className='flex flex-col items-center justify-center gap-2 md:gap-5 md:flex-row'>
              <button
                disabled={isSubmitting}
                className={`text-white rounded-full md:max-w-[150px] flex items-center justify-center w-full transition-all font-bold bg-color-232f3e hover:bg-opacity-80 py-[8px] px-[15px] ${
                  isSubmitting && 'pointer-events-none opacity-80'
                }`}
              >
                {isSubmitting ? (
                  <div className='w-[20px] h-[20px] border-2 border-white rounded-full animate-spin border-t-transparent' />
                ) : (
                  'Đăng nhập'
                )}
              </button>

              <Link
                to='/dang-ky'
                className='text-color-232f3e rounded-full md:max-w-[150px] text-center w-full transition-all font-bold bg-color-febd69 hover:bg-opacity-80 py-[8px] px-[15px]'
              >
                Đăng ký
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
