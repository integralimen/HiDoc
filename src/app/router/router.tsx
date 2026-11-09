import { createBrowserRouter, Navigate } from 'react-router'

import { AppLayout } from '../layout/AppLayout'
import { DoctorsPage } from '../../pages/DoctorsPage/DoctorsPage'
import { DoctorPage } from '../../pages/DoctorPage/DoctorPage'
import { AppointmentsPage } from '../../pages/AppointmentsPage/AppointmentsPage'
import { ProfilePage } from '../../pages/ProfilePage/ProfilePage'
import { LoginPage } from '../../pages/LoginPage/LoginPage'
import { ProtectedRoute } from './ProtectedRoute'
import { RegisterPage } from '../../pages/RegisterPage/RegisterPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <Navigate to="/doctors" replace /> },
      { path: '/doctors', element: <DoctorsPage /> },
      { path: '/doctors/:doctorId', element: <DoctorPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/appointments', element: <AppointmentsPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '*', element: <h1>404 Not Found</h1> },
    ],
  },
])
