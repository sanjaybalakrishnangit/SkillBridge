import { FiMapPin, FiPhone, FiClock } from 'react-icons/fi'

const PAYMENT_CONFIG = {
  money: { label: '💵 Paid', color: 'bg-green-100 text-green-700 border border-green-200' },
  food:  { label: '🍱 Food Provided', color: 'bg-amber-100 text-amber-700 border border-amber-200' },
  both:  { label: '💵🍱 Paid + Food', color: 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold shadow-md' },
}

const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const JobCard = ({ job }) => {
  const { title, description, skill, location, workingHours, paymentType, phone, imageUrl, createdAt } =
    job
  const payment = PAYMENT_CONFIG[paymentType] || {
    label: paymentType,
    color: 'bg-slate-100 text-slate-600',
  }

  return (
    <div className="card hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 flex flex-col animate-slide-up bg-white/80 backdrop-blur-sm border border-white/40">
      {/* Image */}
      {imageUrl && (
        <div className="overflow-hidden rounded-xl mb-4 -mt-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Title row */}
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className="font-semibold text-slate-800 text-base leading-snug flex-1">{title}</h3>
        <span className="text-xs text-slate-400 flex-shrink-0 mt-0.5 whitespace-nowrap">
          {timeAgo(createdAt)}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">{description}</p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {skill && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
            {skill}
          </span>
        )}
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${payment.color}`}>
          {payment.label}
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
          <FiClock size={11} />
          {workingHours}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
        <FiMapPin size={13} className="text-teal-500 flex-shrink-0" />
        <span className="truncate">{location}</span>
      </div>

      {/* CTA */}
      <a
        href={`tel:${phone}`}
        className="btn-primary w-full text-sm py-2.5 gap-1.5 mt-auto"
      >
        <FiPhone size={14} />
        Contact Employer
      </a>
    </div>
  )
}

export default JobCard
