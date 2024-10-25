import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button' // Adjust this import path as needed

const Sidebar: React.FC = () => {
  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link to="#" className="flex items-center gap-2 font-semibold">
            <span className="">Dhan Rashi</span>
            <button></button>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <NavLink to="/dashboard" icon="HomeIcon">
              Dashboard
            </NavLink>
            <NavLink to="#" icon="BarChartIcon">
              Reports
            </NavLink>
            <NavLink to="/transaction" icon="DollarSignIcon">
              Transactions
            </NavLink>

            <NavLink to="#" icon="SettingsIcon">
              Settings
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  )
}

interface NavLinkProps {
  to: string
  icon: string
  children: React.ReactNode
  active?: boolean
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, children, active }) => {
  const baseClasses =
    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all'
  const activeClasses =
    'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
  const inactiveClasses =
    'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'

  return (
    <Link
      to={to}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    >
      {children}
    </Link>
  )
}

export default Sidebar
