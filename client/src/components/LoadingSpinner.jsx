const LoadingSpinner = ({ fullPage = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-9 w-9 border-[3px]',
    lg: 'h-14 w-14 border-4',
  }

  const spinner = (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-teal-200 border-t-teal-600`}
    />
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="text-sm text-slate-500 font-medium animate-pulse">Loading...</p>
        </div>
      </div>
    )
  }

  return <div className="flex justify-center py-12">{spinner}</div>
}

export default LoadingSpinner
