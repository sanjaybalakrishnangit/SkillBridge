import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import {
  getWorkers,
  createWorker,
  updateWorker,
  deleteWorker,
  toggleVerification,
} from '../api/workers'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiShield,
  FiX,
  FiCheck,
  FiUsers,
  FiCheckCircle,
} from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'

const SKILLS = [
  'Plumber', 'Electrician', 'Painter', 'Carpenter', 'Driver',
  'Gardener', 'Mason', 'Welder', 'Cook', 'Security Guard', 'Cleaner', 'Other',
]

// ── Worker Add/Edit Modal ──────────────────────────────────────────────────────
const WorkerModal = ({ worker, onClose, onSuccess }) => {
  const isEdit = !!worker
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: isEdit
      ? {
          name: worker.name,
          skill: worker.skill,
          phone: worker.phone,
          location: worker.location,
          rating: worker.rating,
          experience: worker.experience,
          isAvailable: String(worker.isAvailable),
        }
      : { isAvailable: 'true', rating: 0 },
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('skill', data.skill)
      formData.append('phone', data.phone)
      formData.append('location', data.location)
      formData.append('isAvailable', data.isAvailable)
      formData.append('rating', data.rating || 0)
      formData.append('experience', data.experience || '')
      if (data.photo && data.photo[0]) {
        formData.append('photo', data.photo[0])
      }

      if (isEdit) {
        await updateWorker(worker._id, formData)
        toast.success('Worker updated successfully!')
      } else {
        await createWorker(formData)
        toast.success('Worker added successfully!')
      }
      onSuccess()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-slate-800">
            {isEdit ? 'Edit Worker' : 'Add New Worker'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="label" htmlFor="modal-name">Full Name *</label>
            <input
              id="modal-name"
              className={`input-field ${errors.name ? 'border-red-400' : ''}`}
              placeholder="Ramesh Kumar"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Skill + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="modal-skill">Skill *</label>
              <select
                id="modal-skill"
                className={`input-field ${errors.skill ? 'border-red-400' : ''}`}
                {...register('skill', { required: 'Skill is required' })}
              >
                <option value="">Select skill</option>
                {SKILLS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.skill && <p className="text-red-500 text-xs mt-1">{errors.skill.message}</p>}
            </div>

            <div>
              <label className="label" htmlFor="modal-phone">Phone *</label>
              <input
                id="modal-phone"
                type="tel"
                className={`input-field ${errors.phone ? 'border-red-400' : ''}`}
                placeholder="9876543210"
                {...register('phone', { required: 'Phone is required' })}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="label" htmlFor="modal-location">Location *</label>
            <input
              id="modal-location"
              className={`input-field ${errors.location ? 'border-red-400' : ''}`}
              placeholder="Area, City"
              {...register('location', { required: 'Location is required' })}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>

          {/* Rating + Availability */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="modal-rating">Rating (0–5)</label>
              <input
                id="modal-rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                className="input-field"
                {...register('rating', { min: 0, max: 5 })}
              />
            </div>

            <div>
              <label className="label" htmlFor="modal-availability">Availability</label>
              <select id="modal-availability" className="input-field" {...register('isAvailable')}>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="label" htmlFor="modal-experience">Experience</label>
            <input
              id="modal-experience"
              className="input-field"
              placeholder="e.g. 5 years of residential plumbing"
              {...register('experience')}
            />
          </div>

          {/* Photo */}
          <div>
            <label className="label" htmlFor="modal-photo">Photo (Optional)</label>
            <input
              id="modal-photo"
              type="file"
              accept="image/*"
              className="input-field text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0
                file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              {...register('photo')}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 gap-2">
              {loading ? (
                <>
                  <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-3.5 h-3.5" />
                  Saving...
                </>
              ) : isEdit ? (
                'Update Worker'
              ) : (
                'Add Worker'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Admin Dashboard ────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | { type: 'add' | 'edit', worker?: {} }
  const [search, setSearch] = useState('')
  const [verifyingId, setVerifyingId] = useState(null)
  const [activeTab, setActiveTab] = useState('all')

  const fetchWorkers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getWorkers({ all: true })
      setWorkers(res.data)
    } catch {
      toast.error('Failed to load workers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWorkers()
  }, [fetchWorkers])

  const handleDelete = async (worker) => {
    if (!window.confirm(`Delete "${worker.name}"? This cannot be undone.`)) return
    try {
      await deleteWorker(worker._id)
      toast.success(`${worker.name} deleted`)
      setWorkers((prev) => prev.filter((w) => w._id !== worker._id))
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleVerify = async (id) => {
    setVerifyingId(id)
    try {
      const res = await toggleVerification(id)
      toast.success(res.data.message)
      setWorkers((prev) =>
        prev.map((w) => (w._id === id ? { ...w, isVerified: res.data.isVerified } : w))
      )
    } catch {
      toast.error('Verification toggle failed')
    } finally {
      setVerifyingId(null)
    }
  }

  const filtered = workers.filter((w) => {
    if (activeTab === 'pending' && w.isVerified) return false;
    return (
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.skill.toLowerCase().includes(search.toLowerCase()) ||
      w.location.toLowerCase().includes(search.toLowerCase())
    );
  })

  const stats = [
    { label: 'Total Workers', value: workers.length, icon: FiUsers, color: 'bg-teal-50 text-teal-700 border-teal-200' },
    { label: 'Verified', value: workers.filter((w) => w.isVerified).length, icon: FiCheckCircle, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'Available', value: workers.filter((w) => w.isAvailable).length, icon: FiCheck, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Unverified', value: workers.filter((w) => !w.isVerified).length, icon: FiShield, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  ]

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FiShield className="text-teal-600" size={22} />
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          </div>
          <p className="text-slate-500 text-sm">Manage worker profiles and verification status</p>
        </div>
        <button
          id="add-worker-btn"
          onClick={() => setModal({ type: 'add' })}
          className="btn-primary self-start sm:self-auto text-sm gap-2"
        >
          <FiPlus size={17} />
          Add Worker
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`rounded-2xl p-4 border ${color}`}>
            <div className="flex items-center justify-between mb-2">
              <Icon size={18} className="opacity-60" />
            </div>
            <p className="text-3xl font-extrabold">{value}</p>
            <p className="text-xs font-medium mt-0.5 opacity-70">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-5">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-none px-6 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            All Workers
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 sm:flex-none px-6 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'pending' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Pending Approvals
            {workers.filter(w => !w.isVerified).length > 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
                {workers.filter(w => !w.isVerified).length}
              </span>
            )}
          </button>
        </div>

        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            id="worker-search"
            type="text"
            placeholder="Search by name, skill, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 h-full"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                  <th className="px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">
                    Worker
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">
                    Skill
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden md:table-cell">
                    Location
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide">
                    Verified
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wide text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-14 text-slate-400">
                      <div className="text-4xl mb-3">👷</div>
                      <p className="font-medium">No workers found</p>
                      {search && (
                        <p className="text-xs mt-1">
                          Try clearing your search or{' '}
                          <button
                            className="text-teal-600 hover:underline"
                            onClick={() => setSearch('')}
                          >
                            reset
                          </button>
                        </p>
                      )}
                    </td>
                  </tr>
                ) : (
                  filtered.map((worker) => (
                    <tr key={worker._id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Worker */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {worker.photo ? (
                            <img
                              src={worker.photo}
                              alt={worker.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-100"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-sm">
                              {worker.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-800 leading-tight">{worker.name}</p>
                            <p className="text-slate-400 text-xs">{worker.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Skill */}
                      <td className="px-5 py-3.5">
                        <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {worker.skill}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell text-sm">
                        {worker.location}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            worker.isAvailable
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {worker.isAvailable ? 'Available' : 'Busy'}
                        </span>
                      </td>

                      {/* Verification toggle */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleVerify(worker._id)}
                          disabled={verifyingId === worker._id}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50 ${
                            worker.isVerified
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-red-100 hover:text-red-600'
                              : 'bg-slate-100 text-slate-500 hover:bg-teal-100 hover:text-teal-700'
                          }`}
                          title={worker.isVerified ? 'Click to unverify' : 'Click to verify'}
                        >
                          {verifyingId === worker._id ? (
                            <span className="animate-spin border-2 border-current/30 border-t-current rounded-full w-3 h-3" />
                          ) : worker.isVerified ? (
                            <MdVerified size={13} />
                          ) : (
                            <FiCheck size={12} />
                          )}
                          {worker.isVerified ? 'Verified' : 'Verify'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setModal({ type: 'edit', worker })}
                            className="p-2 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-teal-600 transition-colors"
                            title="Edit worker"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(worker)}
                            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete worker"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50">
              <p className="text-xs text-slate-400">
                Showing <span className="font-semibold">{filtered.length}</span> of{' '}
                <span className="font-semibold">{workers.length}</span> workers
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <WorkerModal
          worker={modal.type === 'edit' ? modal.worker : null}
          onClose={() => setModal(null)}
          onSuccess={() => {
            setModal(null)
            fetchWorkers()
          }}
        />
      )}
    </main>
  )
}

export default AdminDashboard
