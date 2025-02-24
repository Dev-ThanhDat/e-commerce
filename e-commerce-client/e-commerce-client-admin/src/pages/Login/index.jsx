import { login } from '@/api/config';
import { isLoggedIn } from '@/redux/auth/authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, Input, message } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Vui lòng nhập đúng định dạng email!')
    .required('Vui lòng nhập email!'),
  password: yup.string().required('Vui lòng nhập mật khẩu!')
});

const InputField = ({
  name,
  label,
  control,
  errors,
  type = 'text',
  placeholder
}) => (
  <Form.Item
    label={label}
    className='mb-6'
    validateStatus={errors[name] ? 'error' : ''}
    help={errors[name]?.message}
  >
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          {name === 'password' ? (
            <Input.Password
              {...field}
              type={type}
              placeholder={placeholder}
            />
          ) : (
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
            />
          )}
        </>
      )}
    />
  </Form.Item>
);

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const onSubmit = async ({ email, password }) => {
    try {
      const response = await login(email, password);
      if (response.success) {
        dispatch(isLoggedIn(response));
        messageApi.open({
          type: 'success',
          content: response.message,
          duration: 0.5
        });
        navigate('/');
      } else {
        messageApi.open({
          type: 'error',
          content: response.message
        });
      }
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: 'error',
        content: 'Đã xảy ra lỗi. Vui lòng thử lại!'
      });
    }
  };

  return (
    <section className='flex items-center justify-center h-screen bg-color-232f3e'>
      <div className='px-[30px] py-10 bg-white shadow-lg max-w-[500px] border w-full rounded-lg'>
        <h3 className='mb-3 text-2xl font-bold text-center uppercase text-color-3b4149'>
          .Đăng nhập.
        </h3>
        <Form
          onFinish={handleSubmit(onSubmit)}
          layout='vertical'
        >
          <InputField
            name='email'
            label='Email:'
            control={control}
            errors={errors}
            placeholder='Nhập email của bạn...'
          />
          <InputField
            name='password'
            label='Mật khẩu:'
            control={control}
            errors={errors}
            type='password'
            placeholder='Nhập mật khẩu của bạn...'
          />
          <Form.Item
            label={null}
            className='mb-0'
          >
            <Button
              type='primary'
              loading={isSubmitting}
              disabled={isSubmitting}
              htmlType='submit'
              className='w-full mt-2 font-bold'
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
      {contextHolder}
    </section>
  );
};

export default Login;
