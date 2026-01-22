import React, { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'success' | 'info' | 'warning' | 'premium'
  className?: string
}

export default function Badge({ 
  children, 
  variant = 'info', 
  className = '' 
}: BadgeProps) {
  const variantClasses = {
    success: 'bg-green-100 text-green-800 border-green-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    premium: 'bg-gold-100 text-gold-700 border-gold-300',
  }
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
