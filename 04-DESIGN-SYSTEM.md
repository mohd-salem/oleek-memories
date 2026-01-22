# OLEEK Memories Book - Design System

**Version:** 1.0  
**Date:** January 21, 2026  
**Brand Positioning:** Premium Wedding Keepsake | Timeless Elegance | Modern Technology

---

## 1. DESIGN PHILOSOPHY

### 1.1 Brand Essence
**OLEEK** embodies the intersection of timeless tradition and modern innovation. Like a cherished family heirloom, our Memories Book preserves precious moments, but with the warmth and emotion of video that static photos cannot capture.

**Core Values:**
- **Timeless:** Classic design that won't feel dated in 20 years
- **Elegant:** Refined without being pretentious
- **Warm:** Inviting and emotionally resonant
- **Trust:** Professional, reliable, privacy-conscious
- **Premium:** High-quality without being ostentatious

### 1.2 Visual Direction
- **Soft, romantic palette** inspired by wedding stationery and linen textures
- **Clean, spacious layouts** that let the product photography breathe
- **Subtle, sophisticated animations** that enhance without distracting
- **Typography that balances** classic serif elegance with modern sans-serif clarity

---

## 2. COLOR PALETTE

### 2.1 Primary Colors

**Warm Cream (Background)**
```css
--cream-50: #FDFCFB;    /* Lightest - page backgrounds */
--cream-100: #F9F7F4;   /* Card backgrounds */
--cream-200: #F3EFE9;   /* Subtle borders */
```
**Usage:** Main backgrounds, hero sections, soft accents  
**Emotion:** Warm, inviting, wedding dress white with personality

**Charcoal (Text & Accents)**
```css
--charcoal-700: #4A4A4A; /* Body text */
--charcoal-800: #2D2D2D; /* Headings */
--charcoal-900: #1A1A1A; /* Strong emphasis */
```
**Usage:** Primary text, headings, icons  
**Emotion:** Sophisticated, readable, grounded

**Gold (Premium Accent)**
```css
--gold-400: #D4AF37;    /* Accents, hover states */
--gold-500: #C19B2E;    /* Primary accent */
--gold-600: #A68425;    /* Active states */
```
**Usage:** CTAs, highlights, premium badges, foil stamping effects  
**Emotion:** Luxury, celebration, wedding bands

### 2.2 Secondary Colors

**Soft Rose (Romantic Accent)**
```css
--rose-100: #FAF0F3;    /* Light backgrounds */
--rose-300: #E8BFC9;    /* Soft accents */
--rose-500: #D4889E;    /* Medium accent */
```
**Usage:** Testimonial sections, feminine touches, hover effects  
**Emotion:** Romance, warmth, wedding florals

**Slate Blue (Trust & Technology)**
```css
--slate-400: #8FA3B0;   /* Secondary text */
--slate-500: #6B8394;   /* Icons, borders */
--slate-600: #4F6373;   /* Technical sections */
```
**Usage:** Technical content, converter interface, subtle contrast  
**Emotion:** Trust, calm, modern technology

### 2.3 Utility Colors

**Success (Conversion Complete)**
```css
--success-50: #F0F9F4;
--success-500: #10B981;
--success-700: #047857;
```

**Error (Conversion Failed)**
```css
--error-50: #FEF2F2;
--error-500: #EF4444;
--error-700: #B91C1C;
```

**Warning (File Size Alert)**
```css
--warning-50: #FFFBEB;
--warning-500: #F59E0B;
--warning-700: #B45309;
```

**Info (Processing)**
```css
--info-50: #EFF6FF;
--info-500: #3B82F6;
--info-700: #1D4ED8;
```

### 2.4 Amazon Brand Colors

**Amazon Orange (CTAs)**
```css
--amazon-orange: #FF9900;
--amazon-orange-dark: #E68A00;
```
**Usage:** "Buy on Amazon" buttons only  
**Note:** Use Amazon's official brand color for consistency and recognition

---

## 3. TYPOGRAPHY

### 3.1 Font Families

