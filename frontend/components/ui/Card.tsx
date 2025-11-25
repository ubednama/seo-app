'use client'

import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean
    glass?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', hover = true, glass = true, children, ...props }, ref) => {
        const baseStyles = 'rounded-xl shadow-lg transition-all duration-300'
        const glassStyles = glass ? 'glass' : 'bg-white dark:bg-gray-800'
        const hoverStyles = hover ? 'hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]' : ''

        return (
            <div
                ref={ref}
                className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card'

export default Card
