import React, { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

// Reusable container component for consistent max-width and padding
export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`container-custom ${className}`}>
      {children}
    </div>
  )
}
