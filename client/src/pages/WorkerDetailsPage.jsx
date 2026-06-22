import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWorkerById } from '../api/workers'
import { getWorkerReviews, addReview } from '../api/reviews'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { FiMapPin, FiPhone, FiStar, FiArrowLeft, FiClock, FiBriefcase, FiMessageSquare } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import toast from 'react-hot-toast'

const SKILL_COLORS = {
  plumber: 'bg-slate-100 text-slate-800 border border-slate-200',
  electrician: 'bg-amber-100 text-amber-800 border border-amber-200',
  painter: 'bg-slate-100 text-slate-800 border border-slate-200',
  carpenter: 'bg-amber-100 text-amber-800 border border-amber-200',
  driver: 'bg-slate-100 text-slate-800 border border-slate-200',
  gardener: 'bg-slate-100 text-slate-800 border border-slate-200',
  mason: 'bg-slate-100 text-slate-800 border border-slate-200',
  welder: 'bg-slate-100 text-slate-800 border border-slate-200',
  cook: 'bg-slate-100 text-slate-800 border border-slate-200',
}

const getSkillColor = (skill) => SKILL_COLORS[skill?.toLowerCase()] || 'bg-slate-100 text-slate-800 border border-slate-200'

const StarRating = ({ rating }) => {
  const stars = Math.round(rating)
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= stars ? 'text-[#F59E0B]' : 'text-slate-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

const StarSelector = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => onChange(star)}
          className="text-2xl transition-transform hover:scale-110 focus:outline-none"
        >
          <FiStar
            className={`w-6 h-6 ${star <= value ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-slate-300'}`}
          />
        </button>
      ))}
    </div>
  )
}

const WorkerDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [worker, setWorker] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentInput, setCommentInput] = useState('')
  const [ratingInput, setRatingInput] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)

  const fetchWorkerAndReviews = useCallback(async () => {
    try {
      const [workerRes, reviewsRes] = await Promise.all([
        getWorkerById(id),
        getWorkerReviews(id)
      ])
      setWorker(workerRes.data)
      setReviews(reviewsRes.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load worker details')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    fetchWorkerAndReviews()
  }, [fetchWorkerAndReviews])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!commentInput.trim()) {
      return toast.error('Please write a review comment')
    }
    setSubmittingReview(true)
    try {
      await addReview({
        workerId: id,
        rating: ratingInput,
        comment: commentInput
      })
      toast.success('Review submitted successfully!')
      setCommentInput('')
      setRatingInput(5)
      await fetchWorkerAndReviews()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return <LoadingSpinner fullPage />
  if (!worker) return null

  const isOwnProfile = user && worker && (worker.createdBy === user._id || worker.createdBy?._id === user._id)
  const canLeaveReview = user && user.role === 'user' && !isOwnProfile
  const hasReviewed = reviews.some(r => r.userId?._id === user?._id || r.userId === user?._id)

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-[#D97706] transition-colors mb-8 font-medium focus:outline-none"
      >
        <FiArrowLeft size={18} />
        Back to Workers
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 mb-8">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-6 sm:p-10 border-b border-slate-800 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {worker.photo ? (
                <img
                  src={worker.photo}
                  alt={worker.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center text-white font-bold text-5xl shadow-lg border-4 border-slate-700">
                  {worker.name?.charAt(0).toUpperCase()}
                </div>
              )}
              {worker.isAvailable && (
                <span className="absolute bottom-2 right-2 w-6 h-6 bg-[#22C55E] rounded-full border-4 border-slate-900 shadow-sm" title="Available" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">{worker.name}</h1>
                {worker.isVerified && (
                  <div className="flex items-center gap-1 text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2.5 py-1 rounded-full text-sm font-semibold mx-auto sm:mx-0">
                    <MdVerified size={18} />
                    <span>Verified</span>
                  </div>
                )}
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getSkillColor(worker.skill)}`}>
                {worker.skill}
              </span>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-slate-300">
                <div className="flex items-center gap-1.5">
                  <FiMapPin className="text-[#D97706]" />
                  <span>{worker.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiStar className="text-[#F59E0B]" />
                  <span className="font-semibold">{worker.rating > 0 ? worker.rating.toFixed(1) : 'New'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiClock className={worker.isAvailable ? 'text-[#22C55E]' : 'text-rose-400'} />
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
                className="btn-primary w-full sm:w-auto text-lg py-3 px-8 gap-2 shadow-md"
              >
                <FiPhone size={20} />
                Call Now
              </a>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 sm:p-10 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FiBriefcase className="text-[#D97706]" />
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

      {/* Reviews & Ratings Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-6 sm:p-10">
        <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
          <FiMessageSquare className="text-[#D97706]" />
          Customer Reviews ({reviews.length})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review Submission / Callout Form */}
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-100 pb-8 lg:pb-0 lg:pr-8">
            <h3 className="font-bold text-slate-800 mb-4">Worker Rating</h3>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-4xl font-extrabold text-slate-800">
                {worker.rating > 0 ? worker.rating.toFixed(1) : '0.0'}
              </span>
              <div>
                <StarRating rating={worker.rating} />
                <span className="text-xs text-slate-500 mt-0.5 block">Based on {reviews.length} reviews</span>
              </div>
            </div>

            {canLeaveReview ? (
              hasReviewed ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-slate-600 text-sm">
                  You have already reviewed this worker's profile.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <h4 className="font-semibold text-slate-700 text-sm">Leave a Review</h4>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Rating</label>
                    <StarSelector value={ratingInput} onChange={setRatingInput} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Comment</label>
                    <textarea
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Share your experience hiring this worker..."
                      rows={4}
                      className="input-field py-2"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn-primary w-full text-sm py-2"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )
            ) : (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-slate-500 text-sm italic">
                {!user 
                  ? 'Please log in to submit a rating.'
                  : isOwnProfile 
                    ? 'You cannot review your own profile.' 
                    : 'Only registered customers can leave reviews.'}
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-slate-400 italic">
                No reviews yet. Be the first to leave a review!
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border-b border-slate-100 last:border-b-0 pb-6 last:pb-0">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                        {review.userId?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">{review.userId?.name || 'Anonymous User'}</h4>
                        <span className="text-[10px] text-slate-400 block -mt-0.5">
                          {new Date(review.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-xs font-bold text-amber-700">
                      <FiStar className="fill-amber-500 text-amber-500" size={10} />
                      <span>{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm pl-10 whitespace-pre-wrap leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default WorkerDetailsPage
