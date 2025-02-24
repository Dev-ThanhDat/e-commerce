import BlogCard from '@/components/BlogCard';
import { getBlogs } from '@/redux/blog/blogAction';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import Skeleton from '@/components/Skeleton';

const News = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  return (
    <section className='py-20'>
      <h2 className='text-[26px] font-bold mb-[30px]'>Bài viết mới nhất.</h2>
      <Swiper
        grabCursor={'true'}
        spaceBetween={20}
        className='ecommerce-swiper'
        autoplay={{
          delay: 2000,
          disableOnInteraction: false
        }}
        slidesPerView='auto'
        navigation={true}
        modules={[Autoplay, Navigation]}
      >
        {!isLoading ? (
          blogs &&
          blogs.length > 0 &&
          blogs.map((item) => (
            <SwiperSlide key={item._id}>
              <BlogCard data={item} />
            </SwiperSlide>
          ))
        ) : (
          <>
            {Array(2)
              .fill(0)
              .map((item, index) => (
                <SwiperSlide key={index}>
                  <div className='p-[15px]  bg-white rounded-[10px] shadow-lg relative overflow-hidden'>
                    <Skeleton
                      circle={true}
                      width='100%'
                      height='352px'
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
                        width='20%'
                        height='15px'
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </>
        )}
      </Swiper>
    </section>
  );
};

export default News;
