import React, { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'testimonial' | 'feature'
  className?: string
  hoverable?: boolean
}

export default function Card({ 
  children, 
  variant = 'default', 
  className = '',
  hoverable = false 
}: CardProps) {
  const baseClasses = 'bg-cream-100 border border-cream-200 rounded-lg p-6'
  
  const variantClasses = {
    default: '',
    testimonial: 'border-t-4 border-t-rose-300',
    feature: 'text-center',
  }
  
  const hoverClasses = hoverable 
    ? 'transition-shadow hover:shadow-lg hover:border-gold-400' 
    : ''
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  )
}
