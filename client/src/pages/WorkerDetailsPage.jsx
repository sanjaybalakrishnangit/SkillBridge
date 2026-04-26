import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWorkerById } from '../api/workers'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiMapPin, FiPhone, FiStar, FiArrowLeft, FiClock, FiBriefcase } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import toast from 'react-hot-toast'

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

const WorkerDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWorkerById(id)
      .then((res) => {
        setWorker(res.data)
      })
      .catch((err) => {
        console.error(err)
        toast.error('Failed to load worker details')
        navigate('/')
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) return <LoadingSpinner fullPage />
  if (!worker) return null

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors mb-8 font-medium"
      >
        <FiArrowLeft size={18} />
        Back to Workers
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-6 sm:p-10 border-b border-teal-100">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
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
              {worker.isAvailable && (
                <span className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-sm" title="Available" />
              )}
            </div>

            {/* Info */}
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

            {/* Action */}
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
              <a
                href={`tel:${worker.phone}`}
                className="btn-primary w-full sm:w-auto text-lg py-3 px-8 gap-2 shadow-teal-500/30"
              >
                <FiPhone size={20} />
                Call Now
              </a>
            </div>
          </div>
        </div>

        {/* Details Section */}
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
    </main>
  )
}

export default WorkerDetailsPage
