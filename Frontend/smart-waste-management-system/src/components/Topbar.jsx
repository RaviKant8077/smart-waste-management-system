import { SunIcon, MoonIcon, Bars3Icon } from '@heroicons/react/24/outline'

export default function Topbar({ onToggleSidebar, theme, setTheme }) {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bars3Icon className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="toggle theme"
        >
          {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
        </button>
      </div>
    </header>
  )
}
