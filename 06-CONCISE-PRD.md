# OLEEK Memories Book Website - Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** January 21, 2026  
**Product Owner:** OLEEK Team  
**Target Launch:** Q1 2026

---

## 1. PRODUCT GOALS

### Business Goals
1. **Drive Amazon sales:** 15%+ click-through rate from website to Amazon product listings
2. **Reduce support burden:** 40% reduction in pre-purchase questions via comprehensive self-service content
3. **Differentiate from competitors:** Position OLEEK as the privacy-first, premium alternative
4. **Build brand trust:** Establish OLEEK as the expert in wedding video preservation through educational content
5. **Generate leads:** Capture 500+ video conversions per month through free conversion tool

### User Goals
1. **Understand the product quickly:** Know what OLEEK Memories Book is within 5 seconds
2. **Make informed purchase decisions:** Access all necessary information (specs, pricing, use cases) without contacting support
3. **Convert videos confidently:** Ensure wedding videos will play on device before purchasing
4. **Learn usage independently:** Self-serve through documentation without waiting for support
5. **Trust the brand:** Feel confident OLEEK protects their privacy and delivers quality

---

## 2. TARGET USERS & PRIMARY USE CASES

### Primary User Persona: "The Engaged Couple"
- **Demographics:** 25-35 years old, recently engaged or newly married
- **Tech Comfort:** Moderately tech-savvy but values simplicity
- **Pain Point:** Spent thousands on wedding videography, want to ensure it's watchable and shareable
- **Use Cases:**
  - Research product before purchasing on Amazon
  - Convert 4K wedding video from videographer to compatible format
  - Learn how to load videos before gifting to parents/grandparents

### Secondary User Persona: "The Gift Buyer"
- **Demographics:** 45-65 years old, parent or close friend of couple
- **Tech Comfort:** Basic tech skills
- **Pain Point:** Wants meaningful, lasting gift that won't be forgotten
- **Use Cases:**
  - Verify this is a worthwhile gift (read reviews, understand value)
  - Confirm Amazon Prime shipping availability for deadline
  - Understand if they need to help couple with setup

### Tertiary User Persona: "The Existing Customer"
- **Demographics:** 30-60 years old, already purchased the device
- **Tech Comfort:** Varies
- **Pain Point:** Video won't play, device isn't working as expected
- **Use Cases:**
  - Troubleshoot "No Files Found" error
  - Convert incompatible video format
  - Learn advanced features (multiple videos, volume settings)

---

## 3. PAGES & PURPOSES

### 3.1 HOME PAGE (/)
**Purpose:** Product showcase and conversion to Amazon  
**Target Audience:** New visitors, potential buyers  
**Primary CTAs:** "Buy on Amazon" (multiple placements), "Convert Your Video" (secondary)

**Must Include:**
- Hero section with emotional headline and product image
- 4 key differentiators (storage, battery, ease of use, premium design)
- Available product versions with Amazon links
- Social proof (testimonials/reviews)
- Free converter tool promotion
- Trust signals (Prime eligible, warranty, small business)

---

### 3.2 CONVERT PAGE (/convert)
**Purpose:** Free video conversion tool (lead generation + customer support)  
**Target Audience:** Prospective buyers and existing customers  
**Primary CTA:** "Convert Video" → Download result  
**Secondary CTA:** Link to Learn page

**Must Include:**
- Prominent privacy statement ("Files never leave your device")
- Drag-drop file upload interface
- Real-time conversion progress indicator
- Instant download of converted file
- Technical explanation (expandable/optional)
- Link to terms and conditions
- Help text for supported formats and file size limits

**Technical Requirements:**
- Client-side conversion using ffmpeg.wasm (no server upload)
- Output: H.264 MP4, max 1080p, 5 Mbps bitrate, 30fps, 16:9 aspect ratio
- Support input: MP4, MOV, AVI, MKV, WMV, M4V, WebM
- Handle files up to 2GB (warn for larger)
- Error handling with user-friendly messages

