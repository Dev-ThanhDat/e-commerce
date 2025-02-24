import { createBlogs } from '@/api/config';
import { getBCategories } from '@/redux/blogCategories/blogCategoriesAction';
import { InboxOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, Input, message, Select } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IoIosArrowRoundBack } from 'react-icons/io';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const schema = yup.object().shape({
  title: yup.string().required('Vui lòng nhập tiêu đề!'),
  category: yup.string().required('Vui lòng chọn danh mục!'),
  description: yup.string().required('Vui lòng nhập chi tiết bài viết!'),
  image: yup
    .mixed()
    .required('Vui lòng tải lên một hình ảnh!')
    .test(
      'fileType',
      'Chỉ được tải lên hình ảnh!',
      (file) =>
        file &&
        [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/jpg',
          'image/gif',
          'image/bmp',
          'image/tiff'
        ].includes(file.type)
    )
});

const AddBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bCategories } = useSelector((state) => state.bCategory);

  const [previewImage, setPreviewImage] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
      image: null
    }
  });

  useEffect(() => {
    dispatch(getBCategories());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));

    try {
      const res = await createBlogs(formData);
      if (res.success) {
        messageApi.success(res.message);
        reset();
        navigate('/bai-viet');
      } else {
        messageApi.error(res.message);
      }
    } catch (err) {
      console.error('Lỗi khi gửi dữ liệu:', err);
    }
  };

  return (
    <section>
      <h3 className='mb-3 text-xl font-bold'>Tạo bài viết mới</h3>
      <Link
        to='/bai-viet'
        className='flex items-center w-fit'
      >
        <IoIosArrowRoundBack />
        Trở lại bài viết
      </Link>

      <Form
        onFinish={handleSubmit(onSubmit)}
        autoComplete='off'
        layout='vertical'
        className='mt-5'
      >
        <Form.Item
          label='Hình ảnh:'
          validateStatus={errors.image ? 'error' : ''}
          help={errors.image?.message}
        >
          <Controller
            name='image'
            control={control}
            render={() => (
              <>
                <Dragger
                  name='image'
                  maxCount={1}
                  accept='image/*'
                  beforeUpload={(file) => {
                    setValue('image', file);
                    setPreviewImage(URL.createObjectURL(file));
                    return false;
                  }}
                  onRemove={() => {
                    setValue('image', null);
                    setPreviewImage(null);
                  }}
                >
                  <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                  </p>
                  <p className='ant-upload-text'>
                    Kéo thả hoặc click để tải ảnh lên
                  </p>
                </Dragger>
                {previewImage && (
                  <div className='mt-4'>
                    <p className='font-bold'>Ảnh xem trước:</p>
                    <img
                      loading='lazy'
                      src={previewImage}
                      alt='Preview'
                      className='object-cover w-[60%] h-auto mt-2 rounded block mx-auto'
                    />
                  </div>
                )}
              </>
            )}
          />
        </Form.Item>

        <Form.Item
          label='Tiêu đề:'
          validateStatus={errors.title ? 'error' : ''}
          help={errors.title?.message}
        >
          <Controller
            name='title'
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Nhập tiêu đề bài viết...'
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label='Danh mục:'
          validateStatus={errors.category ? 'error' : ''}
          help={errors.category?.message}
        >
          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                className='max-w-[250px] w-full'
                placeholder='Chọn danh mục bài viết...'
                showSearch
                value={field.value || undefined}
                options={bCategories?.map((c) => ({
                  value: c.title,
                  label: c.title
                }))}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label='Chi tiết:'
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description?.message}
        >
          <Controller
            name='description'
            control={control}
            render={({ field }) => (
              <ReactQuill
                {...field}
                theme='snow'
                placeholder='Nhập chi tiết bài viết...'
                onChange={(value) => setValue('description', value)}
                className='bg-white'
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            loading={isSubmitting}
            disabled={isSubmitting}
            className='w-full mt-5 font-bold'
          >
            Tạo
          </Button>
        </Form.Item>
      </Form>

      {contextHolder}
    </section>
  );
};

export default AddBlog;
