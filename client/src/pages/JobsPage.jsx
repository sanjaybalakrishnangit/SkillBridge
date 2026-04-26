import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getJobs } from '../api/jobs'
import { useAuth } from '../context/AuthContext'
import JobCard from '../components/JobCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiBriefcase, FiPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'

const JobsPage = () => {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJobs()
      .then((res) => setJobs(res.data))
      .catch(() => toast.error('Failed to load job listings'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FiBriefcase className="text-teal-600" size={22} />
            <h1 className="text-2xl font-bold text-slate-800">Job Listings</h1>
          </div>
          <p className="text-slate-500 text-sm">
            Browse work opportunities posted by employers
          </p>
        </div>

        {(!user || user.role === 'user') && (
          <Link
            to="/post-job"
            className="btn-primary self-start sm:self-auto text-sm gap-2"
          >
            <FiPlus size={16} />
            Post a Job
          </Link>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-xl font-semibold text-slate-600 mb-2">No jobs posted yet</p>
          <p className="text-sm mb-6">Be the first to post a job requirement</p>
          {(!user || user.role === 'user') && (
            <Link to="/post-job" className="btn-primary text-sm inline-flex">
              Post a Job
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-400 mb-5">
            Showing <span className="font-semibold text-slate-600">{jobs.length}</span> open{' '}
            {jobs.length === 1 ? 'job' : 'jobs'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </>
      )}
    </main>
  )
}

export default JobsPage
