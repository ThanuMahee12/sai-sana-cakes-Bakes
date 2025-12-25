import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import MainLayout from '@layout/MainLayout'

// Example route setup
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      // Add more routes here
      // {
      //   path: 'about',
      //   element: <About />,
      // },
    ],
  },
])
