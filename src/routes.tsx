import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminManage from './pages/AdminManage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />
  },
  {
    name: 'AdminLogin',
    path: '/admin/login',
    element: <AdminLogin />
  },
  {
    name: 'AdminManage',
    path: '/admin',
    element: <AdminManage />
  }
];

export default routes;
