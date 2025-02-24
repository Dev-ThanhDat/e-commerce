import { logout } from '@/api/config';
import { isLoggedOut } from '@/redux/auth/authSlice';
import { MenuItemSider } from '@/utils/MenuItemSider';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, message, Result } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();

  const [openKeys, setOpenKeys] = useState(
    JSON.parse(localStorage.getItem('openKeys')) || []
  );

  useEffect(() => {
    localStorage.setItem('openKeys', JSON.stringify(openKeys));
  }, [openKeys]);

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.success) {
        await messageApi.open({
          type: 'success',
          content: response.message,
          duration: 0.5
        });
        dispatch(isLoggedOut());
        navigate('/dang-nhap');
      } else {
        messageApi.open({
          type: 'error',
          content: response?.message
        });
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
    }
  };

  return (
    <Layout>
      <Sider
        width={260}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <Link
          to={'/'}
          className='flex items-center justify-center w-full py-3'
        >
          <img
            loading='lazy'
            src='/logo.png'
            alt='Logo Website'
            className='object-cover w-[50px] h-auto'
          />
        </Link>
        <Menu
          theme='dark'
          mode='inline'
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          onClick={({ key }) => navigate(key)}
          items={MenuItemSider}
        />
      </Sider>
      <Layout>
        <Header className='flex items-center justify-between p-0 pr-5 bg-white'>
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: 20,
              width: 64,
              height: 64
            }}
          />

          {user?.role !== 'ADMIN' ? (
            <Button
              onClick={handleLogout}
              className='px-4 py-2 text-sm text-left text-gray-700 w-fit hover:bg-gray-100'
            >
              Đăng xuất
            </Button>
          ) : (
            <div className='relative flex items-center gap-3 group'>
              <div className='cursor-pointer'>
                <h5 className='mb-0 text-base font-semibold'>
                  {`${user?.firstname} ${user?.lastname}`}
                </h5>
                <p className='mb-0 text-sm text-gray-500'>{user?.email}</p>
              </div>

              <ul className='absolute right-0 z-50 invisible w-40 mt-2 overflow-auto transition-all duration-200 bg-white rounded-lg shadow-lg opacity-0 top-full group-hover:opacity-100 group-hover:visible'>
                <li>
                  <button
                    onClick={handleLogout}
                    className='block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100'
                  >
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}
        </Header>
        <Content className='p-[15px]'>
          {user?.role !== 'ADMIN' ? (
            <Result
              status='403'
              title='403'
              subTitle='Xin lỗi, bạn không được phép truy cập trang này.'
            />
          ) : (
            <Outlet />
          )}
        </Content>
      </Layout>

      {contextHolder}
    </Layout>
  );
};

export default MainLayout;
