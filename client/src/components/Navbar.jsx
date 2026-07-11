import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMenu, FiX, FiUser, FiLogOut, FiShield, FiBell } from 'react-icons/fi'
import { MdHandshake } from 'react-icons/md'
import { getMyNotifications, markNotificationAsRead } from '../api/notifications'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, logoutUser } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch notifications
  useEffect(() => {
    if (user) {
      getMyNotifications()
        .then(res => setNotifications(res.data))
        .catch(err => console.error(err))
    }
  }, [user])

  const handleLogout = () => {
    logoutUser()
    toast.success('Logged out successfully')
    navigate('/')
    setMenuOpen(false)
  }

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch (err) {
      console.error(err)
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-semibold transition-colors duration-300 group py-2 ${
      isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
    }`

  const underlineSpan = <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#D97706] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 border-b ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md border-slate-200/80 shadow-md py-1' 
        : 'bg-white/70 backdrop-blur-sm border-slate-200/40 py-2'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 flex flex-col justify-center items-center relative">
              {/* Bridge icon concept */}
              <div className="w-5 h-1 bg-white rounded-full mb-1"></div>
              <div className="w-5 flex justify-between">
                <div className="w-1.5 h-2.5 bg-white rounded-t-sm"></div>
                <div className="w-1.5 h-2.5 bg-white rounded-t-sm"></div>
              </div>
            </div>
            <div className="hidden sm:flex items-baseline gap-1">
              <span className="font-bold text-xl tracking-tight">
                <span className="text-[#0F172A]">Skill</span>
                <span className="text-[#D97706]">Bridge</span>
              </span>
            </div>
            <span className="sm:hidden font-bold text-[#0F172A] text-base">SB</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            <NavLink to="/" className={navLinkClass} end>Home {underlineSpan}</NavLink>
            
            <NavLink to="/jobs" className={navLinkClass}>Jobs {underlineSpan}</NavLink>
            
            {user?.role !== 'employee' && (
              <NavLink to="/post-job" className={navLinkClass}>Post a Job {underlineSpan}</NavLink>
            )}

            {user?.role === 'employee' && (
              <NavLink to="/my-profile" className={navLinkClass}>My Profile {underlineSpan}</NavLink>
            )}

            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkClass}>
                <span className="flex items-center gap-1">
                  <FiShield size={14} />
                  Admin
                </span>
                {underlineSpan}
              </NavLink>
            )}
          </div>

          {/* Desktop auth & Notifications */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-5">
                {/* Notification Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors focus:outline-none"
                  >
                    <FiBell size={20} className={unreadCount > 0 ? 'text-[#D97706]' : ''} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D97706] rounded-full border-2 border-white"></span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-800">Notifications</h3>
                        <span className="text-xs text-[#D97706] bg-[#D97706]/10 px-2 py-0.5 rounded-full">{unreadCount} unread</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-slate-500 text-sm">No notifications</div>
                        ) : (
                          notifications.map(n => (
                            <div key={n._id} className={`px-4 py-3 border-b border-slate-50 flex items-start gap-3 hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-amber-50/30' : ''}`}>
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? 'bg-[#D97706]' : 'bg-transparent'}`} />
                              <div className="flex-1">
                                <p className={`text-sm ${!n.isRead ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>{n.message}</p>
                                <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                              </div>
                              {!n.isRead && (
                                <button 
                                  onClick={() => handleMarkAsRead(n._id)}
                                  className="text-xs text-[#D97706] hover:text-[#b45309] font-medium flex-shrink-0"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-6 w-px bg-slate-200"></div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors font-medium"
                >
                  <FiLogOut size={15} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-[#D97706] transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg animate-fade-in">
          <div className="px-4 pt-3 pb-4 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-slate-900 text-white border-l-4 border-[#D97706]' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
              end
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
                to="/jobs"
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-slate-900 text-white border-l-4 border-[#D97706]' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Jobs
              </NavLink>
            {user?.role !== 'employee' && (
              <NavLink
                to="/post-job"
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-slate-900 text-white border-l-4 border-[#D97706]' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Post a Job
              </NavLink>
            )}
            
            {user?.role === 'employee' && (
              <NavLink
                to="/my-profile"
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-slate-900 text-white border-l-4 border-[#D97706]' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                My Profile
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-slate-900 text-white border-l-4 border-[#D97706]' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                Admin Dashboard
              </NavLink>
            )}

            <div className="pt-3 border-t border-slate-100 mt-2">
              {user ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 px-3">
                    Signed in as <span className="font-semibold text-slate-700">{user.name}</span>
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <FiLogOut size={14} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="btn-primary text-sm text-center"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
