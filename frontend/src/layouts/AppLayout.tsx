import NavMenu from '@/components/NavMenu'
import { useAuth } from '@/hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { Link, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function AppLayout() {
  const { data, isError, isLoading } = useAuth()

  if (isLoading) return 'Loading...'
  if (isError) {
    return <Navigate to='/auth/login' />
  }

  if (data) return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className='bg-cyan-600 flex flex-row justify-between rounded-lg shadow-lg p-[2rem] mx-[10%] mt-[2rem]'>
        <Link to={'/'}>
          <p className='text-4xl text-white'>Task Manager</p>
        </Link>
        <div>
          <NavMenu name={data.name} />
        </div>
      </header>

      {/* Main content */}
      <div className='mx-[12%] p-[2rem] bg-white rounded-lg shadow-lg mt-[4rem]'>
        <Outlet />
      </div>

      {/* Spacer that pushes the footer down if content is short */}
      <div className="flex-1" />

      {/* Footer */}
      <div className='bg-cyan-600 p-[1rem] mx-[10%] rounded-t-lg mt-[4rem]'>
        <footer className='bg-cyan-500 p-[2rem] rounded-lg'>
          <p className='text-white'>
            Copyright {new Date().getFullYear()} © - All rights reserved.
          </p>
        </footer>
      </div>

      {/* Toast container */}
      <ToastContainer
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
    </div>
  )
}