import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);

  return user ? (
    <Outlet />
  ) : (
    <Navigate
      to='/dang-nhap'
      replace
    />
  );
};

export default ProtectedRoute;
