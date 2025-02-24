import { createProducts } from '@/api/config';
import { getBrands } from '@/redux/brand/brandAction';
import { getColors } from '@/redux/color/colorAction';
import { getPCategories } from '@/redux/productCategories/productCategoriesAction';
import { PlusOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Select,
  Upload
} from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IoIosArrowRoundBack } from 'react-icons/io';
import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

const schema = yup.object().shape({
  title: yup.string().required('Vui lòng nhập tiêu đề!'),
  price: yup
    .number()
    .typeError('Giá phải là số!')
    .required('Vui lòng nhập giá!'),
  category: yup.string().required('Vui lòng chọn danh mục!'),
  brand: yup.string().required('Vui lòng chọn thương hiệu!'),
  quantity: yup
    .number()
    .typeError('Số lượng phải là số!')
    .required('Vui lòng nhập số lượng!'),
  color: yup
    .array()
    .min(1, 'Vui lòng chọn ít nhất 1 màu!')
    .required('Vui lòng chọn màu!'),
  description: yup.string().required('Vui lòng nhập mô tả!'),
  images: yup
    .array()
    .min(1, 'Vui lòng tải lên ít nhất 1 hình ảnh!')
    .max(5, 'Chỉ được tải tối đa 5 ảnh!')
    .required('Vui lòng chọn hình ảnh!')
    .test('fileType', 'Chỉ được tải lên hình ảnh!', (images) =>
      images.every((file) =>
        [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/jpg',
          'image/gif',
          'image/bmp',
          'image/tiff'
        ].includes(file?.type || file?.originFileObj?.type)
      )
    )
});

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AddProduct = () => {
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      price: '',
      category: '',
      brand: '',
      quantity: 1,
      color: [],
      description: '',
      images: []
    }
  });

  const navigate = useNavigate();
  const fileList = watch('images', []);
  const dispatch = useDispatch();
  const { pCategories } = useSelector((state) => state.pCategory);
  const { brands } = useSelector((state) => state.brand);
  const { colors } = useSelector((state) => state.color);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    dispatch(getPCategories());
    dispatch(getColors());
    dispatch(getBrands());
  }, [dispatch]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('price', +data.price);
    formData.append('category', data.category);
    formData.append('brand', data.brand);
    formData.append('quantity', +data.quantity);
    formData.append('color', data.color);
    formData.append('description', data.description);
    data.images.forEach((image) => {
      if (image.originFileObj) {
        formData.append('images', image.originFileObj);
      }
    });
    try {
      const response = await createProducts(formData);
      if (response.success) {
        await messageApi.open({
          type: 'success',
          content: response.message,
          duration: 0.5
        });
        reset();
        navigate('/san-pham');
      } else {
        messageApi.open({
          type: 'error',
          content: response?.message
        });
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  return (
    <section>
      {contextHolder}
      <div>
        <h3 className='mb-3 text-xl font-bold '>Tạo sản phẩm mới</h3>
        <Link
          to='/san-pham'
          className='flex items-center w-fit'
        >
          <IoIosArrowRoundBack />
          Trở lại sản phẩm
        </Link>
      </div>
      <Form
        onFinish={handleSubmit(onSubmit)}
        autoComplete='off'
        layout='vertical'
        className='mt-5'
      >
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
                placeholder='Nhập tiêu đề sản phẩm...'
              />
            )}
          />
        </Form.Item>

        <div className='flex flex-col items-center justify-between gap-5 md:flex-row'>
          <Form.Item
            label='Giá:'
            validateStatus={errors.price ? 'error' : ''}
            help={errors.price?.message}
            className='flex-1 w-full shrink-0'
          >
            <Controller
              name='price'
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  placeholder='Nhập giá sản phẩm...'
                  min={0}
                  className='w-full'
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ₫'
                  }
                  parser={(value) => value.replace(/\s?₫|(,*)/g, '')}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label='Số lượng:'
            validateStatus={errors.quantity ? 'error' : ''}
            help={errors.quantity?.message}
            className='flex-1 w-full shrink-0'
          >
            <Controller
              name='quantity'
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  placeholder='Nhập số lượng sản phẩm...'
                  min={1}
                  className='w-full'
                />
              )}
            />
          </Form.Item>
        </div>

        <div className='flex flex-col items-center justify-between gap-5 md:flex-row'>
          <Form.Item
            label='Danh mục:'
            validateStatus={errors.category ? 'error' : ''}
            help={errors.category?.message}
            className='flex-1 w-full shrink-0'
          >
            <Controller
              name='category'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder='Chọn danh mục sản phẩm...'
                  value={field.value || undefined}
                  options={pCategories?.map((category) => ({
                    value: category.title,
                    label: category.title
                  }))}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label='Thương hiệu:'
            validateStatus={errors.brand ? 'error' : ''}
            help={errors.brand?.message}
            className='flex-1 w-full shrink-0'
          >
            <Controller
              name='brand'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  placeholder='Chọn thương hiệu sản phẩm...'
                  value={field.value || undefined}
                  options={brands?.map((brand) => ({
                    value: brand.title,
                    label: brand.title
                  }))}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label='Màu sắc:'
            validateStatus={errors.color ? 'error' : ''}
            help={errors.color?.message}
            className='flex-1 w-full shrink-0'
          >
            <Controller
              name='color'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  mode='multiple'
                  allowClear
                  showSearch
                  placeholder='Chọn màu sản phẩm...'
                  value={field.value || undefined}
                  options={colors?.map((color) => ({
                    value: color.title,
                    label: (
                      <div className='flex items-center'>
                        <span
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: color.title,
                            display: 'inline-block',
                            marginRight: '8px'
                          }}
                        />
                        {color.title}
                      </div>
                    )
                  }))}
                />
              )}
            />
          </Form.Item>
        </div>

        <Form.Item
          label='Hình ảnh:'
          validateStatus={errors.images ? 'error' : ''}
          help={errors.images?.message}
        >
          <Controller
            name='images'
            control={control}
            render={() => (
              <Upload
                listType='picture-card'
                fileList={fileList}
                beforeUpload={(file) => {
                  setValue('images', [...fileList, file]);
                  return false;
                }}
                onPreview={handlePreview}
                onChange={({ fileList: newList }) =>
                  setValue('images', newList)
                }
              >
                {fileList.length >= 5 ? null : (
                  <div>
                    <PlusOutlined />
                    <div>Thêm ảnh</div>
                  </div>
                )}
              </Upload>
            )}
          />
        </Form.Item>

        <Form.Item
          label='Mô tả:'
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description?.message}
        >
          <Controller
            name='description'
            control={control}
            render={({ field }) => (
              <ReactQuill
                {...field}
                placeholder='Nhập mô tả sản phẩm...'
                theme='snow'
                className='bg-white'
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            loading={isSubmitting}
            disabled={isSubmitting}
            htmlType='submit'
            className='w-full mt-5 font-bold'
          >
            Tạo
          </Button>
        </Form.Item>
      </Form>

      <Image.PreviewGroup
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible)
        }}
      >
        <Image
          src={previewImage}
          style={{ display: 'none' }}
        />
      </Image.PreviewGroup>
    </section>
  );
};

export default AddProduct;
