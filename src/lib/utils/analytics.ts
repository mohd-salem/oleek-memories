/**
 * Analytics utility for tracking user interactions
 * Supports Google Analytics, Meta Pixel, and custom analytics
 */

// Types for analytics events
export type AnalyticsEvent = 
  | 'page_view'
  | 'amazon_cta_click'
  | 'conversion_started'
  | 'conversion_completed'
  | 'conversion_failed'
  | 'download_completed'
  | 'contact_form_submit'
  | 'faq_expand'
  | 'product_variant_view'

export interface AnalyticsEventData {
  category?: string
  action?: string
  label?: string
  value?: number
  [key: string]: any
}

/**
 * Track an analytics event
 */
export function trackEvent(
  eventName: AnalyticsEvent,
  eventData?: AnalyticsEventData
): void {
  // Google Analytics 4 (gtag.js)
  if (typeof window !== 'undefined' && 'gtag' in window) {
    ;(window as any).gtag('event', eventName, eventData)
  }

  // Meta Pixel
  if (typeof window !== 'undefined' && 'fbq' in window) {
    ;(window as any).fbq('track', eventName, eventData)
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, eventData)
  }
}

/**
 * Track Amazon CTA clicks
 */
export function trackAmazonClick(variant?: string): void {
  trackEvent('amazon_cta_click', {
    category: 'engagement',
    label: variant || 'unknown',
  })
}

/**
 * Track conversion workflow events
 */
export function trackConversionStarted(fileSize: number, fileType: string): void {
  trackEvent('conversion_started', {
    category: 'conversion',
    file_size: fileSize,
    file_type: fileType,
  })
}

export function trackConversionCompleted(
  duration: number,
  originalSize: number,
  convertedSize: number
): void {
  const reduction = ((originalSize - convertedSize) / originalSize) * 100
  
  trackEvent('conversion_completed', {
    category: 'conversion',
    conversion_duration: duration,
    original_size: originalSize,
    converted_size: convertedSize,
    size_reduction_percent: Math.round(reduction),
  })
}

export function trackConversionFailed(error: string): void {
  trackEvent('conversion_failed', {
    category: 'conversion',
    error_message: error,
  })
}

/**
 * Track download events
 */
export function trackDownload(fileSize: number): void {
  trackEvent('download_completed', {
    category: 'conversion',
    file_size: fileSize,
  })
}

/**
 * Track page views
 */
export function trackPageView(url: string): void {
  trackEvent('page_view', {
    page_path: url,
  })
}
