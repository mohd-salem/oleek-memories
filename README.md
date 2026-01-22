# OLEEK Memories Book Website

Marketing website for OLEEK Memories Book with integrated video conversion tool.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
# Create optimized production build
npm run build

# Run production server locally
npm start
```

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with fonts & metadata
│   ├── page.tsx             # Home page
│   ├── convert/page.tsx     # Video converter tool
│   ├── learn/page.tsx       # Loading guide
│   ├── faq/page.tsx         # FAQ with accordion
│   ├── terms/page.tsx       # Terms & conditions
│   ├── contact/page.tsx     # Contact page
│   ├── error.tsx            # Error boundary
│   ├── not-found.tsx        # 404 page
│   └── loading.tsx          # Loading fallback
├── components/
│   ├── convert/             # Video conversion components
│   │   ├── ConvertPageClient.tsx
│   │   ├── FileUploader.tsx
│   │   ├── ConversionProgress.tsx
│   │   ├── DownloadResult.tsx
│   │   ├── PrivacyBadge.tsx
│   │   ├── TechnicalSpecs.tsx
│   │   └── SupportedFormats.tsx
│   ├── home/                # Home page sections
│   │   ├── Hero.tsx
│   │   ├── FeatureGrid.tsx
│   │   ├── ProductVersions.tsx
│   │   ├── Testimonials.tsx
│   │   └── ConverterCTA.tsx
│   ├── layout/              # Site-wide layout
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── shared/              # Shared utilities
│   │   ├── Container.tsx
│   │   └── SectionHeading.tsx
│   └── ui/                  # UI component library
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       └── Accordion.tsx
├── lib/
│   ├── converter/           # Video conversion logic
│   │   ├── video-converter.ts
│   │   ├── ffmpeg-loader.ts
│   │   └── video-validator.ts
│   ├── constants/           # App constants
│   │   ├── device-specs.ts
│   │   └── supported-formats.ts
│   └── utils/
│       └── analytics.ts     # Analytics tracking
└── types/
    └── conversion.ts        # TypeScript types
```

## 🎨 Design System

### Colors
- **Cream**: Background (#FDFCFB, #F8F6F4)
- **Charcoal**: Text (#2D2D2D, #1A1A1A)
- **Gold**: Premium accents (#C19B2E, #A68425)
- **Rose**: Highlights (#D4889E, #B56F85)
- **Slate**: Secondary text (#6B8394, #556875)
- **Amazon**: CTA buttons (#FF9900)

### Typography
- **Headings**: Playfair Display (serif, 400/700/800)
- **Body**: Inter (sans-serif, 400/500/600/700)
- **Scale**: Major Third ratio (1.125x)

## 🔧 Key Technologies

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS 3.4
- **Video Conversion**: ffmpeg.wasm (client-side, ~30MB lazy-loaded)
- **File Upload**: react-dropzone
- **Icons**: lucide-react
- **Language**: TypeScript 5+

## 🎥 Video Conversion

The converter runs **entirely in the browser** using WebAssembly:

1. No server uploads (privacy-first)
2. ffmpeg.wasm lazy-loads only when needed
3. Automatic optimization for OLEEK device specs:
   - Codec: H.264
   - Resolution: 1080p max
   - Bitrate: 5 Mbps video, 128k audio
   - Frame rate: 30fps
   - Aspect ratio: 16:9 (letterboxed)

### Supported Input Formats
MP4, MOV, AVI, MKV, WMV, M4V, FLV, WebM

## 📊 Analytics

Analytics tracking is implemented for:
- Amazon CTA clicks
- Conversion workflow (started/completed/failed)
- Download events
- Page views

Configure your analytics providers in:
- Google Analytics: Add `gtag.js` to `app/layout.tsx`
- Meta Pixel: Add `fbq` script to `app/layout.tsx`

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your Git repository to Vercel dashboard for automatic deployments.

### Other Platforms

Build the static site:
```bash
npm run build
```

Deploy the `.next` folder to any Node.js hosting platform.

## 🔍 SEO Features

- Dynamic `sitemap.xml` generation
- Robots.txt configuration
- OpenGraph & Twitter Cards metadata
- JSON-LD structured data (Product, FAQ schemas)
- Semantic HTML throughout
- Accessibility-first design

## 📝 Environment Variables

Create `.env.local` for local development:

```env
# Optional: Analytics IDs
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXX

# Optional: Contact form endpoint
NEXT_PUBLIC_CONTACT_EMAIL=support@oleek.com
```

## 🧪 Testing Checklist

Before deploying:
- [ ] Test video conversion with various formats
- [ ] Test on mobile devices (responsive design)
- [ ] Verify all internal links work
- [ ] Check Amazon affiliate links
- [ ] Test error states (404, conversion errors)
- [ ] Verify ffmpeg.wasm loads properly
- [ ] Check Lighthouse scores (Performance, SEO, A11y)
- [ ] Test with large video files (1GB+)

## 📄 License

Proprietary - OLEEK Memories Book

## 🆘 Support

For questions or issues:
- Email: support@oleek.com
- Website: [https://oleek.com](https://oleek.com)

---

Built with ❤️ for preserving wedding memories
