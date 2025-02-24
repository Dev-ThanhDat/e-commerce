const Categories = () => {
  return (
    <section className='grid grid-cols-1 p-[15px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 bg-white shadow-lg'>
      <div className='flex items-center gap-5 border-b border-r border-color-ededed p-[10px]'>
        <div className='shrink-0'>
          <h6 className='font-bold'>Máy ảnh</h6>
          <p>10 sản phẩm</p>
        </div>
        <img
          loading='lazy'
          src='/Images/camera.jpg'
          alt='Camera'
        />
      </div>
      <div className='flex items-center gap-5 border-b border-r border-color-ededed p-[10px]'>
        <div className='shrink-0'>
          <h6 className='font-bold'>TV</h6>
          <p>10 sản phẩm</p>
        </div>
        <img
          loading='lazy'
          src='/Images/tv.jpg'
          alt='TV'
        />
      </div>
      <div className='flex items-center gap-5 border-b border-r border-color-ededed p-[10px]'>
        <div className='shrink-0'>
          <h6 className='font-bold'>Tai nghe</h6>
          <p>10 sản phẩm</p>
        </div>
        <img
          loading='lazy'
          src='/Images/headphone.jpg'
          alt='TV'
        />
      </div>
    </section>
  );
};

export default Categories;
