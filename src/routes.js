import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import AddRole from './pages/roleManager/AddRole';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';
import RoleEdit from './pages/roleManager/roleEdit';
// import EditRole from './pages/roleManager/EditRole';
import RoleManager from './pages/roleManager/RoleManager';
import SliderManager from './pages/sliderManager/sliderManager';
import AddSlider from './pages/sliderManager/AddSlider';
import EditSlider from './pages/sliderManager/EditSlider';
import AddCategory from './pages/categoryManager/AddCategory';
//import EditCategory from './pages/categoryManager/EditCategory';
import CategoryEdit from './pages/categoryManager/CategoryEdit';
import CategoryManager from './pages/categoryManager/categoryManager';
import { element } from 'prop-types';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'roleManager', element: <RoleManager /> },
        { path: 'addRole', element: <AddRole /> },
        // { path: 'editRole', element: <EditRole /> },
        { path: 'roleEdit', element: <RoleEdit /> },
        { path: 'sliderManager', element: <SliderManager /> },
        { path: 'addSlider', element: <AddSlider /> },
        { path: 'editSlider', element: <EditSlider /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
        { path: 'addCategory', element: <AddCategory /> },
        //{ path: 'editCategory', element: <EditCategory /> },
        { path: 'categoryEdit', element: <CategoryEdit /> },
        { path: 'categoryManager', element: <CategoryManager /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
