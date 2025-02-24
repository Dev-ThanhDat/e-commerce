import { getABlogs, updateBlogs } from '@/api/config';
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
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

const schema = yup.object().shape({
  title: yup.string().required('Vui lòng nhập tiêu đề!'),
  category: yup.string().required('Vui lòng chọn danh mục!'),
  description: yup.string().required('Vui lòng nhập chi tiết bài viết!')
});

const UpdateBlog = () => {
  const { blogId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const { bCategories } = useSelector((state) => state.bCategory);

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

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await getABlogs(blogId);
        if (response.success) {
          const { title, category, description, image } = response.blog;
          setValue('title', title);
          setValue('category', category);
          setValue('description', description);
          setPreviewImage(image);
        } else {
          displayMessage('error', response.message);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId, dispatch, setValue]);

  const displayMessage = (type, content) => {
    messageApi.open({
      type,
      content
    });
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('description', data.description);
    if (data.image) {
      formData.append('image', data.image);
    }

    try {
      const response = await updateBlogs(blogId, formData);
      if (response.success) {
        displayMessage('success', response.message);
        reset();
        navigate('/bai-viet');
      } else {
        displayMessage('error', response.message);
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  return (
    <section>
      <div>
        <h3 className='mb-3 text-xl font-bold '>Sửa bài viết</h3>
        <Link
          to='/bai-viet'
          className='flex items-center w-fit'
        >
          <IoIosArrowRoundBack />
          Trở lại bài viết
        </Link>
      </div>

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
                  beforeUpload={(image) => {
                    setValue('image', image);
                    setPreviewImage(URL.createObjectURL(image));
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
                value={field.value || undefined}
                options={bCategories.map((category) => ({
                  value: category.title,
                  label: category.title
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
                className='bg-white'
                onChange={(value) => setValue('description', value)}
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
            Sửa
          </Button>
        </Form.Item>
      </Form>

      {contextHolder}
    </section>
  );
};

export default UpdateBlog;
