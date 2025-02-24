import { registerUser } from '@/api/config';
import BreadCrumb from '@/components/BreadCrumb';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const schema = yup.object({
  firstname: yup.string().required('Vui lòng! Nhập tên của bạn.'),
  lastname: yup.string().required('Vui lòng! Nhập tên đệm của bạn.'),
  email: yup
    .string()
    .email('Vui lòng! Nhập đúng định dạng email.')
    .required('Vui lòng! Nhập email của bạn.'),
  password: yup
    .string()
    .required('Vui lòng! Nhập mật khẩu của bạn.')
    .min(8, 'Mật khẩu của bạn phải có ít nhất 8 ký tự trở lên!')
});

const InputField = ({ type, placeholder, register, error }) => (
  <div>
    <input
      type={type}
      placeholder={placeholder}
      className='w-full px-4 py-2 border rounded-lg outline-none'
      {...register}
    />
    {error && <p className='text-[10px] text-red-500 mt-[2px]'>{error}</p>}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
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
  }, [pathname]);

  useEffect(() => {
    document.title = 'Đăng ký';
  }, []);

  const handleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);
      if (response.success) {
        toast.success(response.message);
        navigate('/dang-nhap');
        reset();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  return (
    <>
      <BreadCrumb title='Tạo tài khoản' />
      <section className='w-full flex-1 flex items-center justify-center relative max-w-screen-xl mx-auto p-[15px]'>
        <div className='px-[30px] py-5 bg-white shadow-lg max-w-[500px] w-full rounded-lg'>
          <h3 className='mb-6 text-2xl font-bold text-center text-color-3b4149'>
            Tạo tài khoản.
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-5'
          >
            <InputField
              type='text'
              placeholder='Nhập tên...'
              register={register('firstname')}
              error={errors.firstname?.message}
            />
            <InputField
              type='text'
              placeholder='Nhập tên đệm...'
              register={register('lastname')}
              error={errors.lastname?.message}
            />
            <InputField
              type='email'
              placeholder='Nhập email...'
              register={register('email')}
              error={errors.email?.message}
            />
            <div>
              <div className='flex items-center gap-2 px-4 py-2 border rounded-lg'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Nhập mật khẩu...'
                  className='w-full outline-none '
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
              {errors.password?.message && (
                <p className='text-[10px] text-red-500 mt-[2px]'>
                  {errors.password?.message}
                </p>
              )}
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
                  'Tạo'
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
