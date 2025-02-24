import Blogs from '@/pages/Blogs/index.jsx';
import Carts from '@/pages/Carts/index.jsx';
import CheckOut from '@/pages/CheckOut/index.jsx';
import DetailBlog from '@/pages/DetailBlog/index.jsx';
import DetailProduct from '@/pages/DetailProduct/index.jsx';
import Home from '@/pages/Home/index.jsx';
import Login from '@/pages/Login/index.jsx';
import MyOrder from '@/pages/MyOrder/index.jsx';
import NotFound from '@/pages/NotFound/index.jsx';
import Register from '@/pages/Register/index.jsx';
import ResetPassword from '@/pages/ResetPassword/index.jsx';
import Store from '@/pages/Store/index.jsx';
import Wishlist from '@/pages/Wishlist/index.jsx';
import { persistor, store } from '@/redux/store';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'tippy.js/dist/tippy.css';
import App from './App.jsx';
import './index.scss';
import ProtectedRoute from '@/components/ProtectedRoute/index.jsx';
import Account from '@/pages/Account/index.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/yeu-thich',
        element: (
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        )
      },
      {
        path: '/gio-hang',
        element: (
          <ProtectedRoute>
            <Carts />
          </ProtectedRoute>
        )
      },
      {
        path: '/cua-hang',
        element: <Store />
      },
      {
        path: '/bai-viet',
        element: <Blogs />
      },
      {
        path: '/bai-viet/:blogId',
        element: <DetailBlog />
      },
      {
        path: '/san-pham/:productId',
        element: <DetailProduct />
      },
      {
        path: '/don-hang',
        element: (
          <ProtectedRoute>
            <MyOrder />
          </ProtectedRoute>
        )
      },
      {
        path: '/thanh-toan',
        element: (
          <ProtectedRoute>
            <CheckOut />
          </ProtectedRoute>
        )
      },
      {
        path: '/dang-nhap',
        element: <Login />
      },
      {
        path: '/dang-ky',
        element: <Register />
      },
      {
        path: '/tai-khoan',
        element: (
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        )
      },
      {
        path: '/dat-lai-mat-khau',
        element: (
          <ProtectedRoute>
            <ResetPassword />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <RouterProvider router={router} />
        <ToastContainer
          position='top-right'
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme='light'
          transition:Bounce
        />
      </PersistGate>
    </Provider>
  </StrictMode>
);
