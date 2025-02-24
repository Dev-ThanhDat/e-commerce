import { listBrands } from '@/utils/listBrands';
import Marquee from 'react-fast-marquee';

const Brands = () => {
  return (
    <section className='bg-white p-[15px]'>
      <Marquee
        autoFill
        gradient
      >
        {listBrands &&
          listBrands.length > 0 &&
          listBrands.map((item) => (
            <div
              key={item.id}
              className='w-[100px] mx-4'
            >
              <img
                loading='lazy'
                src={item.src}
                alt='Brand'
                className='object-cover w-full h-full'
              />
            </div>
          ))}
      </Marquee>
    </section>
  );
};

export default Brands;
