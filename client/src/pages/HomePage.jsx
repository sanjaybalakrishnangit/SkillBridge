import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getWorkers } from '../api/workers'
import { useAuth } from '../context/AuthContext'
import WorkerCard from '../components/WorkerCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiSearch, FiMapPin, FiBriefcase } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { motion, useInView } from 'framer-motion'

const SKILLS = [
  'All', 'Plumber', 'Electrician', 'Painter', 'Carpenter',
  'Driver', 'Gardener', 'Mason', 'Welder', 'Cook',
]

const STATS = [
  { label: 'Verified Workers', end: 500, suffix: '+', icon: '✅' },
  { label: 'Skills Available', end: 20, suffix: '+', icon: '🔧' },
  { label: 'Cities Covered', end: 50, suffix: '+', icon: '📍' },
  { label: 'Jobs Connected', end: 2000, suffix: '+', icon: '🤝' },
]

const CountUpStat = ({ end, suffix }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (isInView) {
      let startTime
      const duration = 2000 // 2 seconds
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        // Ease out quad
        const easeProgress = progress * (2 - progress)
        setCount(Math.floor(easeProgress * end))
        if (progress < 1) {
          requestAnimationFrame(step)
        }
      }
      requestAnimationFrame(step)
    }
  }, [isInView, end])

  return <span ref={ref}>{count}{suffix}</span>
}

const HomePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [skillFilter, setSkillFilter] = useState('All')
  const [locationInput, setLocationInput] = useState('')
  const [appliedLocation, setAppliedLocation] = useState('')

  const fetchWorkers = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (skillFilter && skillFilter !== 'All') params.skill = skillFilter
      if (appliedLocation) params.location = appliedLocation
      const res = await getWorkers(params)
      setWorkers(res.data)
    } catch {
      toast.error('Failed to load workers. Is the server running?')
    } finally {
      setLoading(false)
    }
  }, [skillFilter, appliedLocation])

  useEffect(() => {
    fetchWorkers()
  }, [fetchWorkers])

  const handleSearch = (e) => {
    e.preventDefault()
    setAppliedLocation(locationInput)
  }

  const handleClearFilters = () => {
    setSkillFilter('All')
    setLocationInput('')
    setAppliedLocation('')
  }

  const isFiltered = skillFilter !== 'All' || appliedLocation

  return (
    <main className="relative min-h-screen bg-slate-50 overflow-hidden">
      {/* ── Global Moving Background Blobs (Depth Layer) ── */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D97706]/5 rounded-full mix-blend-multiply filter blur-[100px] animate-blob" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-slate-900/5 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000" />

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex flex-col justify-between pt-20 pb-0 z-10 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] overflow-hidden">
        {/* Dark overlay & image for depth */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div 
          className="absolute inset-0 opacity-15 mix-blend-overlay bg-cover bg-center z-0" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=2000')" }}
        ></div>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md text-slate-100 text-xs font-bold px-4 py-1.5 rounded-full mb-6 shadow-sm">
              <span className="w-2 h-2 bg-[#22C55E] rounded-full" />
              Professionals available near you
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight text-white drop-shadow-md">
              Connecting Skilled Talent
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#D97706]">with Opportunities</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-200 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-sm"
          >
            Find trusted professionals or post your job instantly. Join the modern marketplace built for simplicity and accessibility.
          </motion.p>

          {/* Search bar + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-6 max-w-3xl mx-auto w-full"
          >
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3 bg-white/90 backdrop-blur-xl p-2.5 rounded-2xl border border-white/40 shadow-xl focus-within:ring-4 focus-within:ring-[#D97706]/30 focus-within:scale-[1.01] transition-all duration-300"
            >
              <div className="relative flex-1">
                <FiMapPin
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D97706]"
                  size={20}
                />
                <input
                  id="location-search"
                  type="text"
                  placeholder="Enter your city or area..."
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-transparent text-slate-900 placeholder-slate-500 text-base font-medium focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold px-8 py-3.5 rounded-xl hover:shadow-[#D97706]/30 transition-all duration-300 flex items-center justify-center gap-2 text-base hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                <FiSearch size={18} />
                Find Workers
              </button>
            </form>
            
            <div className="flex items-center justify-center gap-4">
              <span className="text-slate-300 text-sm font-medium">Are you an employer?</span>
              <Link
                to="/post-job"
                className="inline-flex items-center justify-center bg-transparent hover:bg-white/10 text-white font-semibold py-2 px-6 rounded-xl border-2 border-white/40 hover:border-white transition-all duration-300 backdrop-blur-sm"
              >
                Post a Job
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-md w-full">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(({ label, end, suffix, icon }, index) => (
              <motion.div 
                key={label} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", bounce: 0.5, delay: index * 0.1 }}
                  className="text-2xl mb-1"
                >
                  {icon}
                </motion.div>
                <p className="text-3xl font-extrabold text-white drop-shadow-sm">
                  <CountUpStat end={end} suffix={suffix} />
                </p>
                <p className="text-slate-300 text-sm font-medium mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skill Filter Pills ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {SKILLS.map((skill) => (
            <button
              key={skill}
              onClick={() => setSkillFilter(skill)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                skillFilter === skill
                  ? 'bg-[#0F172A] text-white shadow-md shadow-slate-900/10'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </section>

      {/* ── Workers Section ── */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <span className="text-[#D97706]">{workers.length}</span> professionals found
            </h2>
            {isFiltered && (
              <button onClick={handleClearFilters} className="text-sm text-slate-500 hover:text-[#D97706] underline">
                Clear filters
              </button>
            )}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : workers.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto"
            >
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiBriefcase className="text-[#D97706]" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No professionals found</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">We couldn't find any professionals matching your current filters. Try adjusting your search criteria or explore all categories.</p>
              <button onClick={handleClearFilters} className="btn-secondary">
                View All Professionals
              </button>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {}
              }}
            >
              {workers.map((worker) => (
                <WorkerCard key={worker._id} worker={worker} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Footer CTA (Hide for employees) ── */}
      {(!user || user.role === 'user') && (
        <section className="py-20 relative z-10 bg-slate-100 mt-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-10 sm:p-16 text-center text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 w-full h-full transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none z-0"></div>
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">Need a professional?</h2>
                <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  Post your job requirements and get contacted by verified, skilled talent in your area.
                </p>
                <button 
                  onClick={() => navigate('/post-job')}
                  className="bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-bold px-10 py-4 rounded-xl hover:shadow-[#D97706]/20 transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl text-lg relative z-20 cursor-pointer"
                >
                  Post a Job Now
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default HomePage
