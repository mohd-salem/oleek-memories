# Deployment Guide - OLEEK Memories Book Website

## Pre-Deployment Checklist

### 1. Configuration
- [ ] Update Amazon affiliate link in `src/components/layout/Header.tsx`
- [ ] Update Amazon product link in `src/components/home/Hero.tsx`
- [ ] Set `NEXT_PUBLIC_SITE_URL` in production environment
- [ ] Configure analytics IDs (GA4, Meta Pixel) if using
- [ ] Update contact email in `src/app/contact/page.tsx`

### 2. Content Review
- [ ] Review all marketing copy for accuracy
- [ ] Verify product pricing matches Amazon listing
- [ ] Check testimonials are appropriate
- [ ] Ensure FAQ answers are current
- [ ] Verify device specifications match actual product

### 3. Testing
- [ ] Test video conversion with multiple formats (MP4, MOV, AVI, MKV)
- [ ] Test with large files (1GB+) to verify warnings
- [ ] Verify mobile responsive design (375px, 768px, 1024px)
- [ ] Test all navigation links
- [ ] Verify Amazon CTA links work and track correctly
- [ ] Test error states (404, conversion failures)
- [ ] Check accessibility (keyboard navigation, screen readers)
- [ ] Run Lighthouse audit (target: 90+ all categories)

---

## Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Zero-config deployment for Next.js
- Automatic HTTPS
- Global CDN
- Environment variable management
- Automatic deployments from Git

**Steps:**

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Deploy
   vercel
   ```

2. **Or via Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel auto-detects Next.js configuration
   - Click "Deploy"

3. **Set Environment Variables** (in Vercel Dashboard):
   ```
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX (optional)
   NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXX (optional)
   ```

4. **Custom Domain:**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions
   - Vercel provides automatic HTTPS

**Cost:** Free for personal/small projects

---

### Option 2: AWS Amplify

**Steps:**

1. **Connect Repository:**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" > "Host web app"
   - Connect your Git provider

2. **Build Settings:**
   Amplify auto-detects Next.js. Verify build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables:**
   Add in Amplify Console > App Settings > Environment variables

4. **Deploy:**
   - Automatic on every Git push
   - Custom domain configuration available

**Cost:** Pay-as-you-go (free tier available)

---

### Option 3: Netlify

**Steps:**

1. **Connect Repository:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import existing project"
   - Connect Git repository

2. **Build Settings:**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Install Next.js Plugin:**
   Netlify will prompt to install `@netlify/plugin-nextjs`

4. **Environment Variables:**
   Add in Site Settings > Environment variables

5. **Deploy:**
   Automatic on Git push

**Cost:** Free for personal sites

---

### Option 4: Cloudflare Pages

**Steps:**

1. **Create Project:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Pages > Create a project
   - Connect Git repository

2. **Build Configuration:**
   ```
   Framework: Next.js
   Build command: npx @cloudflare/next-on-pages@1
   Build output: .vercel/output/static
   ```

3. **Add `@cloudflare/next-on-pages`:**
   ```bash
   npm install --save-dev @cloudflare/next-on-pages
   ```

4. **Environment Variables:**
   Set in Pages project settings

**Cost:** Free (generous limits)

---

## Post-Deployment Tasks

### 1. Verify Deployment
- [ ] Site loads correctly at production URL
- [ ] HTTPS certificate is active
- [ ] All pages accessible (Home, Convert, Learn, FAQ, Terms, Contact)
- [ ] Video conversion works in production
- [ ] ffmpeg.wasm loads from CDN

### 2. SEO Setup
- [ ] Submit sitemap to Google Search Console: `https://your-domain.com/sitemap.xml`
- [ ] Verify robots.txt: `https://your-domain.com/robots.txt`
- [ ] Set up Google Search Console
- [ ] Submit to Bing Webmaster Tools (optional)

### 3. Analytics Setup
If using Google Analytics:
```tsx
// Add to src/app/layout.tsx in <head>
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
  `}
</Script>
```

If using Meta Pixel:
```tsx
// Add to src/app/layout.tsx in <head>
<Script id="facebook-pixel" strategy="afterInteractive">
  {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
    fbq('track', 'PageView');
  `}
</Script>
```

### 4. Performance Monitoring
- [ ] Set up Vercel Analytics (or equivalent)
- [ ] Monitor Web Vitals (LCP, FID, CLS)
- [ ] Track conversion completion rate
- [ ] Monitor error rates

### 5. Domain Configuration
- [ ] Configure custom domain
- [ ] Set up email forwarding (support@your-domain.com)
- [ ] Configure SPF/DKIM if sending emails

---

## Monitoring & Maintenance

### Weekly Tasks
- Check analytics for traffic patterns
- Monitor conversion success rate
- Review error logs
- Check Amazon affiliate performance

### Monthly Tasks
- Review and update FAQ based on support questions
- Update testimonials if new reviews available
- Check for broken links
- Review Core Web Vitals

### Quarterly Tasks
- Review and refresh marketing copy
- Update product images if needed
- Audit SEO performance
- Review competitor landscape

---

## Troubleshooting

### ffmpeg.wasm Not Loading
**Symptoms:** Conversion fails immediately
**Solution:**
- Check browser console for CORS errors
- Verify CDN is accessible (unpkg.com)
- Check SharedArrayBuffer headers in `next.config.js`

### Slow Build Times
**Symptoms:** Deployment takes >5 minutes
**Solution:**
- Verify `node_modules` is cached
- Check for large files in repository
- Consider enabling Vercel's Turbo mode

### Analytics Not Tracking
**Symptoms:** No events in analytics dashboard
**Solution:**
- Verify environment variables are set in production
- Check browser console for script errors
- Confirm ad blockers aren't interfering
- Check `trackEvent()` calls are firing

### Video Conversion Crashes Browser
**Symptoms:** Tab freezes or crashes during conversion
**Solution:**
- Add file size warnings (already implemented for 1GB+)
- Recommend closing other tabs (in UI tips)
- Consider adding file size limits (max 2GB)

---

## Rollback Procedure

If deployment has critical issues:

**Vercel:**
```bash
# List recent deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

**Via Dashboard:**
All platforms support instant rollback to previous deployments via their dashboards.

---

## Support

For deployment issues:
- **Vercel:** [vercel.com/support](https://vercel.com/support)
- **AWS Amplify:** AWS Support Console
- **Netlify:** [netlify.com/support](https://netlify.com/support)
- **Cloudflare:** Cloudflare Community or Support

For code issues:
- Check GitHub Issues
- Review Next.js documentation
- Check ffmpeg.wasm documentation

---

**Ready to deploy!** 🚀

Choose your platform and follow the steps above. Vercel is recommended for fastest deployment with zero configuration.
