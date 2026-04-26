import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { register as registerUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiUser, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { MdHandshake } from 'react-icons/md'

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: 'user'
    }
  })
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...payload } = data
      const res = await registerUser(payload)
      const { token, ...userData } = res.data
      loginUser(userData, token)
      toast.success(`Welcome, ${userData.name}! 🎉`)
      if (userData.role === 'employee') {
        navigate('/create-profile', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-teal-600 text-white w-16 h-16 rounded-2xl mb-4 shadow-lg shadow-teal-200">
            <MdHandshake size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
          <p className="text-slate-500 mt-1 text-sm">Join Local Worker Connector today</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Role Selection */}
            <div>
              <label className="label">I am a</label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <label className={`border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${watch('role') === 'user' ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' : 'border-slate-200 hover:border-teal-200 bg-white'}`}>
                  <input type="radio" value="user" className="hidden" {...register('role')} />
                  <span className="font-semibold text-slate-800">User</span>
                  <span className="text-xs text-slate-500 text-center">Looking for service</span>
                </label>
                <label className={`border rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all ${watch('role') === 'employee' ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' : 'border-slate-200 hover:border-teal-200 bg-white'}`}>
                  <input type="radio" value="employee" className="hidden" {...register('role')} />
                  <span className="font-semibold text-slate-800">Employee</span>
                  <span className="text-xs text-slate-500 text-center">Daily wage worker</span>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="label" htmlFor="reg-name">
                Full Name
              </label>
              <div className="relative">
                <FiUser
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  id="reg-name"
                  className={`input-modern ${errors.name ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                  placeholder="Ravi Kumar"
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.name.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="label" htmlFor="reg-phone">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  id="reg-phone"
                  type="tel"
                  className={`input-modern ${errors.phone ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                  placeholder="9876543210"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[\d\s+\-().]{7,15}$/,
                      message: 'Enter a valid phone number',
                    },
                  })}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1.5 animate-fade-in">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label" htmlFor="reg-password">
                Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  id="reg-password"
                  type={showPwd ? 'text' : 'password'}
                  className={`input-modern ${errors.password ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                  placeholder="Min. 6 characters"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
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
                <p className="text-red-500 text-xs mt-1.5 animate-fade-in">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label" htmlFor="reg-confirm-password">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  id="reg-confirm-password"
                  type="password"
                  className={`input-modern ${errors.confirmPassword ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                  placeholder="Re-enter your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === watch('password') || 'Passwords do not match',
                  })}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              id="register-submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base gap-2 !mt-6"
            >
              {loading ? (
                <>
                  <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
