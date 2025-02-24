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

  const onSubmit = async (data) => {
    const { email, password } = data;
    const response = await login(email, password);
    if (response.success) {
      dispatch(isLoggedIn(response));
      await messageApi.open({
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
  };

  return (
    <section className='flex items-center justify-center h-screen bg-color-232f3e'>
      <div className='px-[30px] py-10 bg-white shadow-lg max-w-[500px] border w-full rounded-lg'>
        <h3 className='mb-3 text-2xl font-bold text-center uppercase text-color-3b4149'>
          .Đăng nhập.
        </h3>
        <Form
          onFinish={handleSubmit(onSubmit)}
          autoComplete='off'
          layout='vertical'
        >
          <Form.Item
            label='Email:'
            className='mb-6'
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='Nhập email của bạn...'
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label='Mật khẩu:'
            className='mb-6'
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder='Nhập mật khẩu của bạn...'
                />
              )}
            />
          </Form.Item>

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
