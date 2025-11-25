interface SEOScoreProps {
  score: number
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
}

export default function SEOScore({
  score,
  size = 'medium',
  showLabel = false
}: SEOScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-md shadow-success-500/50 dark:shadow-success-500/30'
    if (score >= 60) return 'bg-gradient-to-r from-warning-500 to-warning-600 text-white shadow-md shadow-warning-500/50 dark:shadow-warning-500/30'
    return 'bg-gradient-to-r from-error-500 to-error-600 text-white shadow-md shadow-error-500/50 dark:shadow-error-500/30'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  const sizeClasses = {
    small: 'px-2.5 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base'
  }

  return (
    <div className={`inline-flex items-center rounded-full font-bold transition-all hover:scale-105 ${getScoreColor(score)} ${sizeClasses[size]}`}>
      <span>{score}/100</span>
      {showLabel && (
        <span className="ml-2">{getScoreLabel(score)}</span>
      )}
    </div>
  )
}