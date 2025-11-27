import { NavLink, useNavigate } from 'react-router-dom'
import { Bars3Icon, ChartBarIcon, InformationCircleIcon, PhoneIcon, ClipboardDocumentListIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ collapsed, onClose }) {
  const linkClass = (isActive) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition-smooth ${
      isActive ? 'bg-[color:var(--card)] shadow' : 'hover:bg-opacity-10'
    }`

  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <aside className={`border-r p-4 ${collapsed ? 'w-20' : 'w-64'} transition-smooth flex flex-col`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-[color:var(--accent)] text-white rounded-md p-2">SW</div>
          {!collapsed && <div className="font-semibold">Smart Waste</div>}
        </div>
        <button onClick={onClose} aria-label="close sidebar" className="p-1">
          <Bars3Icon className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={({ isActive }) => linkClass(isActive)}>
          <ChartBarIcon className="w-5 h-5" />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => linkClass(isActive)}>
          <ClipboardDocumentListIcon className="w-5 h-5" />
          {!collapsed && <span>Reports</span>}
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => linkClass(isActive)}>
          <InformationCircleIcon className="w-5 h-5" />
          {!collapsed && <span>About</span>}
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => linkClass(isActive)}>
          <ChartBarIcon className="w-5 h-5" />
          {!collapsed && <span>Services</span>}
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => linkClass(isActive)}>
          <PhoneIcon className="w-5 h-5" />
          {!collapsed && <span>Contact</span>}
        </NavLink>
        {user?.role === 'EMPLOYEE' && (
          <NavLink to="/employee/route" className={({ isActive }) => linkClass(isActive)}>
            <ChartBarIcon className="w-5 h-5" />
            {!collapsed && <span>My Route</span>}
          </NavLink>
        )}
      </nav>

      <div className="mt-auto text-sm text-[color:var(--muted)] pt-6">
        {!collapsed && <div className="mb-3">{user ? `${user.name} — ${user.role}` : 'Not signed in'}</div>}
        {user ? (
          <button
            onClick={async () => {
              await logout()
              navigate('/login')
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-opacity-10"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            {!collapsed && <span>Sign out</span>}
          </button>
        ) : (
          <button onClick={() => navigate('/login')} className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-opacity-10">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            {!collapsed && <span>Sign in</span>}
          </button>
        )}

        {!collapsed && <div className="mt-3">© {new Date().getFullYear()} Smart Waste</div>}
      </div>
    </aside>
  )
}
