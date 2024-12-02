import Cookies from 'js-cookie'
import { Navigate,Outlet } from 'react-router-dom'


export const PublicRoutes = () => {

const isTokenPresent=Cookies.get('token')?true:false
return isTokenPresent?  <Navigate to='/home' replace />:<Outlet/> //make it landing page later
}