---

### 3.3 LEARN PAGE (/learn)
**Purpose:** Comprehensive product education and troubleshooting  
**Target Audience:** Existing customers, pre-purchase researchers  
**Primary CTA:** None (informational)  
**Secondary CTAs:** Links to converter, FAQ, contact support

**Must Include:**
- Search/filter functionality
- 5 main sections (organized as tabs or accordion):
  1. **Getting Started:** Charging, battery life, what's included
  2. **Loading Videos:** Step-by-step USB process, **DO NOT FORMAT warning**, file management
  3. **Using Controls:** Button functions, auto-play, volume adjustment
  4. **Troubleshooting:** Common errors and solutions (No Files Found, stuttering, stretched video)
  5. **Tips & Best Practices:** Multiple videos, file naming, advanced features
- Visual aids (screenshots, diagrams where applicable)
- Cross-links to converter tool for format issues
- Mobile-friendly layout (accordion for easier navigation)

---

### 3.4 FAQ PAGE (/faq)
**Purpose:** Quick answers to common questions (reduce support tickets)  
**Target Audience:** All users (pre and post-purchase)  
**Primary CTA:** None (informational)  
**Secondary CTAs:** Contact support, link to Learn page, link to converter

**Must Include:**
- Search functionality (live filtering)
- 3 categories:
  1. **General:** What is it, pricing, how to purchase, warranty, shipping, returns
  2. **Technical:** Specs (16GB/32GB, 5000mAh, 8-hour battery), formats, resolution, capacity
  3. **Usage:** How to load videos, multiple videos, photos/music, troubleshooting basics
- "Why OLEEK vs competitors" section (highlighting superior specs)
- "Didn't find your answer?" contact section at bottom
- FAQ schema markup for SEO

---

### 3.5 TERMS & CONDITIONS PAGE (/terms)
**Purpose:** Legal protection for video conversion service  
**Target Audience:** Users of converter tool (compliance)  
**Primary CTA:** None (legal document)

**Must Include:**
- Clear page title and last updated date
- 10-12 numbered sections:
  - Acceptance of terms
  - Ownership and rights (user must own video)
  - Prohibited content (illegal, defamatory, obscene)
  - Data processing (client-side only, no server storage)
  - Service limitations and no warranty
  - Limitation of liability
  - User indemnification
  - Contact information for legal questions
- Plain language where possible (avoid excessive legal jargon)
- Link from converter page (small print or checkbox)

---

## 4. ACCEPTANCE CRITERIA BY PAGE

### Home Page: DONE when...
- [ ] Page loads in <2 seconds on 4G connection
- [ ] All Amazon CTAs link to correct product listings (open in new tab)
- [ ] Hero headline communicates product value within 5 seconds of viewing
- [ ] At least 3 customer testimonials displayed
- [ ] Responsive layout works at 320px, 768px, 1024px, 1440px breakpoints
- [ ] Lighthouse score ≥90 (Performance, Accessibility, SEO)
- [ ] All images have descriptive alt text
- [ ] H1 tag present and unique
- [ ] Amazon CTA clicks tracked in analytics

### Convert Page: DONE when...
- [ ] Client-side conversion achieves 95%+ success rate on test videos (20+ samples)
- [ ] Progress indicator updates every 2 seconds during conversion
- [ ] Converted videos play successfully on OLEEK device (validated with actual hardware)
- [ ] Privacy statement visible above the fold
- [ ] Error messages are actionable (tell user what to do next)
- [ ] Works on Chrome, Firefox, Safari (desktop and mobile)
- [ ] File size >2GB shows warning message
- [ ] Conversion completes in <10 minutes for 10-minute 1080p video
- [ ] Analytics track: conversion starts, completions, failures

