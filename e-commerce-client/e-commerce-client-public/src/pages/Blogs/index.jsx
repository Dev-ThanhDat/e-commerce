import BlogCard from '@/components/BlogCard';
import BlogSidebar from '@/components/BlogSidebar';
import BreadCrumb from '@/components/BreadCrumb';
import Skeleton from '@/components/Skeleton';
import { getBlogs } from '@/redux/blog/blogAction';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Blogs = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { blogs, total, isLoading } = useSelector((state) => state.blog);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    document.title = 'Bài viết';
  }, []);

  useEffect(() => {
    dispatch(getBlogs({ page: currentPage, limit: blogsPerPage }));
  }, [dispatch, currentPage]);

  const handleSearch = (searchParams) => {
    dispatch(getBlogs({ ...searchParams, page: currentPage }));
  };

  const handlePageClick = ({ selected }) => setCurrentPage(selected + 1);

  const renderBlogCards = () => {
    return isLoading
      ? Array(4)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className='bg-white rounded-[10px] flex flex-col shadow-lg overflow-hidden'
            >
              <Skeleton
                circle
                width='100%'
                height='234px'
              />
              <div className='p-[15px] flex-1 flex flex-col gap-5'>
                <Skeleton
                  width='40%'
                  height='10px'
                />
                <Skeleton
                  width='100%'
                  height='20px'
                />
                <Skeleton
                  width='20%'
                  height='15px'
                />
              </div>
            </div>
          ))
      : blogs.map((item) => (
          <BlogCard
            key={item?._id}
            data={item}
          />
        ));
  };

  return (
    <>
      <BreadCrumb title='Bài viết' />
      <section className='w-full max-w-screen-xl mx-auto p-[15px]'>
        <BlogSidebar onSearch={handleSearch} />
        {blogs?.length ? (
          <>
            <div className='lg:pl-5 lg:ml-[300px] grid grid-cols-1 md:grid-cols-2 gap-5'>
              {renderBlogCards()}
            </div>
            <div className='lg:ml-[320px] mt-5 bg-white p-[15px] rounded-[10px] shadow-md'>
              <ReactPaginate
                breakLabel='...'
                nextLabel='>'
                onPageChange={handlePageClick}
                pageCount={Math.ceil(total / blogsPerPage)}
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
          <div className='lg:ml-[320px] flex items-start justify-center'>
            <img
              loading='lazy'
              src='/Images/blog-not-found.webp'
              alt='Product not found'
              className='w-[350px]'
            />
          </div>
        )}
      </section>
    </>
  );
};

export default Blogs;
