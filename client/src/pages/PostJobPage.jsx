import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { createJob } from '../api/jobs'
import toast from 'react-hot-toast'
import { FiBriefcase, FiUpload, FiCheckCircle, FiMapPin, FiPhone, FiClock, FiAlignLeft } from 'react-icons/fi'

const PAYMENT_OPTIONS = [
  { value: 'money', label: '💵 Money', desc: 'Cash payment' },
  { value: 'food',  label: '🍱 Food',  desc: 'Meals provided' },
  { value: 'both',  label: '💵🍱 Both', desc: 'Cash + meals' },
]

const SKILLS = [
  'Plumber', 'Electrician', 'Painter', 'Carpenter',
  'Driver', 'Gardener', 'Mason', 'Welder', 'Cook',
]

const PostJobPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('skill', data.skill)
      formData.append('location', data.location)
      formData.append('workingHours', data.workingHours)
      formData.append('paymentType', data.paymentType)
      formData.append('phone', data.phone)
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0])
      }

      await createJob(formData)
      toast.success('Job posted successfully!')
      setSuccess(true)
      setTimeout(() => navigate('/jobs'), 2500)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be under 5 MB')
        return
      }
      setImagePreview(URL.createObjectURL(file))
    }
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 px-4">
        <div className="bg-emerald-100 p-6 rounded-full shadow-lg">
          <FiCheckCircle className="text-[#22C55E]" size={52} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Job Posted!</h2>
        <p className="text-slate-500 text-sm">Redirecting you to the jobs board...</p>
        <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#D97706] rounded-full animate-[progress_2.5s_linear_forwards]" />
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FiBriefcase className="text-[#0F172A]" size={22} />
          <h1 className="text-2xl font-bold text-slate-800">Post a Job</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Describe your requirement and connect with the right worker
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Job Title */}
          <div>
            <label className="label" htmlFor="job-title">
              Job Title <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                id="job-title"
                className={`input-modern ${errors.title ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                placeholder="e.g. Need a plumber for pipe repair"
                {...register('title', { required: 'Job title is required' })}
              />
            </div>
            {errors.title && <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label" htmlFor="job-description">
              Description <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <FiAlignLeft className="absolute left-3 top-3.5 text-slate-400" size={15} />
              <textarea
                id="job-description"
                rows={4}
                className={`input-modern ${errors.description ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                placeholder="Describe the work in detail — what needs to be done, any specific requirements..."
                {...register('description', {
                  required: 'Description is required',
                  minLength: { value: 20, message: 'Minimum 20 characters required' },
                })}
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.description.message}</p>
            )}
          </div>

          {/* Skill */}
          <div>
            <label className="label" htmlFor="job-skill">
              Required Skill <span className="text-red-400">*</span>
            </label>
            <select
              id="job-skill"
              className={`input-modern ${errors.skill ? 'border-red-400 ring-1 ring-red-400' : ''}`}
              {...register('skill', { required: 'Skill is required' })}
            >
              <option value="">Select the skill needed</option>
              {SKILLS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.skill && (
              <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.skill.message}</p>
            )}
          </div>

          {/* Location + Working Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="job-location">
                Location <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  id="job-location"
                  className={`input-modern ${errors.location ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                  placeholder="e.g. Andheri, Mumbai"
                  {...register('location', { required: 'Location is required' })}
                />
              </div>
              {errors.location && (
                <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="job-hours">
                Working Hours <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  id="job-hours"
                  className={`input-modern ${errors.workingHours ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                  placeholder="e.g. 9 AM – 5 PM"
                  {...register('workingHours', { required: 'Working hours required' })}
                />
              </div>
              {errors.workingHours && <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.workingHours.message}</p>}
            </div>
          </div>

          {/* Payment Type */}
          <div>
            <label className="label">
              Payment Type <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_OPTIONS.map(({ value, label, desc }) => (
                <label key={value} className="relative cursor-pointer">
                  <input
                    type="radio"
                    value={value}
                    className="peer sr-only"
                    {...register('paymentType', { required: 'Please select a payment type' })}
                  />
                  <div
                    className="input-modern text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 border-2 border-slate-200
                      peer-checked:border-[#0F172A] peer-checked:bg-slate-50 peer-checked:text-[#0F172A]
                      hover:border-slate-300 transition-all duration-200 text-slate-500"
                  >
                    <span className="font-semibold text-sm">{label}</span>
                    <span className="text-xs mt-0.5 opacity-70">{desc}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.paymentType && (
              <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.paymentType.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="label" htmlFor="job-phone">
              Contact Phone <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                id="job-phone"
                type="tel"
                className={`input-modern ${errors.phone ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                placeholder="e.g. 9876543210"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: { value: /^[\d\s+\-().]{7,15}$/, message: 'Enter a valid phone number' },
                })}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.phone.message}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="label">Image (Optional)</label>
            <label
              htmlFor="job-image"
              className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-slate-200
                rounded-xl cursor-pointer hover:border-[#D97706] hover:bg-slate-50 transition-all duration-200"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <FiUpload className="text-slate-500" size={20} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-600">Click to upload an image</p>
                <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5 MB</p>
              </div>
              <input
                id="job-image"
                type="file"
                accept="image/*"
                className="sr-only"
                {...register('image')}
                onChange={handleImageChange}
              />
            </label>

            {imagePreview && (
              <div className="relative mt-3 group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null)
                    reset({ image: null })
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-base gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" />
                Posting...
              </>
            ) : (
              'Post Job'
            )}
          </button>
        </form>
      </div>
    </main>
  )
}

export default PostJobPage
