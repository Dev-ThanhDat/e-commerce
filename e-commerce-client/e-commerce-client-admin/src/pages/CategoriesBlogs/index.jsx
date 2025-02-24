import {
  createBCategorys,
  deleteBCategorys,
  updateBCategorys
} from '@/api/config';
import Model from '@/components/Model';
import { getBCategories } from '@/redux/blogCategories/blogCategoriesAction';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, Input, message, Modal, Table } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const { Search } = Input;

const schema = yup.object().shape({
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
    sorter: (a, b) => a.title.localeCompare(b.title),
    showSorterTooltip: false,
    align: 'center'
  },
  {
    title: 'Lựa chọn',
    dataIndex: 'action',
    align: 'center'
  }
];

const CategoriesBlogs = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const { bCategories, total } = useSelector((state) => state.bCategory);

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

  const pagination = useMemo(
    () => ({
      current: 1,
      pageSize: 8,
      total: total || 0
    }),
    [total]
  );

  useEffect(() => {
    dispatch(getBCategories({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleEdit = (category) => {
    setEditMode(true);
    setCurrentCategoryId(category._id);
    setValue('title', category.title);
    setOpen(true);
  };

  const handleDelete = useCallback(
    (categoryId) => {
      Modal.confirm({
        title: 'Xóa danh mục',
        content: 'Bạn có chắc chắn muốn xóa danh mục này?',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: async () => {
          try {
            const response = await deleteBCategorys(categoryId);
            if (response.success) {
              messageApi.success(response.message);
              dispatch(getBCategories({ search: searchTerm }));
            } else {
              messageApi.error(response.message);
            }
          } catch (error) {
            console.error('Lỗi khi xóa:', error);
          }
        }
      });
    },
    [dispatch, messageApi, searchTerm]
  );

  const onSubmit = async ({ title }) => {
    try {
      const apiCall = editMode
        ? updateBCategorys(currentCategoryId, title)
        : createBCategorys(title);

      const response = await apiCall;
      if (response.success) {
        messageApi.success(response.message);
        dispatch(getBCategories({ search: searchTerm }));
        reset();
        setOpen(false);
        setEditMode(false);
      } else {
        messageApi.error(response.message);
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  const data = useMemo(
    () =>
      bCategories?.map((category, index) => ({
        key: index + 1,
        title: category.title,
        action: (
          <div className='flex items-center justify-center gap-5'>
            <button
              onClick={() => handleEdit(category)}
              className='text-green-500'
            >
              <CiEdit size={20} />
            </button>
            <button
              onClick={() => handleDelete(category._id)}
              className='text-red-500'
            >
              <MdDeleteOutline size={20} />
            </button>
          </div>
        )
      })) || [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bCategories, handleDelete]
  );

  return (
    <section>
      <h3 className='mb-3 text-xl font-bold'>Danh mục bài viết</h3>
      <div className='flex flex-col justify-between gap-5 mb-5 md:items-center md:flex-row'>
        <button
          onClick={() => {
            setOpen(true);
            setEditMode(false);
            reset();
          }}
          className='px-4 py-2 text-white transition-all rounded-md w-fit bg-color-febd69 hover:bg-opacity-85'
        >
          Thêm danh mục
        </button>
        <Search
          placeholder='Tìm kiếm danh mục...'
          className='max-w-[350px] w-full'
          enterButton
          allowClear
          onSearch={setSearchTerm}
        />
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
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
          onFinish={handleSubmit(onSubmit)}
          autoComplete='off'
          layout='vertical'
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

export default CategoriesBlogs;
