import { BsBalloonHeart } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import ReactStars from 'react-stars';

const ProductCard = ({ data, addToWishlist = () => {} }) => {
  return (
    <article className='p-[15px] flex flex-col bg-white rounded-[10px] shadow-lg relative overflow-hidden group'>
      <Link to={`/san-pham/${data?._id}`}>
        <img
          src={data?.images[0]}
          loading='lazy'
          alt='Product image'
          className='block object-contain h-[240px] w-full'
        />
      </Link>
      <div className='flex flex-col h-full'>
        <h5 className='text-color-bf4800 text-[13px] font-semibold line-clamp-1'>
          {data?.category}
        </h5>
        <Link to={`/san-pham/${data?._id}`}>
          <h5 className='text-[15px] font-bold line-clamp-2 text-color-131921'>
            {data?.title}
          </h5>
        </Link>
        <div className='mt-auto'>
          <ReactStars
            count={5}
            size={20}
            value={+data?.totalRating}
            edit={false}
            half={false}
            color2='#ffd700'
          />
          <p className='font-medium text-color-1c1c1b line-clamp-1'>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(data?.price)}
          </p>
        </div>
      </div>
      <div className='absolute top-[5%] right-[-30px] flex flex-col gap-3 transition-all group-hover:right-[15px]'>
        <button
          onClick={() => addToWishlist(data?._id)}
          className='p-1 transition-all bg-transparent border border-transparent rounded-full hover:border-gray-500 hover:bg-white'
          aria-label='Thêm vào yêu thích'
        >
          <BsBalloonHeart size={20} />
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
