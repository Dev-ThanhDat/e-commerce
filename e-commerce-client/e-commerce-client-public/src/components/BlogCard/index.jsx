import { Link } from 'react-router-dom';

const BlogCard = ({ data }) => {
  return (
    <article className='bg-white rounded-[10px] flex flex-col shadow-lg overflow-hidden'>
      <div className='rounded-tr-[10px] max-h-[346px] h-full rounded-tl-[10px]'>
        <img
          src={data?.image}
          loading='lazy'
          alt='Blog'
          className='block object-contain w-full h-full'
        />
      </div>
      <div className='p-[15px] flex-1 flex flex-col gap-5'>
        <div className='flex flex-col gap-2'>
          <p className='text-[13px] uppercase font-normal line-clamp-1 text-color-777777'>
            {new Date(data?.createdAt).toLocaleDateString('vi-VN')}
          </p>
          <h3 className='text-lg font-bold text-color-131921 line-clamp-1'>
            {data?.title}
          </h3>
          <p className='text-[13px] text-color-777777'>{data?.category}</p>
        </div>
        <Link
          to={`/bai-viet/${data?._id}`}
          className='mt-auto px-5 hover:bg-opacity-90 transition-all py-[10px] bg-color-232f3e w-fit text-white font-semibold rounded-full'
        >
          Xem chi tiết
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
