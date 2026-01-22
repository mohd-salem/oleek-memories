import React, { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import Link from 'next/link'

// Button variants following design system
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'amazon'
type ButtonSize = 'sm' | 'md' | 'lg'

interface BaseButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  className?: string
}

type ButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
type LinkButtonProps = BaseButtonProps & {
  href: string
  external?: boolean
}

const variantClasses = {
  primary: 'bg-gold-500 text-white hover:bg-gold-600 active:bg-gold-700',
  secondary: 'border-2 border-charcoal-800 text-charcoal-800 hover:bg-cream-100',
  ghost: 'text-charcoal-700 hover:text-gold-500 hover:underline',
  amazon: 'bg-amazon text-white hover:bg-amazon-dark',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

function getButtonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className = '') {
  const baseClasses = 'font-medium rounded transition-all focus-ring inline-block text-center'
  return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
}

// Regular button element
export function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  return (
    <button
      className={getButtonClasses(variant, size, className)}
      {...props}
    >
      {children}
    </button>
  )
}

// Link styled as button
export function ButtonLink({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  href,
  external = false,
  className = '',
}: LinkButtonProps) {
  const classes = getButtonClasses(variant, size, className)
  
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    )
  }
  
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}

export default Button
