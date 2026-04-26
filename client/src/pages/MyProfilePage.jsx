import { useState, useEffect } from 'react'
import { getMyProfile, updateWorker } from '../api/workers'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiMapPin, FiPhone, FiStar, FiClock, FiBriefcase, FiAlertCircle, FiEdit2, FiX } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const SKILLS = [
  'Plumber', 'Electrician', 'Painter', 'Carpenter', 'Driver',
  'Gardener', 'Mason', 'Welder', 'Cook', 'Security Guard', 'Cleaner', 'Other',
]

const SKILL_COLORS = {
  plumber: 'bg-blue-100 text-blue-700',
  electrician: 'bg-yellow-100 text-yellow-700',
  painter: 'bg-purple-100 text-purple-700',
  carpenter: 'bg-orange-100 text-orange-700',
  driver: 'bg-green-100 text-green-700',
  gardener: 'bg-emerald-100 text-emerald-700',
  mason: 'bg-stone-100 text-stone-700',
  welder: 'bg-red-100 text-red-700',
  cook: 'bg-pink-100 text-pink-700',
}

const getSkillColor = (skill) => SKILL_COLORS[skill?.toLowerCase()] || 'bg-teal-100 text-teal-700'

const MyProfilePage = () => {
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const fetchProfile = () => {
    setLoading(true)
    getMyProfile()
      .then((res) => {
        setWorker(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) return <LoadingSpinner fullPage />

  if (!worker) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20 text-center animate-fade-in">
        <FiAlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Profile Found</h2>
        <p className="text-slate-500 mb-6">You haven't created your worker profile yet.</p>
        <a href="/create-profile" className="btn-primary inline-flex px-6 py-3">
          Create Profile Now
        </a>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {!worker.isVerified && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6 flex items-center gap-3">
          <FiAlertCircle className="flex-shrink-0" size={20} />
          <p className="font-medium text-sm">
            Your profile is currently <strong className="font-bold">Pending Verification</strong>. It will be visible to users once an admin approves it.
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-6 sm:p-10 border-b border-teal-100">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              {worker.photo ? (
                <img
                  src={worker.photo}
                  alt={worker.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center text-white font-bold text-5xl shadow-lg border-4 border-white">
                  {worker.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-3xl font-bold text-slate-800">{worker.name}</h1>
                {worker.isVerified && (
                  <div className="flex items-center gap-1 text-teal-600 bg-teal-50 px-2 py-1 rounded-full text-sm font-semibold mx-auto sm:mx-0">
                    <MdVerified size={18} />
                    <span>Verified</span>
                  </div>
                )}
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getSkillColor(worker.skill)}`}>
                {worker.skill}
              </span>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-slate-600">
                <div className="flex items-center gap-1.5">
                  <FiMapPin className="text-teal-500" />
                  <span>{worker.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiPhone className="text-teal-500" />
                  <span>{worker.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiStar className="text-amber-400" />
                  <span className="font-semibold">{worker.rating > 0 ? worker.rating.toFixed(1) : 'New'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiClock className={worker.isAvailable ? 'text-emerald-500' : 'text-rose-500'} />
                  <span className="font-semibold text-sm">
                    {worker.isAvailable ? 'Available Now' : 'Busy'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="absolute top-6 right-6 sm:static sm:mt-0">
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary text-sm gap-2"
              >
                <FiEdit2 size={14} />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FiBriefcase className="text-teal-600" />
            Experience & Details
          </h2>
          
          {worker.experience ? (
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-6 rounded-xl border border-slate-100">
              {worker.experience}
            </p>
          ) : (
            <div className="text-slate-400 italic bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
              No detailed experience provided.
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <EditProfileModal
          worker={worker}
          onClose={() => setIsEditing(false)}
          onSuccess={() => {
            setIsEditing(false)
            fetchProfile()
          }}
        />
      )}
    </main>
  )
}

const EditProfileModal = ({ worker, onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: worker.name,
      skill: worker.skill,
      location: worker.location,
      phone: worker.phone,
      experience: worker.experience,
      isAvailable: String(worker.isAvailable)
    }
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('skill', data.skill)
      formData.append('location', data.location)
      formData.append('phone', data.phone)
      formData.append('experience', data.experience)
      formData.append('isAvailable', data.isAvailable)
      if (data.photo && data.photo[0]) {
        formData.append('photo', data.photo[0])
      }

      await updateWorker(worker._id, formData)
      toast.success('Profile updated successfully!')
      onSuccess()
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-slate-800">Edit Profile</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input-field" {...register('name', { required: true })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Skill</label>
              <select className="input-field" {...register('skill', { required: true })}>
                {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" className="input-field" {...register('phone', { required: true })} />
            </div>
          </div>

          <div>
            <label className="label">Location</label>
            <input className="input-field" {...register('location', { required: true })} />
          </div>

          <div>
            <label className="label">Availability Status</label>
            <select className="input-field" {...register('isAvailable')}>
              <option value="true">Available Now</option>
              <option value="false">Busy / Not Available</option>
            </select>
          </div>

          <div>
            <label className="label">Experience / Timings</label>
            <textarea className="input-field min-h-[80px]" placeholder="e.g. 5 years exp. Available 9AM to 6PM" {...register('experience')} />
          </div>

          <div>
            <label className="label">Update Photo</label>
            <input type="file" accept="image/*" className="input-field text-sm" {...register('photo')} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MyProfilePage
