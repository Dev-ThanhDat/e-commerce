import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/pages/NotFound';
import { lazy, Suspense } from 'react';
import 'react-quill/dist/quill.snow.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const MainLayout = lazy(() => import('@/components/MainLayout'));
const Customers = lazy(() => import('@/pages/Customers'));
const Products = lazy(() => import('@/pages/Products'));
const AddProduct = lazy(() => import('@/pages/AddProduct'));
const UpdateProduct = lazy(() => import('@/pages/UpdateProduct'));
const Brands = lazy(() => import('@/pages/Brands'));
const CategoriesProducts = lazy(() => import('@/pages/CategoriesProducts'));
const Colors = lazy(() => import('@/pages/Colors'));
const Orders = lazy(() => import('@/pages/Orders'));
const Coupons = lazy(() => import('@/pages/Coupons'));
const Blogs = lazy(() => import('@/pages/Blogs'));
const AddBlog = lazy(() => import('@/pages/AddBlog'));
const UpdateBlog = lazy(() => import('@/pages/UpdateBlog'));
const CategoriesBlogs = lazy(() => import('@/pages/CategoriesBlogs'));
const Login = lazy(() => import('@/pages/Login'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: (
          <Suspense>
            <MainLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense>
                <Customers />
              </Suspense>
            )
          },
          {
            path: '/san-pham',
            element: (
              <Suspense>
                <Products />
              </Suspense>
            )
          },
          {
            path: '/them-san-pham',
            element: (
              <Suspense>
                <AddProduct />
              </Suspense>
            )
          },
          {
            path: '/sua-san-pham/:productId',
            element: (
              <Suspense>
                <UpdateProduct />
              </Suspense>
            )
          },
          {
            path: '/thuong-hieu',
            element: (
              <Suspense>
                <Brands />
              </Suspense>
            )
          },
          {
            path: '/danh-muc-san-pham',
            element: (
              <Suspense>
                <CategoriesProducts />
              </Suspense>
            )
          },
          {
            path: '/mau-sac',
            element: (
              <Suspense>
                <Colors />
              </Suspense>
            )
          },
          {
            path: '/don-dat-hang',
            element: (
              <Suspense>
                <Orders />
              </Suspense>
            )
          },
          {
            path: '/phieu-giam-gia',
            element: (
              <Suspense>
                <Coupons />
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
            path: '/them-bai-viet',
            element: (
              <Suspense>
                <AddBlog />
              </Suspense>
            )
          },
          {
            path: '/sua-bai-viet/:blogId',
            element: (
              <Suspense>
                <UpdateBlog />
              </Suspense>
            )
          },
          {
            path: '/danh-muc-bai-viet',
            element: (
              <Suspense>
                <CategoriesBlogs />
              </Suspense>
            )
          }
        ]
      }
    ]
  },
  {
    path: '/dang-nhap',
    element: (
      <Suspense>
        <Login />
      </Suspense>
    )
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
