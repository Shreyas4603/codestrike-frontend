import Cookies from 'js-cookie'
import { Navigate,Outlet } from 'react-router-dom'


export const PrivateRoutes = () => {
const isTokenPresent=Cookies.get('token')?true:false
return isTokenPresent? <Outlet/> :<Navigate to='/' replace />//make it landing page later
}