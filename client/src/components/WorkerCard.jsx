import { FiMapPin, FiPhone, FiStar } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const getSkillColor = () => 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm'

const StarRating = ({ rating }) => {
  const stars = Math.round(rating)
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= stars ? 'text-amber-400' : 'text-slate-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

const WorkerCard = ({ worker }) => {
  const navigate = useNavigate()
  const { _id, name, skill, location, phone, isAvailable, isVerified, rating, photo, experience } =
    worker

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      onClick={() => navigate(`/workers/${_id}`)}
      className="card relative group hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/90 backdrop-blur-sm border border-slate-100 overflow-hidden p-5 rounded-2xl"
    >
      {/* Subtle top gradient border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-400 opacity-80"></div>
      
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="w-14 h-14 rounded-full object-cover border-[3px] border-white ring-2 ring-blue-100 shadow-md"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-md ring-2 ring-white border-[3px] border-blue-50">
              {name?.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Online dot */}
          {isAvailable && (
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse-glow" />
          )}
        </div>

        {/* Name + skill */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <h3 className="font-bold text-slate-800 truncate text-lg leading-tight">{name}</h3>
            {isVerified && (
              <MdVerified
                className="text-green-500 flex-shrink-0 drop-shadow-[0_0_4px_rgba(34,197,94,0.4)]"
                size={18}
                title="Verified Professional"
              />
            )}
          </div>
          <span
            className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${getSkillColor(
              skill
            )}`}
          >
            {skill}
          </span>
        </div>

        {/* Availability badge */}
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
            isAvailable ? 'badge-available' : 'badge-busy'
          }`}
        >
          {isAvailable ? 'Available' : 'Busy'}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FiMapPin size={14} className="text-blue-500 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiStar size={13} className="text-amber-400 flex-shrink-0" />
          {rating > 0 ? (
            <div className="flex items-center gap-2">
              <StarRating rating={rating} />
              <span className="text-sm font-semibold text-slate-700">{rating.toFixed(1)}</span>
            </div>
          ) : (
            <span className="text-sm text-slate-400">No ratings yet</span>
          )}
        </div>

        {experience && (
          <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">{experience}</p>
        )}
      </div>

      {/* CTA Button */}
      <a
        href={`tel:${phone}`}
        className="btn-primary w-full text-sm py-2.5 gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <FiPhone size={14} />
        Call Now
      </a>
    </motion.div>
  )
}

export default WorkerCard