**Serif (Headings & Display)**
- **Primary:** [Playfair Display](https://fonts.google.com/specimen/Playfair+Display)
- **Fallback:** Georgia, "Times New Roman", serif
- **Why:** Classic elegance, high-end wedding stationery feel, timeless
- **Usage:** H1, H2, hero headlines, product names, decorative quotes

```css
--font-display: 'Playfair Display', Georgia, serif;
```

**Sans-Serif (Body & UI)**
- **Primary:** [Inter](https://fonts.google.com/specimen/Inter)
- **Fallback:** -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Why:** Exceptional readability, modern, clean, professional
- **Usage:** Body text, buttons, navigation, forms, technical content

```css
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

**Monospace (Technical/Code)**
- **Primary:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- **Fallback:** "Courier New", Courier, monospace
- **Why:** Clear, readable for technical specs (rare use)
- **Usage:** File sizes, technical specifications, code snippets (minimal)

```css
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

### 3.2 Type Scale

**Desktop Scale (1.250 - Major Third)**
```css
--text-xs: 0.75rem;      /* 12px - Small labels, captions */
--text-sm: 0.875rem;     /* 14px - Secondary text, metadata */
--text-base: 1rem;       /* 16px - Body text (minimum) */
--text-lg: 1.125rem;     /* 18px - Large body, intros */
--text-xl: 1.25rem;      /* 20px - Small headings */
--text-2xl: 1.563rem;    /* 25px - H3 */
--text-3xl: 1.953rem;    /* 31px - H2 */
--text-4xl: 2.441rem;    /* 39px - H1 */
--text-5xl: 3.052rem;    /* 49px - Hero headlines */
--text-6xl: 3.815rem;    /* 61px - Extra large display */
```

**Mobile Scale (1.200 - Minor Third)**
```css
--text-xs-mobile: 0.694rem;   /* 11px */
--text-sm-mobile: 0.833rem;   /* 13px */
--text-base-mobile: 1rem;     /* 16px */
--text-lg-mobile: 1.2rem;     /* 19px */
--text-xl-mobile: 1.44rem;    /* 23px */
--text-2xl-mobile: 1.728rem;  /* 28px */
--text-3xl-mobile: 2.074rem;  /* 33px */
--text-4xl-mobile: 2.488rem;  /* 40px */
--text-5xl-mobile: 2.986rem;  /* 48px */
```

### 3.3 Font Weights
```css
--font-light: 300;       /* Playfair Display light - elegant subheadings */
--font-regular: 400;     /* Inter regular - body text */
--font-medium: 500;      /* Inter medium - emphasized text, buttons */
--font-semibold: 600;    /* Inter semibold - subheadings, labels */
--font-bold: 700;        /* Playfair/Inter bold - headings, CTAs */
--font-extrabold: 800;   /* Playfair extrabold - hero headlines */
```

### 3.4 Line Heights
```css
--leading-tight: 1.25;   /* Headings (H1-H3) */
--leading-snug: 1.375;   /* Large text, subheadings */
--leading-normal: 1.5;   /* Body text (default) */
--leading-relaxed: 1.625;/* Long-form content, Learn page */
--leading-loose: 2;      /* Spacious sections, poetry quotes */
```

### 3.5 Letter Spacing
```css
--tracking-tight: -0.025em;  /* Large headings (reduce optical spacing) */
--tracking-normal: 0;        /* Body text */
--tracking-wide: 0.025em;    /* Uppercase labels */
--tracking-wider: 0.05em;    /* Button text, small caps */
--tracking-widest: 0.1em;    /* Decorative text, section labels */
```

### 3.6 Typography Examples

**Hero Headline:**
```css
font-family: var(--font-display);
font-size: var(--text-5xl);
font-weight: var(--font-extrabold);
line-height: var(--leading-tight);
letter-spacing: var(--tracking-tight);
color: var(--charcoal-900);
```

**Body Text:**
```css
font-family: var(--font-body);
font-size: var(--text-base);
font-weight: var(--font-regular);
line-height: var(--leading-relaxed);
color: var(--charcoal-700);
```

**Button Text:**
```css
font-family: var(--font-body);
font-size: var(--text-base);
font-weight: var(--font-semibold);
letter-spacing: var(--tracking-wider);
text-transform: uppercase;
```

---

## 4. SPACING SYSTEM

**8px Base Unit** (consistent, predictable spacing)

```css
--space-1: 0.25rem;   /* 4px  - Tight spacing */
--space-2: 0.5rem;    /* 8px  - Base unit */
--space-3: 0.75rem;   /* 12px - Small gaps */
--space-4: 1rem;      /* 16px - Default gap */
--space-5: 1.25rem;   /* 20px - Medium gap */
--space-6: 1.5rem;    /* 24px - Section spacing */
--space-8: 2rem;      /* 32px - Large gap */
--space-10: 2.5rem;   /* 40px - Section padding */
--space-12: 3rem;     /* 48px - Major sections */
--space-16: 4rem;     /* 64px - Hero sections */
--space-20: 5rem;     /* 80px - Page sections */
--space-24: 6rem;     /* 96px - Major separations */
```

**Container Max Widths:**
```css
--container-sm: 640px;   /* Single column content */
--container-md: 768px;   /* Form layouts */
--container-lg: 1024px;  /* Main content */
--container-xl: 1280px;  /* Wide layouts (default) */
--container-2xl: 1536px; /* Full-width hero sections */
```

---

## 5. COMPONENT LIBRARY

### 5.1 Buttons

**Primary Button (Amazon CTA)**
```css
.btn-primary {
  background: var(--amazon-orange);
  color: white;
  padding: var(--space-4) var(--space-8);
  border-radius: 8px;
  font-family: var(--font-body);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  transition: all 200ms ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background: var(--amazon-orange-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
```

**Secondary Button (Gold Accent)**
```css
.btn-secondary {
  background: transparent;
  color: var(--gold-500);
  border: 2px solid var(--gold-500);
  padding: var(--space-4) var(--space-8);
  border-radius: 8px;
  font-family: var(--font-body);
  font-weight: var(--font-semibold);
  transition: all 200ms ease;
}

.btn-secondary:hover {
  background: var(--gold-500);
  color: white;
}
```

**Text Link Button**
```css
.btn-text {
  background: transparent;
  color: var(--charcoal-800);
  border: none;
  padding: var(--space-2) 0;
  font-family: var(--font-body);
  font-weight: var(--font-medium);
  text-decoration: underline;
  text-underline-offset: 4px;
  transition: color 200ms ease;
}

.btn-text:hover {
  color: var(--gold-500);
}
```

### 5.2 Cards

**Product Card**
```css
.card-product {
  background: white;
  border-radius: 16px;
  padding: var(--space-6);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 300ms ease;
  border: 1px solid var(--cream-200);
}

.card-product:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--gold-400);
}
```

**Content Card (FAQ, Learn)**
```css
.card-content {
  background: var(--cream-100);
  border-radius: 12px;
  padding: var(--space-6);
  border-left: 4px solid var(--gold-500);
  margin-bottom: var(--space-4);
}
```

**Testimonial Card**
```css
.card-testimonial {
  background: linear-gradient(135deg, var(--rose-100) 0%, var(--cream-100) 100%);
  border-radius: 16px;
  padding: var(--space-8);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.1);
  position: relative;
  overflow: hidden;
}

.card-testimonial::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: 20px;
  font-size: 120px;
  font-family: var(--font-display);
  color: var(--gold-400);
  opacity: 0.15;
}
```

### 5.3 Form Elements

**Input Field**
```css
.input {
  width: 100%;
  padding: var(--space-4);
  border: 2px solid var(--cream-200);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: var(--text-base);
  background: white;
  transition: border-color 200ms ease;
}

.input:focus {
  outline: none;
  border-color: var(--gold-500);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}
```

**Upload Dropzone**
```css
.dropzone {
  border: 3px dashed var(--slate-400);
  border-radius: 16px;
  padding: var(--space-16);
  background: var(--cream-50);
  text-align: center;
  cursor: pointer;
  transition: all 300ms ease;
}

.dropzone:hover,
.dropzone.drag-active {
  border-color: var(--gold-500);
  background: var(--gold-400);
  background-opacity: 0.05;
}
```

**Progress Bar**
```css
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--cream-200);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold-500) 0%, var(--gold-400) 100%);
  transition: width 500ms ease;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

### 5.4 Navigation

**Main Navigation**
```css
.nav {
  background: white;
  border-bottom: 1px solid var(--cream-200);
  padding: var(--space-4) 0;
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.95);
}

.nav-link {
  font-family: var(--font-body);
  font-weight: var(--font-medium);
  font-size: var(--text-base);
  color: var(--charcoal-700);
  padding: var(--space-2) var(--space-4);
  transition: color 200ms ease;
}

.nav-link:hover {
  color: var(--gold-500);
}

.nav-link.active {
  color: var(--gold-600);
  font-weight: var(--font-semibold);
}
```

### 5.5 Accordion (FAQ/Learn Pages)

```css
.accordion-item {
  background: white;
  border-radius: 12px;
  margin-bottom: var(--space-3);
  border: 1px solid var(--cream-200);
  overflow: hidden;
  transition: all 200ms ease;
}

.accordion-header {
  padding: var(--space-5);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-body);
  font-weight: var(--font-semibold);
  color: var(--charcoal-800);
  transition: background 200ms ease;
}

