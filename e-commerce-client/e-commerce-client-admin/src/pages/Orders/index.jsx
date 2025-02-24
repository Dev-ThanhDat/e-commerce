import { deleteOrders, updateOrders } from '@/api/config';
import Model from '@/components/Model';
import { getOrders } from '@/redux/order/orderAction';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, Input, message, Modal, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
const { Search } = Input;

const schema = yup.object().shape({
  status: yup.string().required('Vui lòng chọn trạng thái!')
});

const columns = [
  {
    title: 'STT',
    dataIndex: 'key',
    align: 'center'
  },
  {
    title: 'Mã đơn',
    dataIndex: 'id',
    align: 'center'
  },
  {
    title: 'Sản phẩm',
    dataIndex: 'product',
    align: 'center'
  },
  {
    title: 'Số lượng',
    dataIndex: 'amount',
    sorter: (a, b) => a.amount.length - b.amount.length,
    showSorterTooltip: false,
    align: 'center'
  },
  {
    title: 'Ngày mua',
    dataIndex: 'date',
    sorter: (a, b) => a.date.length - b.date.length,
    showSorterTooltip: false,
    align: 'center'
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    align: 'center'
  },
  {
    title: 'Lựa chọn',
    dataIndex: 'action',
    align: 'center'
  }
];

const Orders = () => {
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: ''
    }
  });

  const dispatch = useDispatch();
  const { orders, total } = useSelector((state) => state.order);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState(null);

  useEffect(() => {
    dispatch(
      getOrders({
        search: searchTerm
      })
    );
  }, [dispatch, searchTerm]);

  useEffect(() => {
    const filteredOrders = orders?.map((order, index) => ({
      key: orders.length - index,
      id: order._id,
      product: (
        <button onClick={() => handleViewProducts(order)}>
          Xem sản phẩm của đơn
        </button>
      ),
      amount: order.products.reduce(
        (total, product) => total + product.quantity,
        0
      ),
      date: new Date(order.createdAt).toLocaleDateString('vi-VI'),
      status: order.orderStatus,
      action: (
        <div className='flex items-center justify-center gap-5'>
          <button
            onClick={() => {
              setSelectedOrder(null);
              setCurrentOrderId(order._id);
              setValue('status', order.orderStatus);
              setOpen(true);
            }}
            className='text-green-500'
          >
            <CiEdit size={20} />
          </button>
          <button
            onClick={() => handleDelete(order._id)}
            className='text-red-500'
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      )
    }));
    setData(filteredOrders);
    setPagination((prev) => ({ ...prev, total }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, total]);

  const onSubmit = async (data) => {
    try {
      const response = await updateOrders(currentOrderId, data.status);
      if (response.success) {
        messageApi.open({
          type: 'success',
          content: response.message
        });
        reset();
        setOpen(false);
        dispatch(getOrders());
      } else {
        messageApi.open({
          type: 'error',
          content: response.message
        });
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  const handleViewProducts = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleDelete = (orderId) => {
    Modal.confirm({
      title: 'Xóa đơn hàng',
      content: 'Bạn có chắc chắn muốn xóa đơn hàng này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await deleteOrders(orderId);
          if (response.success) {
            messageApi.open({
              type: 'success',
              content: response.message
            });
            dispatch(getOrders());
          } else {
            messageApi.open({
              type: 'error',
              content: response.message
            });
          }
        } catch (error) {
          console.error('Lỗi khi xóa dữ liệu:', error);
        }
      }
    });
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
        <h3 className='mb-5 text-xl font-bold'>Danh sách đơn đặt hàng</h3>

        <Search
          placeholder='Tìm kiếm mã đơn...'
          className='max-w-[350px] w-full shrink-0 mb-5'
          enterButton
          allowClear
          onSearch={handleSearch}
        />

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
        onClose={() => {
          setOpen(false);
        }}
      >
        <h3 className='mb-5 text-xl font-bold text-center uppercase'>
          {selectedOrder
            ? ' Sản phẩm của đơn hàng'
            : 'Cập nhật trạng thái đơn hàng'}
        </h3>
        {selectedOrder ? (
          <div className='max-h-[500px] overflow-y-auto flex flex-col gap-3'>
            {selectedOrder.products.map((product) => (
              <article
                key={product._id}
                className='flex flex-col items-center gap-5 p-2 border rounded-md md:flex-row'
              >
                <div className='w-full md:w-[30%] border shrink-0 rounded-md overflow-hidden'>
                  <img
                    src={product.product.images[0]}
                    alt={product.product.title}
                    className='object-cover w-full h-full'
                  />
                </div>
                <div className='text-base'>
                  <p className='text-xl line-clamp-2'>
                    <strong>Tên sản phẩm:</strong> {product.product.title}
                  </p>
                  <p className='line-clamp-1'>
                    <strong>Số lượng:</strong> {product.quantity}
                  </p>
                  <p className='line-clamp-1'>
                    <strong>Màu sắc:</strong> {product.color}
                  </p>
                  <p className='line-clamp-1'>
                    <strong>Giá:</strong> {product.product.price}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Form
            onFinish={handleSubmit(onSubmit)}
            layout='vertical'
          >
            <Form.Item
              label='Trạng thái đơn:'
              validateStatus={errors.status ? 'error' : ''}
              help={errors.status?.message}
            >
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder='Chọn trạng thái...'
                    options={[
                      { value: 'Chưa được xử lý', label: 'Chưa được xử lý' },
                      { value: 'Đang xử lý', label: 'Đang xử lý' },
                      { value: 'Đã xử lý', label: 'Đã xử lý' },
                      { value: 'Đã giao hàng', label: 'Đã giao hàng' }
                    ]}
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
                className='w-full font-bold'
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        )}
      </Model>

      {contextHolder}
    </section>
  );
};

export default Orders;
