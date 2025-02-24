import { ratingProduct } from '@/api/config';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import ReactStars from 'react-stars';
import { toast } from 'react-toastify';
import * as yup from 'yup';

const schema = yup.object({
  rating: yup
    .number()
    .required('Vui lòng! Chọn sao.')
    .min(1, 'Vui lòng! Chọn ít nhất 1 sao.'),
  review: yup
    .string()
    .required('Vui lòng! Nhập nội dung đánh giá.')
    .min(10, 'Nội dung đánh giá cần ít nhất 10 ký tự.')
});

const ReviewsProduct = ({ data, fetch = () => {} }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const { user } = useSelector((state) => state.auth);

  const onSubmit = async (value) => {
    try {
      const response = await ratingProduct(
        data?._id,
        value.rating,
        value.review
      );
      if (response.success) {
        toast.success(response.message);
        fetch(data?._id);
        reset();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  const hasRated = data?.ratings.some(
    (rating) => rating?.postedby?._id === user?._id
  );

  return (
    <div className='py-5'>
      <h4 className='text-[26px] font-bold mb-[10px]'>Đánh giá:</h4>
      <div className='p-5 bg-white rounded-lg shadow-lg'>
        <div className='flex items-center justify-between gap-5 pb-5 mb-5 border-b'>
          <div>
            <h4 className='text-[15px] font-semibold mb-1'>
              Đánh giá của khách hàng
            </h4>
            <div className='flex items-center gap-2'>
              <ReactStars
                count={5}
                size={15}
                value={data?.totalRating}
                edit={false}
                activeColor='#ffd700'
              />
              <p className='text-xs'>
                Đựa trên {data?.ratings.length} đánh giá
              </p>
            </div>
          </div>
        </div>

        {!hasRated && (
          <div className='pb-5 border-b'>
            <h4 className='text-[15px] font-semibold mb-1'>Viết đánh giá</h4>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-2'
            >
              <div>
                <Controller
                  name='rating'
                  control={control}
                  defaultValue={0}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactStars
                        count={5}
                        size={25}
                        half={false}
                        color2='#ffd700'
                        edit={hasRated ? false : true}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      {fieldState.error && (
                        <p className='text-xs text-red-500'>
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <textarea
                  {...register('review')}
                  placeholder='Viết đánh giá...'
                  className='w-full p-2 border rounded-lg outline-none min-h-[150px] max-h-[450px]'
                ></textarea>
                {errors.review && (
                  <p className='text-xs text-red-500'>
                    {errors.review.message}
                  </p>
                )}
              </div>
              <div className='flex justify-end'>
                <button
                  disabled={isSubmitting}
                  className={`text-white rounded-full md:max-w-[100px] flex items-center justify-center w-full transition-all font-semibold bg-color-232f3e hover:bg-opacity-80 py-[8px] px-[15px] ${
                    isSubmitting && 'pointer-events-none opacity-80'
                  }`}
                >
                  {isSubmitting ? (
                    <div className='w-[20px] h-[20px] border-2 border-white rounded-full animate-spin border-t-transparent'></div>
                  ) : (
                    'Gửi'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {data?.ratings.length > 0 && (
          <div className='py-5 max-h-[500px] h-full  overflow-hidden overflow-y-auto'>
            {data?.ratings?.map((item) => (
              <div
                key={item?._id}
                className='[&:not(:last-child)]:mb-5'
              >
                <div className='flex items-center gap-3'>
                  <h4 className='font-bold '>{`${item?.postedby?.firstname} ${item?.postedby?.lastname}`}</h4>
                  <ReactStars
                    count={5}
                    size={15}
                    value={item?.star}
                    edit={false}
                    activeColor='#ffd700'
                  />
                </div>
                <p className='mt-1'>{item?.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsProduct;