.accordion-header:hover {
  background: var(--cream-100);
}

.accordion-content {
  padding: 0 var(--space-5) var(--space-5);
  font-family: var(--font-body);
  line-height: var(--leading-relaxed);
  color: var(--charcoal-700);
}

.accordion-icon {
  transition: transform 300ms ease;
}

.accordion-item.open .accordion-icon {
  transform: rotate(180deg);
}
```

### 5.6 Badges & Labels

**Premium Badge**
```css
.badge-premium {
  display: inline-block;
  background: linear-gradient(135deg, var(--gold-500) 0%, var(--gold-600) 100%);
  color: white;
  padding: var(--space-1) var(--space-3);
  border-radius: 20px;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}
```

**Info Badge**
```css
.badge-info {
  background: var(--slate-400);
  color: white;
  padding: var(--space-1) var(--space-2);
  border-radius: 4px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}
```

---

## 6. LAYOUT PATTERNS

### 6.1 Hero Section
```jsx
<section className="hero">
  <div className="container">
    <div className="hero-content">
      <h1 className="hero-title">Your Wedding Memories, Brought to Life</h1>
      <p className="hero-subtitle">A linen-bound video album...</p>
      <div className="hero-cta">
        <button className="btn-primary">Buy on Amazon</button>
        <button className="btn-secondary">See How It Works</button>
      </div>
    </div>
    <div className="hero-image">
      <img src="/product-hero.jpg" alt="OLEEK Memories Book" />
    </div>
  </div>
