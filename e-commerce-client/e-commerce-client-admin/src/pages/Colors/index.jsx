import { createColors, deleteColors, updateColors } from '@/api/config';
import Model from '@/components/Model';
import { getColors } from '@/redux/color/colorAction';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, Input, message, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

const schema = yup.object().shape({
  title: yup.string().required('Vui lòng chọn màu')
});

const columns = [
  {
    title: 'STT',
    dataIndex: 'key',
    align: 'center'
  },
  {
    title: 'Mã màu',
    dataIndex: 'title',
    align: 'center',
    render: (title) => (
      <div
        style={{
          backgroundColor: `${title}`,
          width: '80%',
          height: '20px',
          display: 'inline-block',
          border: '1px solid #ededed',
          boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
        }}
      ></div>
    )
  },
  {
    title: 'Lựa chọn',
    dataIndex: 'action',
    align: 'center'
  }
];

const Colors = () => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: ''
    }
  });

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { colors, total } = useSelector((state) => state.color);
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentColorId, setCurrentColorId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0
  });
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    dispatch(getColors());
  }, [dispatch]);

  useEffect(() => {
    const filteredColors = colors?.map((color, index) => ({
      key: colors.length - index,
      title: color.title,
      action: (
        <div className='flex items-center justify-center gap-5'>
          <button
            onClick={() => {
              setEditMode(true);
              setCurrentColorId(color._id);
              setValue('title', color.title);
              setOpen(true);
            }}
            className='text-green-500'
          >
            <CiEdit size={20} />
          </button>
          <button
            onClick={() => handleDelete(color._id)}
            className='text-red-500'
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      )
    }));
    setData(filteredColors);
    setPagination((prev) => ({ ...prev, total }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors, total]);

  const onSubmit = async (data) => {
    try {
      let response;
      if (editMode) {
        response = await updateColors(currentColorId, data.title);
      } else {
        response = await createColors(data.title);
      }
      if (response.success) {
        messageApi.open({
          type: 'success',
          content: response.message
        });
        reset();
        setOpen(false);
        setEditMode(false);
        dispatch(getColors());
      } else {
        messageApi.open({
          type: 'error',
          content: response.message
        });
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  const handleDelete = (colorId) => {
    Modal.confirm({
      title: 'Xóa màu sắc',
      content: 'Bạn có chắc chắn muốn xóa màu sắc này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await deleteColors(colorId);
          if (response.success) {
            messageApi.open({
              type: 'success',
              content: response.message
            });
            dispatch(getColors());
          } else {
            messageApi.open({
              type: 'error',
              content: response.message
            });
          }
        } catch (error) {
          console.error('Lỗi khi xóa dữ liệu:', error);
        }
      }
    });
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  return (
    <section>
      <div>
        <h3 className='mb-3 text-xl font-bold '>Danh sách màu</h3>
        <div>
          <button
            onClick={() => {
              setOpen(true);
              setEditMode(false);
              reset();
            }}
            className='px-4 py-2 mb-5 text-white transition-all rounded-md w-fit bg-color-febd69 hover:text-white hover:bg-opacity-85'
          >
            Thêm màu sắc
          </button>
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>
      <Model
        open={open}
        onClose={() => setOpen(false)}
      >
        <h3 className='mb-5 text-xl font-bold text-center uppercase'>
          {editMode ? 'Chỉnh sửa màu sắc' : 'Tạo màu sắc'}
        </h3>
        <Form
          onFinish={handleSubmit(onSubmit)}
          autoComplete='off'
          layout='vertical'
          className='mt-5'
        >
          <Form.Item
            label='Màu sắc:'
            validateStatus={errors.title ? 'error' : ''}
            help={errors.title?.message}
          >
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <Input
                  type='color'
                  {...field}
                />
              )}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={isSubmitting}
              disabled={isSubmitting}
              className='w-full font-bold'
            >
              {editMode ? 'Cập nhật' : 'Tạo'}
            </Button>
          </Form.Item>
        </Form>
      </Model>
      {contextHolder}
    </section>
  );
};

export default Colors;
