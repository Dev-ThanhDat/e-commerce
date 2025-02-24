import { getABlogs } from '@/api/config';
import BreadCrumb from '@/components/BreadCrumb';
import { useEffect, useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { Link, useLocation, useParams } from 'react-router-dom';

const DetailBlog = () => {
  const { pathname } = useLocation();
  const { blogId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    if (data) {
      document.title = data.title;
    }
  }, [data]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await getABlogs(blogId);
        if (response.success) {
          setData(response.blog);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Something went wrong!: ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <BreadCrumb title={data?.title || 'Tên bài viết'} />
      <section className='w-full relative max-w-screen-xl mx-auto p-[15px]'>
        <aside className='lg:absolute flex flex-col mb-5 lg:mb-0 gap-5 lg:max-w-[300px] w-full'>
          <div className='bg-white shadow-md rounded-[10px] flex flex-col gap-3 p-[15px]'>
            <img
              loading='lazy'
              src={data?.image}
              alt='Blog image'
              className='object-contain w-full'
            />
            <div>
              <h3 className='font-bold'>Danh mục:</h3>
              <p className='text-center text-color-777777'>{data?.category}</p>
            </div>
          </div>
        </aside>

        <div className='lg:pl-5  lg:ml-[300px]'>
          <Link
            to='/bai-viet'
            className='flex items-center gap-2 mb-5 transition-all text-color-777777 hover:opacity-80'
          >
            <IoIosArrowRoundBack size={25} />
            <span className='text-base font-semibold'>
              Quay trở lại bài viết
            </span>
          </Link>
          <div className='flex flex-col gap-10 p-5 bg-white rounded-md'>
            <h3 className='text-2xl font-extrabold text-color-1c1c1b'>
              {data?.title}
            </h3>
            <div dangerouslySetInnerHTML={{ __html: data?.description }} />
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailBlog;
