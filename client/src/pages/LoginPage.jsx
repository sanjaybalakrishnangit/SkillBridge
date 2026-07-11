import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { MdHandshake } from 'react-icons/md'

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await login(data)
      const { token, ...userData } = res.data
      loginUser(userData, token)
      toast.success(`Welcome back, ${userData.name}!`)
      navigate(
        userData.role === 'admin' ? '/admin' :
        userData.role === 'employee' ? '/my-profile' :
        '/',
        { replace: true }
      )
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-[#0F172A] text-white w-16 h-16 rounded-2xl mb-4 shadow-lg shadow-slate-900/10">
            <MdHandshake size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500 mt-1 text-sm">Sign in to your account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Phone */}
            <div>
              <label className="label" htmlFor="login-phone">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  id="login-phone"
                  type="tel"
                  className={`input-field pl-10 ${errors.phone ? 'border-red-400 ring-1 ring-red-300' : ''}`}
                  placeholder="9876543210"
                  {...register('phone', { required: 'Phone number is required' })}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1.5">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-400 ring-1 ring-red-300' : ''}`}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-[#D97706] font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <p className="text-xs text-amber-700 font-medium">
            🔑 Admin demo: phone <code className="bg-amber-100 px-1 py-0.5 rounded">9999999999</code>{' '}
            · password <code className="bg-amber-100 px-1 py-0.5 rounded">admin123</code>
            <br />
            <span className="text-amber-500">(after running <code>npm run seed</code> in server/)</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