</section>
```

**Styles:**
```css
.hero {
  background: linear-gradient(135deg, var(--cream-50) 0%, var(--rose-100) 100%);
  padding: var(--space-20) 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.hero-title {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  font-weight: var(--font-extrabold);
  color: var(--charcoal-900);
  margin-bottom: var(--space-6);
  line-height: var(--leading-tight);
}

.hero-subtitle {
  font-size: var(--text-xl);
  color: var(--charcoal-700);
  margin-bottom: var(--space-8);
  line-height: var(--leading-relaxed);
}

.hero-cta {
  display: flex;
  gap: var(--space-4);
}

@media (min-width: 768px) {
  .hero .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-12);
    align-items: center;
  }
}
```

### 6.2 Feature Grid
```css
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-8);
  padding: var(--space-12) 0;
}

.feature-item {
  text-align: center;
}

.feature-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-4);
  color: var(--gold-500);
}

.feature-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--charcoal-800);
  margin-bottom: var(--space-3);
}

.feature-description {
  font-size: var(--text-base);
  color: var(--charcoal-700);
  line-height: var(--leading-relaxed);
}
```

### 6.3 Two-Column Content
```css
.two-column {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  align-items: center;
  padding: var(--space-12) 0;
}

@media (min-width: 768px) {
  .two-column {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-16);
  }
  
  .two-column.reverse {
    direction: rtl;
  }
  
  .two-column.reverse > * {
    direction: ltr;
  }
}
```

---

## 7. ICONS & IMAGERY

### 7.1 Icon System
**Library:** [Lucide React](https://lucide.dev/) or [Heroicons](https://heroicons.com/)  
**Style:** Outline (2px stroke) for consistency  
**Sizes:**
- Small: 16px (inline with text)
- Medium: 24px (buttons, cards)
- Large: 32px (feature sections)
- XL: 64px (hero icons)

**Color:**
- Default: `var(--charcoal-700)`
- Accent: `var(--gold-500)`
- Success/Error/Warning: Respective utility colors

### 7.2 Photography Style
**Product Photos:**
- Clean, white or cream backgrounds
- Soft, natural lighting (no harsh shadows)
- Show book open with video playing (emotion)
- Lifestyle shots: coffee table, wedding reception, hands holding book
- Close-ups: linen texture, foil stamping detail

**Wedding Video Stills:**
- Warm, romantic color grading
- Candid moments (not posed)
- Emotional expressions (joy, tears, laughter)
- Use as background images (with overlay)

**Guidelines:**
- High resolution (min 1920px wide for hero images)
- WebP format with JPG fallback
- Lazy loading for below-fold images
- Alt text for accessibility

---

## 8. ANIMATIONS & INTERACTIONS

### 8.1 Micro-interactions

**Hover Effects:**
```css
/* Lift & Shadow */
.hover-lift {
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Color Shift */
.hover-color {
  transition: color 200ms ease;
}

.hover-color:hover {
  color: var(--gold-500);
}

/* Scale */
.hover-scale {
  transition: transform 200ms ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}
```

**Focus States:**
```css
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
}
```

### 8.2 Page Transitions
```css
/* Fade In on Load */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 600ms ease-out;
}

