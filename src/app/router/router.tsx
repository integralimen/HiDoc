import { createBrowserRouter, Navigate } from 'react-router'

import { DoctorsPage } from '../../pages/DoctorsPage/DoctorsPage'
import { DoctorPage } from '../../pages/DoctorPage/DoctorPage'
import { AppointmentsPage } from '../../pages/AppointmentsPage/AppointmentsPage'
import { ProfilePage } from '../../pages/ProfilePage/ProfilePage'
import { LoginPage } from '../../pages/LoginPage/LoginPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/doctors" replace />,
  },
  {
    path: '/doctors',
    element: <DoctorsPage />,
  },
  {
    path: '/doctors/:doctorId',
    element: <DoctorPage />,
  },
  {
    path: '/appointments',
    element: <AppointmentsPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <h1>404 Not Found</h1>,
  },
])
