import { Outlet } from 'react-router-dom'
import { Navbar } from '../sections/Navbar'

/**
 * Shell for public marketing routes. Swap or nest layouts for app/dashboard later.
 */
export function MainLayout() {
  return (
    <div className="relative min-h-dvh bg-transparent">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default MainLayout
