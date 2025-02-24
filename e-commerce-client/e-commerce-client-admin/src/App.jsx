import MainLayout from '@/components/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import AddBlog from '@/pages/AddBlog';
import AddProduct from '@/pages/AddProduct';
import Blogs from '@/pages/Blogs';
import Brands from '@/pages/Brands';
import CategoriesBlogs from '@/pages/CategoriesBlogs';
import CategoriesProducts from '@/pages/CategoriesProducts';
import Colors from '@/pages/Colors';
import Coupons from '@/pages/Coupons';
import Customers from '@/pages/Customers';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Orders from '@/pages/Orders';
import Products from '@/pages/Products';
import UpdateBlog from '@/pages/UpdateBlog';
import UpdateProduct from '@/pages/UpdateProduct';
import 'react-quill/dist/quill.snow.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <MainLayout />,

        children: [
          {
            index: true,
            element: <Customers />
          },
          {
            path: '/san-pham',
            element: <Products />
          },
          {
            path: '/them-san-pham',
            element: <AddProduct />
          },
          {
            path: '/sua-san-pham/:productId',
            element: <UpdateProduct />
          },
          {
            path: '/thuong-hieu',
            element: <Brands />
          },
          {
            path: '/danh-muc-san-pham',
            element: <CategoriesProducts />
          },
          {
            path: '/mau-sac',
            element: <Colors />
          },
          {
            path: '/don-dat-hang',
            element: <Orders />
          },
          {
            path: '/phieu-giam-gia',
            element: <Coupons />
          },
          {
            path: '/bai-viet',
            element: <Blogs />
          },
          {
            path: '/them-bai-viet',
            element: <AddBlog />
          },
          {
            path: '/sua-bai-viet/:blogId',
            element: <UpdateBlog />
          },
          {
            path: '/danh-muc-bai-viet',
            element: <CategoriesBlogs />
          }
        ]
      }
    ]
  },
  {
    path: '/dang-nhap',
    element: <Login />
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
