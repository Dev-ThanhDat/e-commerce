import {
  createPCategorys,
  deletePCategorys,
  updatePCategorys
} from '@/api/config';
import Model from '@/components/Model';
import { getPCategories } from '@/redux/productCategories/productCategoriesAction';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, Input, message, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const { Search } = Input;

const schema = yup.object({
  title: yup.string().required('Vui lòng nhập danh mục')
});

const columns = [
  {
    title: 'STT',
    dataIndex: 'key',
    align: 'center'
  },
  {
    title: 'Tên danh mục',
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

const CategoriesProducts = () => {
  const dispatch = useDispatch();
  const { pCategories, total } = useSelector((state) => state.pCategory);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0
  });
  const [messageApi, contextHolder] = message.useMessage();

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: '' }
  });

  useEffect(() => {
    dispatch(getPCategories({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  useEffect(() => {
    const formatted = pCategories?.map((item, index) => ({
      key: index + 1,
      title: item.title,
      action: (
        <div className='flex items-center justify-center gap-5'>
          <button
            onClick={() => handleEdit(item)}
            className='text-green-500'
          >
            <CiEdit size={20} />
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            className='text-red-500'
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      )
    }));
    setData(formatted);
    setPagination((prev) => ({ ...prev, total }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pCategories, total]);

  const handleEdit = (item) => {
    setEditMode(true);
    setCurrentId(item._id);
    setValue('title', item.title);
    setOpen(true);
  };

  const handleAdd = () => {
    reset();
    setEditMode(false);
    setCurrentId(null);
    setOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xóa danh mục',
      content: 'Bạn có chắc chắn muốn xóa danh mục này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const res = await deletePCategorys(id);
          if (res.success) {
            messageApi.success(res.message);
            dispatch(getPCategories());
          } else {
            messageApi.error(res.message);
          }
        } catch (err) {
          console.error('Lỗi khi xóa:', err);
        }
      }
    });
  };

  const onSubmit = async ({ title }) => {
    try {
      const res = editMode
        ? await updatePCategorys(currentId, title)
        : await createPCategorys(title);

      if (res.success) {
        messageApi.success(res.message);
        reset();
        setOpen(false);
        setEditMode(false);
        dispatch(getPCategories());
      } else {
        messageApi.error(res.message);
      }
    } catch (err) {
      console.error('Lỗi khi gửi dữ liệu:', err);
    }
  };

  return (
    <section>
      <h3 className='mb-3 text-xl font-bold'>Danh mục sản phẩm</h3>

      <div className='flex flex-col justify-between gap-5 mb-5 md:items-center md:flex-row'>
        <button
          onClick={handleAdd}
          className='px-4 py-2 text-white transition-all rounded-md w-fit bg-color-febd69 hover:text-white hover:bg-opacity-85 shrink-0'
        >
          Thêm danh mục
        </button>
        <Search
          placeholder='Tìm kiếm danh mục...'
          className='max-w-[350px] w-full shrink-0'
          enterButton
          allowClear
          onSearch={(value) => {
            setSearchTerm(value);
            setPagination((prev) => ({ ...prev, current: 1 }));
          }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onChange={setPagination}
        scroll={{ x: 'max-content' }}
      />

      <Model
        open={open}
        onClose={() => setOpen(false)}
      >
        <h3 className='mb-5 text-xl font-bold text-center uppercase'>
          {editMode ? 'Chỉnh sửa danh mục' : 'Tạo danh mục'}
        </h3>
        <Form
          layout='vertical'
          onFinish={handleSubmit(onSubmit)}
          autoComplete='off'
        >
          <Form.Item
            label='Tên danh mục:'
            validateStatus={errors.title ? 'error' : ''}
            help={errors.title?.message}
          >
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder='Nhập danh mục...'
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

export default CategoriesProducts;
