import BreadCrumb from '@/components/BreadCrumb';
import ColorItem from '@/components/ColorItem';
import DropdownCategory from '@/components/DropdownCategory';
import { getAllOrders } from '@/redux/order/orderAction';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const MyOrder = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { orders, total } = useSelector((state) => state.order);

  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, currentPage]);

  useEffect(() => {
    dispatch(getAllOrders({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handleSearch = () => {
    dispatch(
      getAllOrders({
        orderId,
        status,
        page: currentPage
      })
    );
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  return (
    <>
      <BreadCrumb title='Đơn hàng' />
      <section className='w-full relative min-h-[650px] max-w-screen-xl mx-auto p-[15px]'>
        <aside className='lg:absolute flex flex-col mb-5 lg:mb-0 gap-5 lg:max-w-[300px] w-full'>
          <div className='bg-white flex-1 shadow-md rounded-[10px] flex flex-col gap-3 p-[15px]'>
            <div className='flex flex-col'>
              <h5 className='font-semibold capitalize text-color-1c1c1b mb-[5px]'>
                Tìm kiếm:
              </h5>
              <input
                type='text'
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder='Tìm kiếm tên sản phẩm...'
                className='w-full px-2 py-1 border outline-none'
              />
            </div>
            <div>
              <h5 className='font-semibold capitalize text-color-1c1c1b mb-[5px]'>
                Lọc danh mục:
              </h5>
              <DropdownCategory
                options={[
                  { value: 'Chưa được xử lý', label: 'Chưa được xử lý' },
                  { value: 'Đang xử lý', label: 'Đang xử lý' },
                  { value: 'Đã xử lý', label: 'Đã xử lý' },
                  { value: 'Đã giao hàng', label: 'Đã giao hàng' }
                ]}
                onChange={(selectedOption) => setStatus(selectedOption.value)}
              />
            </div>
            <button
              onClick={handleSearch}
              className='w-full p-2 mt-3 text-white transition-all rounded-md hover:opacity-85 bg-color-febd69'
            >
              Tìm kiếm
            </button>
          </div>
        </aside>
        <div className='flex flex-col gap-5 lg:pl-5 lg:ml-[300px]'>
          {orders?.length > 0 ? (
            <>
              <div className='grid flex-1 grid-cols-1 gap-5'>
                {orders.map(
                  ({
                    _id,
                    amount,
                    orderStatus,
                    createdAt,
                    infor,
                    products
                  }) => (
                    <article
                      key={_id}
                      className='p-[15px] flex flex-col gap-5 bg-white rounded-[10px] shadow-lg overflow-hidden'
                    >
                      <div className='flex flex-col flex-1 gap-2 shrink-0'>
                        <h3 className='flex items-center gap-1 text-lg font-bold'>
                          <span className='shrink-0'>Mã đơn hàng:</span>
                          <span className='text-color-777777'>{_id}</span>
                        </h3>
                        <p className='flex items-center gap-1 font-bold'>
                          <span className='shrink-0'>Tổng tiền:</span>
                          <span className='text-red-500'>
                            {currencyFormatter.format(amount)}
                          </span>
                        </p>
                        <p className='flex items-center gap-1 font-bold'>
                          <span className='shrink-0'>Trạng thái:</span>
                          <span className='text-color-777777'>
                            {orderStatus}
                          </span>
                        </p>
                        <p className='flex items-center gap-1 font-bold'>
                          <span className='shrink-0'>Ngày đặt hàng:</span>
                          <span className='text-color-777777'>
                            {new Date(createdAt).toLocaleDateString('vi-VI')}
                          </span>
                        </p>
                      </div>
                      <div className='flex flex-col flex-1 gap-2 shrink-0'>
                        <h3 className='w-full p-1 text-xl font-bold text-center uppercase border-b'>
                          Địa chỉ
                        </h3>
                        <p className='text-center text-color-febd69'>{`${infor?.firstname} ${infor?.lastname}`}</p>
                        <p className='flex items-center gap-1 font-bold'>
                          <span className='shrink-0'>Số điện thoại:</span>
                          <span className='text-color-777777'>
                            {infor?.phone}
                          </span>
                        </p>
                        <p className='flex items-center gap-1 font-bold'>
                          <span className='shrink-0'>Địa chỉ:</span>
                          <span className='text-color-777777'>
                            {infor?.address}
                          </span>
                        </p>
                        <p className='flex items-center gap-1 font-bold'>
                          <span className='shrink-0'>Thành phố:</span>
                          <span className='text-color-777777'>
                            {infor?.city}
                          </span>
                        </p>
                      </div>
                      <div className='max-h-[300px] overflow-hidden overflow-y-auto p-5 flex flex-col gap-5'>
                        {products?.map(({ product, quantity, color }) => (
                          <div
                            key={product?._id}
                            className='flex flex-col items-center gap-5 p-2 border rounded-md md:flex-row'
                          >
                            <Link
                              to={`/san-pham/${product?._id}`}
                              className='w-2/4 md:w-[15%] border shrink-0 rounded-md overflow-hidden'
                            >
                              <img
                                loading='lazy'
                                src={product?.images[0]}
                                alt=''
                                className='object-cover w-full h-full'
                              />
                            </Link>
                            <div className='text-base'>
                              <p className='flex items-center gap-1 line-clamp-1'>
                                <strong>Tên sản phẩm:</strong>
                                <Link
                                  to={`/san-pham/${product?._id}`}
                                  className='text-color-777777'
                                >
                                  {product?.title}
                                </Link>
                              </p>
                              <p className='flex items-center gap-1 line-clamp-1'>
                                <strong>Số lượng:</strong>
                                <span className='text-color-777777'>
                                  {quantity}
                                </span>
                              </p>
                              <p className='flex items-center gap-1 line-clamp-1'>
                                <strong>Màu sắc:</strong>
                                <ColorItem color={color} />
                              </p>
                              <p className='flex items-center gap-1 line-clamp-1'>
                                <strong>Giá:</strong>
                                <span className='text-red-500'>
                                  {currencyFormatter.format(
                                    product?.price * quantity
                                  )}
                                </span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  )
                )}
              </div>
              <div className='bg-white p-[15px] rounded-[10px] shadow-md'>
                <ReactPaginate
                  breakLabel='...'
                  nextLabel='>'
                  onPageChange={handlePageClick}
                  pageCount={Math.ceil(total / productsPerPage)}
                  previousLabel='<'
                  renderOnZeroPageCount={null}
                  pageClassName='page-item'
                  pageLinkClassName='page-link'
                  previousClassName='page-item'
                  previousLinkClassName='page-link'
                  nextClassName='page-item'
                  nextLinkClassName='page-link'
                  breakClassName='page-item'
                  breakLinkClassName='page-link'
                  containerClassName='pagination'
                  activeClassName='active'
                />
              </div>
            </>
          ) : (
            <div className='flex justify-center'>
              <p className='text-lg font-medium text-center'>
                Không có đơn hàng nào
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MyOrder;
