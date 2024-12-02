import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoutes = ({ children, isLoggedIn }) => {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoutes;
