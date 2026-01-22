import React, { ReactNode } from 'react'

interface SectionHeadingProps {
  children: ReactNode
  level?: 'h1' | 'h2' | 'h3'
  className?: string
  subheading?: string
  centered?: boolean
}

export default function SectionHeading({ 
  children, 
  level = 'h2',
  className = '',
  subheading,
  centered = false
}: SectionHeadingProps) {
  const Tag = level
  const textAlign = centered ? 'text-center' : ''
  
  return (
    <div className={`mb-8 ${textAlign} ${className}`}>
      <Tag className="text-charcoal-900 font-display">
        {children}
      </Tag>
      {subheading && (
        <p className="mt-3 text-lg text-charcoal-700 leading-relaxed max-w-3xl mx-auto">
          {subheading}
        </p>
      )}
    </div>
  )
}
