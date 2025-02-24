import { deleteProducts } from '@/api/config';
import { getProducts } from '@/redux/product/productAction';
import { Input, message, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
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
          alt='Product'
          className='object-cover w-24 rounded-md'
        />
      </div>
    )
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'title',
    showSorterTooltip: false,
    align: 'center'
  },
  {
    title: 'Thương hiệu',
    dataIndex: 'brand',
    showSorterTooltip: false,
    align: 'center'
  },
  {
    title: 'Loại',
    dataIndex: 'category',
    showSorterTooltip: false,
    align: 'center'
  },
  {
    title: 'Giá',
    dataIndex: 'price',
    showSorterTooltip: false,
    align: 'center'
  },
  {
    title: 'Lựa chọn',
    dataIndex: 'action',
    align: 'center'
  }
];

const Products = () => {
  const dispatch = useDispatch();
  const { products, total } = useSelector((state) => state.product);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    dispatch(
      getProducts({
        search: searchTerm
      })
    );
  }, [dispatch, searchTerm]);

  useEffect(() => {
    const filteredProducts = products?.map((product, index) => ({
      key: index + 1,
      image: product.images?.[0],
      title: product.title,
      brand: product.brand,
      category: product.category,
      price: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(product.price),
      action: (
        <div className='flex items-center justify-center gap-5'>
          <Link
            to={`/sua-san-pham/${product._id}`}
            className='text-green-500'
          >
            <CiEdit size={20} />
          </Link>
          <button
            onClick={() => handleDelete(product._id)}
            className='text-red-500'
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      )
    }));
    setData(filteredProducts);
    setPagination((prev) => ({ ...prev, total }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, total]);

  const handleDelete = (productId) => {
    Modal.confirm({
      title: 'Xóa sản phẩm',
      content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await deleteProducts(productId);
          if (response.success) {
            messageApi.open({
              type: 'success',
              content: response.message
            });
            dispatch(getProducts());
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
    setPagination((prev) => ({
      ...prev,
      current: pagination.current
    }));
    dispatch(
      getProducts({
        search: searchTerm,
        page: pagination.current
      })
    );
  };

  return (
    <section>
      <div>
        <h3 className='mb-3 text-xl font-bold'>Danh sách sản phẩm</h3>

        <div className='flex flex-col justify-between gap-5 mb-5 md:items-center md:flex-row'>
          <Link
            to='/them-san-pham'
            className='block px-4 py-2 mb-5 text-white transition-all rounded-md w-fit bg-color-febd69 hover:text-white hover:bg-opacity-85'
          >
            Thêm sản phẩm
          </Link>
          <Search
            placeholder='Tìm kiếm sản phẩm...'
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

      {contextHolder}
    </section>
  );
};

export default Products;
