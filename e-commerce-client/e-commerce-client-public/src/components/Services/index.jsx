const Services = () => {
  return (
    <section className='grid grid-cols-1 gap-5 py-20 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
      <div className='flex items-center gap-[10px]'>
        <img
          loading='lazy'
          src='/Images/service.png'
          alt='Service image'
        />
        <div>
          <h6 className='font-bold'>Miễn phí vận chuyển</h6>
          <p>Từ đơn hàng trên 500.00đ</p>
        </div>
      </div>
      <div className='flex items-center gap-[10px]'>
        <img
          loading='lazy'
          src='/Images/service-02.png'
          alt='Service image'
        />
        <div>
          <h6 className='font-bold'>Ưu đãi bất ngờ hàng ngày</h6>
          <p>Tiết kiệm tới 25%</p>
        </div>
      </div>
      <div className='flex items-center gap-[10px]'>
        <img
          loading='lazy'
          src='/Images/service-03.png'
          alt='Service image'
        />
        <div>
          <h6 className='font-bold'>Hỗ trợ 24/7</h6>
          <p>Mua sắm cùng chuyên gia</p>
        </div>
      </div>
      <div className='flex items-center gap-[10px]'>
        <img
          loading='lazy'
          src='/Images/service-04.png'
          alt='Service image'
        />
        <div>
          <h6 className='font-bold'>Giá cả phải chăng</h6>
          <p>Nhận giá trực tiếp tại xưởng</p>
        </div>
      </div>
      <div className='flex items-center gap-[10px]'>
        <img
          loading='lazy'
          src='/Images/service-05.png'
          alt='Service image'
        />
        <div>
          <h6 className='font-bold'>Thanh toán an toàn</h6>
          <p>Thanh toán bảo vệ 100%</p>
        </div>
      </div>
    </section>
  );
};

export default Services;
