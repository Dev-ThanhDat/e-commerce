import { deleteBlogs } from '@/api/config';
import { getBlogs } from '@/redux/blog/blogAction';
import { Input, message, Modal, Table } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const { Search } = Input;

const columns = [
  {
    title: 'STT',
    dataIndex: 'key',
    align: 'center'
  },
  {
    title: 'Hình ảnh',
    dataIndex: 'image',
    align: 'center',
    render: (image) => (
      <div className='flex items-center justify-center'>
        <img
          loading='lazy'
          src={image}
          alt='Blog'
          className='object-cover rounded-md w-28'
        />
      </div>
    )
  },
  {
    title: 'Tên bài viết',
    dataIndex: 'title',
    sorter: (a, b) => a.title.length - b.title.length,
    showSorterTooltip: false,
    align: 'center'
  },
  {
    title: 'Loại',
    dataIndex: 'category',
    sorter: (a, b) => a.category.length - b.category.length,
    showSorterTooltip: false,
    align: 'center'
  },
  {
    title: 'Lựa chọn',
    dataIndex: 'action',
    align: 'center'
  }
];

const Blogs = () => {
  const dispatch = useDispatch();
  const { blogs, total } = useSelector((state) => state.blog);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    dispatch(getBlogs({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  useEffect(() => {
    if (!blogs) return;

    const formattedBlogs = blogs.map((blog, index) => ({
      key: index + 1,
      title: blog.title,
      image: blog.image,
      category: blog.category,
      action: (
        <div className='flex items-center justify-center gap-5'>
          <Link
            to={`/sua-bai-viet/${blog._id}`}
            className='text-green-500'
          >
            <CiEdit size={20} />
          </Link>
          <button
            onClick={() => handleDelete(blog._id)}
            className='text-red-500'
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      )
    }));

    setData(formattedBlogs);
    setPagination((prev) => ({ ...prev, total }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogs, total]);

  const handleDelete = useCallback(
    (blogId) => {
      Modal.confirm({
        title: 'Xóa bài viết',
        content: 'Bạn có chắc chắn muốn xóa bài viết này?',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: async () => {
          try {
            const response = await deleteBlogs(blogId);
            messageApi.open({
              type: response.success ? 'success' : 'error',
              content: response.message
            });
            dispatch(getBlogs({ search: searchTerm }));
          } catch (error) {
            console.error('Lỗi khi xóa dữ liệu:', error);
          }
        }
      });
    },
    [dispatch, messageApi, searchTerm]
  );

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (pagination) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current
    }));
    dispatch(
      getBlogs({
        search: searchTerm,
        page: pagination.current
      })
    );
  };

  return (
    <section>
      <div>
        <h3 className='mb-3 text-xl font-bold'>Danh sách bài viết</h3>

        <div className='flex flex-col justify-between gap-5 mb-5 md:items-center md:flex-row'>
          <Link
            to='/them-bai-viet'
            className='block px-4 py-2 mb-5 text-white transition-all rounded-md w-fit bg-color-febd69 hover:text-white hover:bg-opacity-85'
          >
            Thêm bài viết
          </Link>
          <Search
            placeholder='Tìm kiếm bài viết...'
            className='max-w-[350px] w-full shrink-0'
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
      {contextHolder}
    </section>
  );
};

export default Blogs;
