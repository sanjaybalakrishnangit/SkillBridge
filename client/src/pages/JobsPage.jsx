import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getJobs } from '../api/jobs'
import { useAuth } from '../context/AuthContext'
import JobCard from '../components/JobCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiBriefcase, FiPlus, FiSearch, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

const SKILL_FILTERS = [
  'All', 'Plumber', 'Electrician', 'Painter', 'Carpenter',
  'Driver', 'Gardener', 'Mason', 'Welder', 'Cook',
]

const JobsPage = () => {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [skillFilter, setSkillFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    getJobs()
      .then((res) => setJobs(res.data))
      .catch(() => toast.error('Failed to load job listings'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = jobs.filter((job) => {
    const matchesSkill = skillFilter === 'All' || job.skill === skillFilter
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      !query ||
      job.title?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query)
    return matchesSkill && matchesSearch
  })

  const isFiltered = skillFilter !== 'All' || searchQuery

  return (
    <main className="relative min-h-screen bg-slate-50">
      {/* Hero Bar */}
      <section className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FiBriefcase size={22} className="text-[#F59E0B]" />
                <h1 className="text-3xl font-bold">Job Listings</h1>
              </div>
              <p className="text-slate-400 text-sm">
                Browse open job requirements posted by employers and households
              </p>
            </div>

            {user?.role !== 'employee' && (
              <Link
                to="/post-job"
                className="btn-primary self-start sm:self-auto text-sm gap-2 whitespace-nowrap"
              >
                <FiPlus size={16} />
                Post a Job
              </Link>
            )}
          </div>

          {/* Search bar */}
          <div className="mt-6 relative max-w-lg">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by title, location, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:bg-white/15 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Skill Filter Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {SKILL_FILTERS.map((skill) => (
            <button
              key={skill}
              onClick={() => setSkillFilter(skill)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                skillFilter === skill
                  ? 'bg-[#0F172A] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </section>

      {/* Jobs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
            <div className="text-6xl mb-4">📋</div>
            {jobs.length === 0 ? (
              <>
                <p className="text-xl font-semibold text-slate-600 mb-2">No jobs posted yet</p>
                <p className="text-sm text-slate-400 mb-6">Be the first to post a job requirement</p>
                {user?.role !== 'employee' && (
                  <Link to="/post-job" className="btn-primary text-sm inline-flex">
                    Post a Job
                  </Link>
                )}
              </>
            ) : (
              <>
                <p className="text-xl font-semibold text-slate-600 mb-2">No jobs match your filters</p>
                <p className="text-sm text-slate-400 mb-6">Try adjusting your search or skill filter</p>
                <button
                  onClick={() => { setSkillFilter('All'); setSearchQuery('') }}
                  className="btn-secondary text-sm inline-flex"
                >
                  Clear filters
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
                <span className="font-semibold text-slate-700">{jobs.length}</span>{' '}
                {jobs.length === 1 ? 'job' : 'jobs'}
              </p>
              {isFiltered && (
                <button
                  onClick={() => { setSkillFilter('All'); setSearchQuery('') }}
                  className="text-sm text-slate-500 hover:text-[#D97706] flex items-center gap-1 underline"
                >
                  <FiX size={14} />
                  Clear filters
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default JobsPage
