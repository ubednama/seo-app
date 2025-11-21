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
    if (score >= 80) return 'text-success-600 bg-success-100'
    if (score >= 60) return 'text-warning-600 bg-warning-100'
    return 'text-error-600 bg-error-100'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-3 py-1.5 text-base',
    large: 'px-4 py-2 text-lg'
  }

  return (
    <div className={`inline-flex items-center rounded-full font-semibold ${getScoreColor(score)} ${sizeClasses[size]}`}>
      <span>{score}/100</span>
      {showLabel && (
        <span className="ml-2">{getScoreLabel(score)}</span>
      )}
    </div>
  )
}