### Learn Page: DONE when...
- [ ] Search functionality filters results in <100ms
- [ ] All critical topics covered (charging, loading, formats, troubleshooting)
- [ ] "DO NOT FORMAT" warning prominently displayed (callout box or color)
- [ ] Mobile accordion UI works smoothly (no layout shift)
- [ ] Links to converter tool work and track clicks
- [ ] Print-friendly CSS styles included
- [ ] User can find answer to common question within 30 seconds (usability test)

### FAQ Page: DONE when...
- [ ] Search returns relevant results for 90%+ of common queries
- [ ] All questions answered clearly and concisely
- [ ] Technical specs match actual device specifications
- [ ] Amazon-related answers align with current Amazon policies
- [ ] FAQ schema markup validates (Google Rich Results Test)
- [ ] Category jump links scroll smoothly to sections
- [ ] Mobile layout is readable and navigable

### Terms Page: DONE when...
- [ ] All necessary legal protections included
- [ ] Privacy statements align with technical implementation (client-side processing)
- [ ] Last updated date is current
- [ ] Contact email is accurate
- [ ] Readable font size (≥14px)
- [ ] Linked from converter page footer/disclaimer

---

## 5. NON-GOALS (What We Will NOT Build Now)

### Out of Scope for V1:
- ❌ E-commerce checkout (Amazon handles all sales)
- ❌ Shopping cart functionality
- ❌ User accounts / login system
- ❌ Server-side video conversion (client-side only)
- ❌ Email delivery of converted videos
- ❌ Video editor (trim, crop, add music)
- ❌ Batch video conversion (multiple files at once)
- ❌ Custom product configurator (cover personalization)
- ❌ Live chat support widget
- ❌ Blog or content marketing section
- ❌ Email newsletter signup (future consideration)
- ❌ Multi-language support (English US only)
- ❌ Mobile app
- ❌ Video tutorials embedded on every page (Learn page only)
- ❌ Community forum or user discussions

### Future Considerations (V2+):
- Server-side conversion fallback for edge cases
- Email newsletter for promotions
- Blog with wedding tips, customer stories
- Multi-language support (Spanish, French)
- Product customization tool (custom cover text)
- Wholesale/corporate ordering portal

---

## 6. SUCCESS METRICS

### Primary Metrics (Measure Website Effectiveness)

**Traffic & Engagement:**
- 10,000+ unique visitors per month (within 6 months)
- Average time on site: 2+ minutes
- Bounce rate: <60%
- Pages per session: 2.5+

**Conversion (to Amazon):**
- **15%+ click-through rate** from website to Amazon (primary goal)
- Amazon clicks from multiple touchpoints (hero, versions section, footer)
- Converter tool → Amazon conversion: 20%+ (users who convert, then buy)

**Converter Tool Usage:**
- 500+ conversions per month
- 95%+ successful conversion rate
- <5% error/failure rate
- Average completion time: <10 minutes (for typical videos)

**Support Reduction:**
- 40% decrease in pre-purchase email inquiries (after 3 months)
- FAQ/Learn page views: 5,000+ per month
- <10% of converter users contact support

**SEO & Discoverability:**
- Rank on page 1 for "wedding video book" within 6 months
- Rank top 3 for "convert wedding video" within 3 months
- 30%+ of traffic from organic search (within 6 months)

### Secondary Metrics (Measure User Satisfaction)

**Educational Content:**
- Learn page: Average time 3+ minutes (users reading thoroughly)
- FAQ page: Search usage rate 40%+ (users finding answers)
- Conversion tool: Repeat usage 15%+ (users converting multiple videos)

**Performance:**
- Lighthouse Performance Score: ≥90
- Core Web Vitals: All "Good" ratings
- Page load time: <2 seconds (75th percentile)

**Accessibility:**
- WCAG 2.1 AA compliance: 100%
- Keyboard navigation functional: 100% of interactive elements

### Monitoring & Analytics

**Tools:**
- Google Analytics 4 (or privacy-focused alternative like Plausible)
- Sentry for error tracking
- Real user monitoring (RUM) for performance

