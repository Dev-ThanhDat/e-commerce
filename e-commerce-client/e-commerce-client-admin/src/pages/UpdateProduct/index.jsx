import { getAProducts, updateProducts } from '@/api/config';
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
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  description: yup.string().required('Vui lòng nhập mô tả!')
});

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UpdateProduct = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [messageApi] = message.useMessage();

  const { pCategories, brands, colors } = useSelector((state) => ({
    pCategories: state.pCategory.pCategories,
    brands: state.brand.brands,
    colors: state.color.colors
  }));

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

  const fileList = watch('images', []);

  useEffect(() => {
    dispatch(getPCategories());
    dispatch(getColors());
    dispatch(getBrands());
  }, [dispatch]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getAProducts(productId);
        if (response.success) {
          const {
            title,
            price,
            category,
            brand,
            quantity,
            color,
            description,
            images
          } = response.product;
          setValue('title', title);
          setValue('price', price);
          setValue('category', category);
          setValue('brand', brand);
          setValue('quantity', quantity);
          setValue('color', color[0]?.split(','));
          setValue('description', description);
          setValue(
            'images',
            images.map((image, index) => ({
              uid: index,
              name: image,
              status: 'done',
              url: image
            }))
          );
        } else {
          messageApi.error(response.message);
        }
      } catch (error) {
        messageApi.error('Lỗi khi lấy dữ liệu!: ', error);
      }
    };

    fetchProduct();
  }, [productId, setValue, messageApi]);

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
      } else {
        formData.append('existingImages', image.url);
      }
    });
    console.log(data.images);

    try {
      const response = await updateProducts(productId, formData);
      if (response.success) {
        messageApi.success(response.message);
        reset();
        navigate('/san-pham');
      } else {
        messageApi.error(response?.message);
      }
    } catch (error) {
      messageApi.error('Lỗi khi gửi dữ liệu!: ', error);
    }
  };

  return (
    <section>
      <div>
        <h3 className='mb-3 text-xl font-bold '>Sửa sản phẩm</h3>
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
            className='flex-1 w-full'
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
            className='flex-1 w-full'
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
            className='flex-1 w-full'
          >
            <Controller
              name='category'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
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
            className='flex-1 w-full'
          >
            <Controller
              name='brand'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
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
            className='flex-1 w-full'
          >
            <Controller
              name='color'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  mode='multiple'
                  allowClear
                  placeholder='Chọn màu sản phẩm...'
                  value={field.value || undefined}
                  options={colors?.map((color) => ({
                    value: color.title,
                    label: (
                      <div className='flex items-center'>
                        <span
                          className={`w-4 h-4 ${color.title}`}
                          style={{
                            display: 'inline-block',
                            width: '16px',
                            height: '16px',
                            backgroundColor: color.title,
                            marginRight: '8px'
                          }}
                        ></span>
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
                onChange={({ fileList: newFileList }) =>
                  setValue('images', newFileList)
                }
              >
                {fileList.length >= 5 ? null : (
                  <button type='button'>
                    <PlusOutlined />
                    <div>Thêm ảnh</div>
                  </button>
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
                onChange={(value) => setValue('description', value)}
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
            Cập nhật
          </Button>
        </Form.Item>
      </Form>

      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage('')
          }}
          src={previewImage}
        />
      )}
    </section>
  );
};

export default UpdateProduct;
