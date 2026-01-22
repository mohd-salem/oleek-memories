'use client'

import React, { useState, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionItemProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border-b border-cream-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left hover:bg-cream-100 transition-colors px-4 focus-ring rounded"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-lg text-charcoal-900">
          {title}
        </span>
        <ChevronDown 
          className={`h-5 w-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="px-4 pb-5 text-charcoal-700 leading-relaxed animate-fade-in">
          {children}
        </div>
      )}
    </div>
  )
}

interface AccordionProps {
  children: ReactNode
  className?: string
}

export default function Accordion({ children, className = '' }: AccordionProps) {
  return (
    <div className={`divide-y divide-cream-200 ${className}`}>
      {children}
    </div>
  )
}
