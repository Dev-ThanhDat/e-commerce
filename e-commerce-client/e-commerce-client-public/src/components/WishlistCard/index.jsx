import { IoMdClose } from 'react-icons/io';
import { Link } from 'react-router-dom';

const WishlistCard = ({ data, deleteToWishlist }) => {
  return (
    <>
      <article>
        <>
          <div className='relative bg-white h-[234px]'>
            <Link to={`/san-pham/${data?._id}`}>
              <img
                loading='lazy'
                src={data?.images[0]}
                alt='Image wishlist product'
                className='object-contain w-full h-full'
              />
            </Link>
            <span
              onClick={() => deleteToWishlist(data?._id)}
              className='absolute top-[5px] right-[5px] z-10 cursor-pointer hover:opacity-80 transition-all'
            >
              <IoMdClose size={25} />
            </span>
          </div>
        </>
        <div className='flex flex-col gap-3 px-2 py-2'>
          <Link to={`/san-pham/${data?._id}`}>
            <h5 className='text-[15px] font-bold line-clamp-1 text-color-131921'>
              {data?.title}
            </h5>
          </Link>
          <p className='font-medium text-color-1c1c1b line-clamp-1'>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(data?.price)}
          </p>
        </div>
      </article>
    </>
  );
};

export default WishlistCard;
