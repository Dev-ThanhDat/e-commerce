import {
  createBCategorys,
  deleteBCategorys,
  updateBCategorys
} from '@/api/config';
import Model from '@/components/Model';
import { getBCategories } from '@/redux/blogCategories/blogCategoriesAction';
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

const CategoriesBlogs = () => {
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
  const [open, setOpen] = useState(false);
  const { bCategories, total } = useSelector((state) => state.bCategory);
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    dispatch(
      getBCategories({
        search: searchTerm
      })
    );
  }, [dispatch, searchTerm]);

  useEffect(() => {
    const filteredCategory = bCategories?.map((category, index) => ({
      key: bCategories.length - index,
      title: category.title,
      action: (
        <div className='flex items-center justify-center gap-5'>
          <button
            onClick={() => {
              setEditMode(true);
              setCurrentCategoryId(category._id);
              setValue('title', category.title);
              setOpen(true);
            }}
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
    }));
    setData(filteredCategory);
    setPagination((prev) => ({ ...prev, total }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bCategories, total]);

  const onSubmit = async (data) => {
    try {
      let response;
      if (editMode) {
        response = await updateBCategorys(currentCategoryId, data.title);
      } else {
        response = await createBCategorys(data.title);
      }
      if (response.success) {
        messageApi.open({
          type: 'success',
          content: response.message
        });
        reset();
        setOpen(false);
        setEditMode(false);
        dispatch(getBCategories());
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

  const handleDelete = (categoryId) => {
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
            messageApi.open({
              type: 'success',
              content: response.message
            });
            dispatch(getBCategories());
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
        <h3 className='mb-3 text-xl font-bold '>Danh mục bài viết</h3>
        <div className='flex flex-col justify-between gap-5 mb-5 md:items-center md:flex-row'>
          <button
            onClick={() => {
              setOpen(true);
              setEditMode(false);
              reset();
            }}
            className='px-4 py-2 text-white transition-all rounded-md w-fit bg-color-febd69 hover:text-white hover:bg-opacity-85 shrink-0'
          >
            Thêm danh mục
          </button>
          <Search
            placeholder='Tìm kiếm danh mục...'
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
          {editMode ? 'Chỉnh sửa danh mục' : 'Tạo danh mục'}
        </h3>
        <Form
          onFinish={handleSubmit(onSubmit)}
          autoComplete='off'
          layout='vertical'
          className='mt-5'
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
