import { createCoupons, deleteCoupons, updateCoupons } from '@/api/config';
import Model from '@/components/Model';
import { getCoupons } from '@/redux/coupon/couponAction';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, DatePicker, Form, Input, message, Modal, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
const { Search } = Input;

const schema = yup.object().shape({
  name: yup.string().required('Vui lòng nhập mã giảm!'),
  discount: yup
    .number()
    .typeError('Vui lòng nhập phần trăm giảm!')
    .min(0, 'Giảm giá phải lớn hơn hoặc bằng 0!')
    .max(100, 'Giảm giá phải nhỏ hơn hoặc bằng 100!')
    .required('Vui lòng nhập phần trăm giảm!'),
  expiry: yup
    .date()
    .typeError('Vui lòng nhập ngày hết hạn hợp lệ!')
    .required('Vui lòng nhập ngày hết hạn!')
});

const columns = [
  {
    title: 'STT',
    dataIndex: 'key',
    align: 'center'
  },
  {
    title: 'Tên mã giảm',
    dataIndex: 'name',
    showSorterTooltip: false,
    align: 'center'
  },
  {
    title: 'Giảm giá',
    dataIndex: 'discount',
    align: 'center'
  },
  {
    title: 'Hết hạn',
    dataIndex: 'expiry',
    align: 'center'
  },
  {
    title: 'Lựa chọn',
    dataIndex: 'action',
    align: 'center'
  }
];

const Coupons = () => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      discount: '',
      expiry: ''
    }
  });

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { coupons, total } = useSelector((state) => state.coupon);
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentCouponId, setCurrentCouponId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    dispatch(getCoupons({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  useEffect(() => {
    const filteredCoupons = coupons?.map((coupon, index) => ({
      key: index + 1,
      name: coupon.name,
      discount: `${coupon.discount}%`,
      expiry: new Date(coupon.expiry).toLocaleDateString('vi-VI'),
      action: (
        <div className='flex items-center justify-center gap-5'>
          <button
            onClick={() => handleEditCoupon(coupon)}
            className='text-green-500'
          >
            <CiEdit size={20} />
          </button>
          <button
            onClick={() => handleDelete(coupon._id)}
            className='text-red-500'
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      )
    }));
    setData(filteredCoupons);
    setPagination((prev) => ({ ...prev, total }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coupons, total]);

  const handleEditCoupon = (coupon) => {
    setEditMode(true);
    setCurrentCouponId(coupon._id);
    setValue('name', coupon.name);
    setValue('discount', coupon.discount);
    setValue('expiry', coupon.expiry ? dayjs(coupon.expiry) : null);
    setOpen(true);
  };

  const handleDelete = (couponId) => {
    Modal.confirm({
      title: 'Xóa mã giảm',
      content: 'Bạn có chắc chắn muốn xóa mã giảm này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await deleteCoupons(couponId);
          if (response.success) {
            messageApi.open({ type: 'success', content: response.message });
            dispatch(getCoupons());
          } else {
            messageApi.open({ type: 'error', content: response.message });
          }
        } catch (error) {
          console.error('Lỗi khi xóa dữ liệu:', error);
        }
      }
    });
  };

  const onSubmit = async (data) => {
    try {
      const response = editMode
        ? await updateCoupons(currentCouponId, data)
        : await createCoupons(data);
      if (response.success) {
        messageApi.open({ type: 'success', content: response.message });
        reset();
        setOpen(false);
        setEditMode(false);
        dispatch(getCoupons());
      } else {
        messageApi.open({ type: 'error', content: response.message });
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  return (
    <section>
      <div>
        <h3 className='mb-3 text-xl font-bold'>Danh sách phiếu giảm giá</h3>
        <div className='flex flex-col justify-between gap-5 mb-5 md:items-center md:flex-row'>
          <button
            onClick={() => {
              setOpen(true);
              setEditMode(false);
              reset();
            }}
            className='px-4 py-2 text-white transition-all rounded-md w-fit bg-color-febd69 hover:text-white hover:bg-opacity-85 shrink-0'
          >
            Thêm mã giảm
          </button>
          <Search
            placeholder='Tìm kiếm mã giảm...'
            className='max-w-[350px] w-full shrink-0'
            enterButton
            allowClear
            onSearch={handleSearch}
          />
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>

      <Model
        open={open}
        onClose={() => setOpen(false)}
      >
        <h3 className='mb-5 text-xl font-bold text-center uppercase'>
          {editMode ? 'Chỉnh sửa mã giảm' : 'Tạo mã giảm'}
        </h3>
        <Form
          onFinish={handleSubmit(onSubmit)}
          autoComplete='off'
          layout='vertical'
          className='mt-5'
        >
          <div className='flex flex-col items-center justify-between mb-1 md:gap-5 md:flex-row'>
            <Form.Item
              label='Mã giảm:'
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name?.message}
              className='flex-1 w-full shrink-0'
            >
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    placeholder='Nhập mã giảm sản phẩm...'
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label='Giảm giá (%):'
              validateStatus={errors.discount ? 'error' : ''}
              help={errors.discount?.message}
              className='flex-1 w-full shrink-0'
            >
              <Controller
                name='discount'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder='Nhập phần trăm giảm giá...'
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label='Hết hạn:'
              validateStatus={errors.expiry ? 'error' : ''}
              help={errors.expiry?.message}
              className='flex-1 w-full shrink-0'
            >
              <Controller
                name='expiry'
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    format='DD/MM/YYYY'
                    placeholder='Chọn ngày hết hạn'
                    className='w-full'
                  />
                )}
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={isSubmitting}
              disabled={isSubmitting}
              className='w-full font-bold'
            >
              {editMode ? 'Cập nhật' : 'Tạo'}
            </Button>
          </Form.Item>
        </Form>
      </Model>

      {contextHolder}
    </section>
  );
};

export default Coupons;