**Events to Track:**
- Amazon CTA clicks (by location: hero, versions, footer)
- Converter tool usage (start, complete, error)
- Search queries (Learn and FAQ pages)
- Outbound links (to Amazon, social media)
- Form submissions (contact form)
- Video tutorial views (if embedded)
- Scroll depth (25%, 50%, 75%, 100%)

**Weekly Review:**
- Conversion rate trends
- Top search queries (identify content gaps)
- Error rates (conversion tool)
- Support ticket volume and topics

**Monthly Review:**
- Traffic sources and growth
- Amazon referral performance
- SEO rankings
- User feedback and testimonials

---

## 7. TECHNICAL CONSTRAINTS

**Framework:**
- Next.js 14+ with App Router
- TypeScript preferred
- React Server Components where applicable

**Hosting:**
- Vercel (recommended) or similar with CDN
- SSL/HTTPS required
- Domain: oleek.com or similar

**Browser Support:**
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

**Conversion Library:**
- @ffmpeg/ffmpeg (ffmpeg.wasm)
- Lazy-loaded (not in initial bundle)
- Single-threaded fallback for Safari

**Performance Targets:**
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3.5s
- Cumulative Layout Shift: <0.1

**SEO Requirements:**
- Unique meta titles and descriptions per page
- Schema markup (Organization, Product, FAQ)
- Sitemap.xml auto-generated
- Robots.txt configured
- Open Graph and Twitter Card meta tags

**Accessibility:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratio ≥4.5:1

---

## 8. LAUNCH CHECKLIST

### Pre-Launch:
- [ ] All pages built and responsive
- [ ] Content proofread and approved
- [ ] Amazon links verified and tested
- [ ] Video converter tested with 20+ diverse files
- [ ] Cross-browser testing completed
- [ ] Lighthouse scores ≥90 across all pages
- [ ] Analytics tracking configured and tested
- [ ] Contact form email delivery working
- [ ] Terms reviewed (legal consultation if budget allows)
- [ ] Sitemap submitted to Google Search Console

### Launch Day:
- [ ] Deploy to production
- [ ] Verify all links work
- [ ] Test converter on production
- [ ] Monitor analytics for errors
- [ ] Post on social media (if channels exist)

### Week 1 Post-Launch:
- [ ] Monitor conversion tool success rate
- [ ] Check for JavaScript errors (Sentry)
- [ ] Review user feedback
- [ ] Address any critical bugs
- [ ] Begin SEO monitoring

---

## 9. DEFINITION OF DONE

A page is considered "done" when:
1. All functional requirements implemented and tested
2. All acceptance criteria checked and verified
3. Responsive design validated on mobile, tablet, desktop
4. Cross-browser testing passed (Chrome, Firefox, Safari, Edge)
5. Accessibility audit passed (automated + manual spot check)
6. Performance benchmarks met (Lighthouse ≥90)
7. Analytics tracking implemented and verified
8. SEO requirements met (meta tags, schema, alt text)
9. Code reviewed and approved
10. Deployed to production and verified live
11. No critical or high-priority bugs

---

## 10. ROLES & RESPONSIBILITIES

**Product Owner:** Define requirements, prioritize features, approve deliverables  
**Developer(s):** Implement website, converter tool, responsive design  
**Designer:** Create visual design based on design system  
**Content Writer:** Write and proofread all page copy  
**QA Tester:** Test across devices/browsers, verify acceptance criteria  
**Marketing:** Provide Amazon links, coordinate launch, manage analytics

---

**END OF PRD**

**Next Steps:**
1. Review and approve this PRD
2. Generate Next.js application structure
3. Implement pages according to acceptance criteria
4. Test converter tool extensively
5. Deploy to staging for review
6. Launch to production

**Timeline Estimate:**
- Development: 2-3 weeks
- Testing & QA: 1 week
- Content creation: 1 week (parallel with dev)
- Total: 3-4 weeks to launch
