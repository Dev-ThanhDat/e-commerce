/* eslint-disable react-refresh/only-export-components */
import ProtectedRoute from '@/components/ProtectedRoute/index.jsx';
import { persistor, store } from '@/redux/store';
import { lazy, StrictMode, Suspense } from 'react';
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

const Account = lazy(() => import('@/pages/Account/index.jsx'));
const Blogs = lazy(() => import('@/pages/Blogs/index.jsx'));
const Carts = lazy(() => import('@/pages/Carts/index.jsx'));
const CheckOut = lazy(() => import('@/pages/CheckOut/index.jsx'));
const DetailBlog = lazy(() => import('@/pages/DetailBlog/index.jsx'));
const DetailProduct = lazy(() => import('@/pages/DetailProduct/index.jsx'));
const Home = lazy(() => import('@/pages/Home/index.jsx'));
const Login = lazy(() => import('@/pages/Login/index.jsx'));
const MyOrder = lazy(() => import('@/pages/MyOrder/index.jsx'));
const NotFound = lazy(() => import('@/pages/NotFound/index.jsx'));
const Register = lazy(() => import('@/pages/Register/index.jsx'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword/index.jsx'));
const Store = lazy(() => import('@/pages/Store/index.jsx'));
const Wishlist = lazy(() => import('@/pages/Wishlist/index.jsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: (
      <Suspense>
        <NotFound />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense>
            <Home />
          </Suspense>
        )
      },
      {
        path: '/yeu-thich',
        element: (
          <Suspense>
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: '/gio-hang',
        element: (
          <Suspense>
            <ProtectedRoute>
              <Carts />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: '/cua-hang',
        element: (
          <Suspense>
            <Store />
          </Suspense>
        )
      },
      {
        path: '/bai-viet',
        element: (
          <Suspense>
            <Blogs />
          </Suspense>
        )
      },
      {
        path: '/bai-viet/:blogId',
        element: (
          <Suspense>
            <DetailBlog />
          </Suspense>
        )
      },
      {
        path: '/san-pham/:productId',
        element: (
          <Suspense>
            <DetailProduct />
          </Suspense>
        )
      },
      {
        path: '/don-hang',
        element: (
          <Suspense>
            <ProtectedRoute>
              <MyOrder />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: '/thanh-toan',
        element: (
          <Suspense>
            <ProtectedRoute>
              <CheckOut />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: '/dang-nhap',
        element: (
          <Suspense>
            <Login />
          </Suspense>
        )
      },
      {
        path: '/dang-ky',
        element: (
          <Suspense>
            <Register />
          </Suspense>
        )
      },
      {
        path: '/tai-khoan',
        element: (
          <Suspense>
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: '/dat-lai-mat-khau',
        element: (
          <Suspense>
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          </Suspense>
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
          position='bottom-right'
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
