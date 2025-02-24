import { createBrands, deleteBrands, updateBrands } from '@/api/config';
import Model from '@/components/Model';
import { getBrands } from '@/redux/brand/brandAction';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, Input, message, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
const { Search } = Input;

const schema = yup.object().shape({
  title: yup.string().required('Vui lòng nhập tên thương hiệu')
});

const columns = [
  {
    title: 'STT',
    dataIndex: 'key',
    align: 'center'
  },
  {
    title: 'Tên thương hiệu',
    dataIndex: 'title',
    sorter: (a, b) => a.title.length - b.title.length,
    showSorterTooltip: false,
    align: 'center'
  },
  {
    title: 'Lựa chọn',
    dataIndex: 'action',
    align: 'center'
  }
];

const Brands = () => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: ''
    }
  });

  const dispatch = useDispatch();
  const { brands, total } = useSelector((state) => state.brand);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBrandId, setCurrentBrandId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    dispatch(
      getBrands({
        search: searchTerm
      })
    );
  }, [dispatch, searchTerm]);

  useEffect(() => {
    const filteredBrands = brands?.map((brand, index) => ({
      key: brands.length - index,
      title: brand.title,
      action: (
        <div className='flex items-center justify-center gap-5'>
          <button
            onClick={() => {
              setEditMode(true);
              setCurrentBrandId(brand._id);
              setValue('title', brand.title);
              setOpen(true);
            }}
            className='text-green-500'
          >
            <CiEdit size={20} />
          </button>
          <button
            onClick={() => handleDelete(brand._id)}
            className='text-red-500'
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      )
    }));
    setData(filteredBrands);
    setPagination((prev) => ({ ...prev, total }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brands, total]);

  const onSubmit = async (data) => {
    try {
      let response;
      if (editMode) {
        response = await updateBrands(currentBrandId, data.title);
      } else {
        response = await createBrands(data.title);
      }
      if (response.success) {
        messageApi.open({
          type: 'success',
          content: response.message
        });
        reset();
        setOpen(false);
        setEditMode(false);
        dispatch(getBrands());
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

  const handleDelete = (brandId) => {
    Modal.confirm({
      title: 'Xóa thương hiệu',
      content: 'Bạn có chắc chắn muốn xóa thương hiệu này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await deleteBrands(brandId);
          if (response.success) {
            messageApi.open({
              type: 'success',
              content: response.message
            });
            dispatch(getBrands());
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
        <h3 className='mb-3 text-xl font-bold '>Danh sách thương hiệu</h3>
        <div className='flex flex-col justify-between gap-5 mb-5 md:items-center md:flex-row'>
          <button
            onClick={() => {
              setOpen(true);
              setEditMode(false);
              reset();
            }}
            className='px-4 py-2 text-white transition-all rounded-md w-fit bg-color-febd69 hover:text-white hover:bg-opacity-85 shrink-0'
          >
            Thêm thương hiệu
          </button>
          <Search
            placeholder='Tìm kiếm thương hiệu...'
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
          {editMode ? 'Chỉnh sửa thương hiệu' : 'Tạo thương hiệu'}
        </h3>
        <Form
          onFinish={handleSubmit(onSubmit)}
          autoComplete='off'
          layout='vertical'
          className='mt-5'
        >
          <Form.Item
            label='Tên thương hiệu:'
            validateStatus={errors.title ? 'error' : ''}
            help={errors.title?.message}
          >
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='Nhập thương hiệu...'
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
              {editMode ? 'Cập nhật' : 'Tạo'}
            </Button>
          </Form.Item>
        </Form>
      </Model>
      {contextHolder}
    </section>
  );
};

export default Brands;