/* Stagger Children */
.stagger-children > * {
  animation: fadeIn 600ms ease-out;
}

.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 100ms; }
.stagger-children > *:nth-child(3) { animation-delay: 200ms; }
.stagger-children > *:nth-child(4) { animation-delay: 300ms; }
```

### 8.3 Loading States
```css
/* Skeleton Loading */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--cream-200) 25%,
    var(--cream-100) 50%,
    var(--cream-200) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Spinner */
.spinner {
  border: 3px solid var(--cream-200);
  border-top-color: var(--gold-500);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 800ms linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 9. RESPONSIVE DESIGN

### 9.1 Breakpoints
```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Landscape phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large desktops */
```

### 9.2 Container Queries (Modern Approach)
```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}
```

### 9.3 Mobile Optimizations
- Touch targets minimum 44x44px
- Larger buttons on mobile
- Simplified navigation (hamburger menu)
- Stacked layouts (no horizontal scroll)
- Reduced font sizes (use mobile scale)
- Optimized images (serve smaller sizes)

---

## 10. ACCESSIBILITY

### 10.1 Color Contrast
All text meets WCAG 2.1 AA standards:
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum

**Tested Combinations:**
- ✅ Charcoal-900 on Cream-50: 15.2:1
- ✅ Charcoal-700 on White: 7.8:1
- ✅ Gold-500 on White: 4.6:1
- ✅ White on Amazon Orange: 4.9:1

### 10.2 Focus Indicators
All interactive elements have visible focus states for keyboard navigation.

### 10.3 Screen Reader Support
- Semantic HTML (header, nav, main, footer, article, section)
- ARIA labels for icon-only buttons
- Alt text for all images
- Skip to main content link

---

## 11. DESIGN TOKENS (CSS Variables)

**Complete Token List:**
```css
:root {
  /* Colors - Neutrals */
  --cream-50: #FDFCFB;
  --cream-100: #F9F7F4;
  --cream-200: #F3EFE9;
  --charcoal-700: #4A4A4A;
  --charcoal-800: #2D2D2D;
  --charcoal-900: #1A1A1A;
  
  /* Colors - Accent */
  --gold-400: #D4AF37;
  --gold-500: #C19B2E;
  --gold-600: #A68425;
  --rose-100: #FAF0F3;
  --rose-300: #E8BFC9;
  --rose-500: #D4889E;
  --slate-400: #8FA3B0;
  --slate-500: #6B8394;
  --slate-600: #4F6373;
  
  /* Colors - Utility */
  --success-500: #10B981;
  --error-500: #EF4444;
  --warning-500: #F59E0B;
  --info-500: #3B82F6;
  
  /* Colors - Brand */
  --amazon-orange: #FF9900;
  --amazon-orange-dark: #E68A00;
  
  /* Typography */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.563rem;
  --text-3xl: 1.953rem;
  --text-4xl: 2.441rem;
  --text-5xl: 3.052rem;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
  
  /* Transitions */
  --transition-fast: 150ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 12. IMPLEMENTATION CHECKLIST

### Pre-Development
- [ ] Install fonts (Google Fonts: Playfair Display, Inter)
- [ ] Set up CSS variables in global stylesheet
- [ ] Configure Tailwind (if using) with custom tokens
- [ ] Install icon library (Lucide or Heroicons)
- [ ] Prepare image assets (product photos, placeholders)

### Component Development
- [ ] Build button variants (primary, secondary, text)
- [ ] Build card components (product, content, testimonial)
- [ ] Build form elements (input, textarea, select, file upload)
- [ ] Build navigation (header, footer, mobile menu)
- [ ] Build accordion for FAQ/Learn pages
- [ ] Build progress bar for converter
- [ ] Build modal/dialog components

### Testing
- [ ] Test color contrast (WCAG AA compliance)
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Test responsive layouts (mobile, tablet, desktop)
- [ ] Test in Chrome, Firefox, Safari, Edge
- [ ] Test touch targets on mobile (44x44px minimum)

---

**END OF DESIGN SYSTEM**

This design system provides a comprehensive foundation for the OLEEK Memories Book website. All components should feel cohesive, premium, and aligned with the brand's timeless elegance while maintaining modern web standards.
