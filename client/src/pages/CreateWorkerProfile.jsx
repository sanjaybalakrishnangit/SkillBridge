import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { createWorker } from '../api/workers'
import toast from 'react-hot-toast'
import { FiUser, FiMapPin, FiPhone, FiImage, FiFileText } from 'react-icons/fi'

const SKILLS = [
  'Plumber', 'Electrician', 'Painter', 'Carpenter',
  'Driver', 'Gardener', 'Mason', 'Welder', 'Cook',
]

const CreateWorkerProfile = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) setPreviewUrl(URL.createObjectURL(file))
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('skill', data.skill)
      formData.append('location', data.location)
      formData.append('phone', data.phone)
      formData.append('experience', data.experience)
      if (data.photo?.[0]) formData.append('photo', data.photo[0])

      await createWorker(formData)
      toast.success('Profile created successfully! Pending admin verification.')
      navigate('/my-profile')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Create Your Worker Profile</h1>
        <p className="text-slate-500 mt-2">Fill in your details to start getting hired</p>
      </div>

      <div className="card p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="label">Full Name *</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input-modern pl-10"
                  placeholder="e.g. Mukesh Kumar"
                  {...register('name', { required: 'Name is required' })}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Primary Skill *</label>
              <select
                className="input-modern"
                {...register('skill', { required: 'Skill is required' })}
              >
                <option value="">Select your skill</option>
                {SKILLS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.skill && <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.skill.message}</p>}
            </div>

            <div>
              <label className="label">Location *</label>
              <div className="relative">
                <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input-modern pl-10"
                  placeholder="e.g. Andheri, Mumbai"
                  {...register('location', { required: 'Location is required' })}
                />
              </div>
              {errors.location && <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.location.message}</p>}
            </div>

            <div>
              <label className="label">Contact Phone *</label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  className="input-modern pl-10"
                  placeholder="e.g. 9876543210"
                  {...register('phone', { 
                    required: 'Phone is required',
                    pattern: { value: /^[0-9+\-\s()]{7,15}$/, message: 'Invalid phone format' }
                  })}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1 animate-fade-in">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Experience details</label>
            <div className="relative">
              <FiFileText className="absolute left-3.5 top-3.5 text-slate-400" />
              <textarea
                className="input-modern pl-10 pt-3 min-h-[100px]"
                placeholder="e.g. 5 years of experience in residential plumbing..."
                {...register('experience')}
              />
            </div>
          </div>

          <div>
            <label className="label">Profile Photo (Optional)</label>
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-dashed border-slate-300">
                  <FiImage size={24} />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  className="hidden"
                  {...register('photo', { onChange: handleImageChange })}
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-block px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200"
                >
                  Choose File
                </label>
                <p className="text-xs text-slate-400 mt-2">JPG, PNG, WEBP up to 5MB</p>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-6">
            {loading ? 'Submitting...' : 'Submit Profile'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default CreateWorkerProfile
