import { addToWishlist } from '@/api/config';
import BreadCrumb from '@/components/BreadCrumb';
import ProductCard from '@/components/ProductCard';
import Skeleton from '@/components/Skeleton';
import StoreSidebar from '@/components/StoreSidebar';
import StoreSort from '@/components/StoreSort';
import { getProducts } from '@/redux/product/productAction';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Store = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [grid, setGrid] = useState(4);
  const { products, total, isLoading } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, currentPage]);

  useEffect(() => {
    document.title = 'Cửa hàng';
  }, []);

  useEffect(() => {
    dispatch(getProducts({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handleSearch = (searchParams) => {
    dispatch(getProducts({ ...searchParams, page: currentPage }));
  };

  const handleSetGrid = (value) => {
    setGrid(value);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };

  const addWishlist = async (productId) => {
    try {
      if (!user) {
        toast.error('Vui lòng đăng nhập!');
        return;
      }
      const response = await addToWishlist(productId);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  const renderProductCards = () => {
    if (isLoading) {
      return Array(8)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className='p-[15px] bg-white rounded-[10px] shadow-lg relative overflow-hidden'
          >
            <Skeleton
              circle={true}
              width='100%'
              height='240px'
            />
            <div className='flex flex-col gap-2 mt-3'>
              <Skeleton
                width='30%'
                height='10px'
              />
              <Skeleton
                width='100%'
                height='20px'
              />
              <Skeleton
                width='50%'
                height='15px'
              />
              <Skeleton
                width='80%'
                height='15px'
              />
            </div>
          </div>
        ));
    }

    return products.map((item) => (
      <ProductCard
        key={item._id}
        data={item}
        addToWishlist={addWishlist}
      />
    ));
  };

  return (
    <>
      <BreadCrumb title='Cửa hàng' />
      <section className='w-full relative min-h-[650px] max-w-screen-xl mx-auto p-[15px]'>
        <StoreSidebar onSearch={handleSearch} />
        <div className='flex flex-col gap-5 lg:pl-5 lg:ml-[300px]'>
          <StoreSort
            valueGrid={grid}
            onSetGrid={handleSetGrid}
            total={total}
          />
          {products?.length > 0 ? (
            <>
              <div
                className={`grid flex-1 gap-5 transition-all ${
                  grid === 4
                    ? 'lg:grid-cols-4 md:grid-cols-3 grid-cols-1'
                    : grid === 3
                    ? 'lg:grid-cols-3 md:grid-cols-3 grid-cols-1'
                    : ''
                }`}
              >
                {renderProductCards()}
              </div>
              <div className='bg-white p-[15px] rounded-[10px] shadow-md '>
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
            <div className='flex items-start justify-center'>
              <img
                src='/Images/product-not-found.jpeg'
                loading='lazy'
                alt='Product not found'
                className='w-[250px]'
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Store;
