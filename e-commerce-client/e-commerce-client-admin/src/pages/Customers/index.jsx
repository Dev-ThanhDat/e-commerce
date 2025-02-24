import { deleteUsers, registerUser } from '@/api/config';
import Model from '@/components/Model';
import { getUsers } from '@/redux/cutomers/cutomersAction';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, Input, message, Modal, Table } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MdDeleteOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const { Search } = Input;

const schema = yup.object().shape({
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

const columns = [
  { title: 'STT', dataIndex: 'key', align: 'center' },
  {
    title: 'Tên người dùng',
    dataIndex: 'name',
    sorter: (a, b) => a.name.length - b.name.length,
    showSorterTooltip: false,
    align: 'center'
  },
  { title: 'Email', dataIndex: 'email', align: 'center' },
  {
    title: 'Lựa chọn',
    dataIndex: 'action',
    align: 'center'
  }
];

const Customers = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: ''
    }
  });

  const dispatch = useDispatch();
  const { customers, total } = useSelector((state) => state.customer);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    dispatch(getUsers({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  useEffect(() => {
    const filteredCustomers = customers
      ?.filter((customer) => customer.role !== 'ADMIN')
      .map((customer, index) => ({
        key: index + 1,
        name: `${customer.firstname} ${customer.lastname}`,
        email: customer.email,
        action: (
          <div className='flex items-center justify-center gap-5'>
            <button
              onClick={() => handleDelete(customer._id)}
              className='text-red-500'
            >
              <MdDeleteOutline size={20} />
            </button>
          </div>
        )
      }));
    setData(filteredCustomers);
    setPagination((prev) => ({ ...prev, total }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers, total]);

  const handleDelete = useCallback(
    (userId) => {
      Modal.confirm({
        title: 'Xóa người dùng',
        content: 'Bạn có chắc chắn muốn xóa người dùng này?',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: async () => {
          try {
            const response = await deleteUsers(userId);
            if (response.success) {
              messageApi.open({
                type: 'success',
                content: response.message
              });
              dispatch(getUsers());
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
    },
    [dispatch, messageApi]
  );

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data);
      if (response.success) {
        messageApi.open({
          type: 'success',
          content: response.message
        });
        reset();
        setOpen(false);
        dispatch(getUsers());
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

  return (
    <section>
      <div>
        <h3 className='mb-3 text-xl font-bold'>Danh sách khách hàng</h3>
        <div className='flex flex-col justify-between gap-5 mb-5 md:items-center md:flex-row'>
          <Button
            onClick={() => setOpen(true)}
            className='px-4 py-2 text-white rounded-md w-fit bg-color-febd69 hover:text-white hover:bg-opacity-85 shrink-0'
          >
            Thêm người dùng
          </Button>
          <Search
            placeholder='Tìm kiếm tên người dùng...'
            className='max-w-[350px] w-full mb-5'
            enterButton
            allowClear
            onSearch={handleSearch}
          />
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </div>
      <Model
        open={open}
        onClose={() => setOpen(false)}
      >
        <h3 className='mb-5 text-xl font-bold text-center uppercase'>
          Tạo người dùng
        </h3>
        <Form
          onFinish={handleSubmit(onSubmit)}
          autoComplete='off'
          layout='vertical'
        >
          <div className='flex gap-5'>
            <Form.Item
              label='Tên người dùng:'
              validateStatus={errors.firstname ? 'error' : ''}
              help={errors.firstname?.message}
              className='flex-1'
            >
              <Controller
                name='firstname'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder='Nhập tên...'
                  />
                )}
              />
            </Form.Item>
            <Form.Item
              label='Họ người dùng:'
              validateStatus={errors.lastname ? 'error' : ''}
              help={errors.lastname?.message}
              className='flex-1'
            >
              <Controller
                name='lastname'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder='Nhập họ...'
                  />
                )}
              />
            </Form.Item>
          </div>
          <Form.Item
            label='Email:'
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='Nhập email...'
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label='Mật khẩu:'
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder='Nhập mật khẩu...'
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
              className='w-full font-bold'
            >
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Model>
      {contextHolder}
    </section>
  );
};

export default Customers;
