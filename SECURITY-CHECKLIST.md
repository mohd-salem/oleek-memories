# Security Checklist - OLEEK Video Conversion

## ✅ Infrastructure Security

### S3 Buckets
- [x] Buckets are **private** (Block all public access enabled)
- [x] CORS configured with **specific allowed origins** (not wildcard)
- [x] Lifecycle policies enforce **24-hour auto-deletion**
- [x] Versioning disabled (reduces storage costs)
- [x] Server-side encryption enabled (AES-256)
- [x] Access logging enabled (audit trail)

### IAM Permissions
- [x] Least privilege principle: NextJS user only has S3 Get/Put + MediaConvert Create/GetJob
- [x] MediaConvert role only has S3 Get/Put on specific buckets
- [x] No wildcard (*) resource ARNs
- [x] Access keys stored in environment variables (never in code)
- [x] Access keys rotated every 90 days (set calendar reminder)

### API Routes
- [x] Server-side only (no client exposure of AWS credentials)
- [x] Input validation on all endpoints
- [x] File type validation (video/* only)
- [x] File size limits enforced (2GB max)
- [x] Sanitized filenames (prevent directory traversal)
- [ ] **TODO**: Rate limiting per IP (recommended: 10 uploads/hour)
- [ ] **TODO**: CAPTCHA on convert page (prevent bots)

## ✅ Data Privacy

### File Handling
- [x] Direct S3 upload (files never touch Next.js server)
- [x] Presigned URLs expire in 1 hour
- [x] Download URLs expire in 1 hour
- [x] Auto-deletion after 24 hours (S3 Lifecycle)
- [x] No server-side logging of video content
- [x] Unique file IDs (prevent enumeration)

### User Privacy
- [x] No user accounts required
- [x] No tracking pixels or analytics on convert page
- [x] No cookies stored
- [x] No IP logging (unless rate limiting added)
- [x] Privacy policy clearly states temporary processing

## ✅ Application Security

### Input Validation
- [x] File type whitelist (MP4, MOV, AVI, MKV, WebM, MPEG)
- [x] File size validation (max 2GB)
- [x] Filename sanitization (alphanumeric + underscore only)
- [x] Content-Type verification
- [x] Empty file rejection

### Error Handling
- [x] Generic error messages to users (no AWS error details)
- [x] Server-side error logging for debugging
- [x] No sensitive data in error responses
- [x] Graceful degradation on AWS failures

### Dependencies
- [x] AWS SDK official packages only
- [x] Regular `npm audit` checks
- [x] No deprecated packages
- [ ] **TODO**: Dependabot alerts enabled

## ⚠️ Production Hardening (TODO)

### Rate Limiting
```typescript
// Recommended: Add to API routes
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 uploads per hour
});

// In API route:
const { success } = await ratelimit.limit(ip);
if (!success) {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
}
```

### CAPTCHA Integration
```typescript
// Recommended: hCaptcha or Cloudflare Turnstile
import { verifyCaptcha } from '@/lib/captcha';

const isValid = await verifyCaptcha(captchaToken);
if (!isValid) {
  return NextResponse.json({ error: 'Invalid CAPTCHA' }, { status: 400 });
}
```

### Monitoring & Alerts
- [ ] CloudWatch alarms for failed MediaConvert jobs
- [ ] S3 bucket size alerts (detect cleanup failures)
- [ ] API error rate monitoring
- [ ] Cost anomaly detection

### DDoS Protection
- [ ] Cloudflare proxy (recommended)
- [ ] AWS WAF rules (if not using Cloudflare)
- [ ] Rate limiting at CDN level

## 🔒 Deployment Security

### Environment Variables
- [x] Never commit .env files to git
- [x] Use platform-specific secrets (Railway, Render, etc.)
- [x] Rotate AWS access keys every 90 days
- [ ] **TODO**: Enable AWS IAM access analyzer

### HTTPS/TLS
- [x] Enforce HTTPS in production
- [x] HSTS headers enabled
- [ ] **TODO**: Configure CSP headers

### Build Security
- [x] `.gitignore` includes .env files
- [x] No hardcoded secrets in code
- [ ] **TODO**: Pre-commit hooks for secret scanning

## 📋 Compliance

### GDPR Compliance
- [x] No personal data collected
- [x] Temporary processing clearly disclosed
- [x] Auto-deletion within 24 hours
- [x] No cross-border data transfer (single AWS region)

### User Rights
- [x] Right to deletion (automatic via lifecycle)
- [x] Data portability (user downloads their own file)
- [x] Transparency (privacy policy on convert page)

## 🚨 Incident Response

### If AWS Keys Compromised
1. Immediately delete access key in AWS Console
2. Create new access key
3. Update environment variables in production
4. Review CloudTrail logs for unauthorized access
5. Check S3 buckets for unexpected files
6. Rotate MediaConvert role credentials

### If Bucket Exposed
1. Enable "Block all public access" immediately
2. Review bucket policies and CORS config
3. Check S3 access logs for unauthorized access
4. Consider rotating all files (force re-upload)

### If MediaConvert Abused
1. Check CloudWatch Logs for job patterns
2. Enable rate limiting immediately
3. Add CAPTCHA if not present
4. Consider temporary service shutdown

## 📝 Regular Maintenance

### Weekly
- [ ] Check AWS billing for anomalies
- [ ] Review CloudWatch Logs for errors

### Monthly
- [ ] Audit S3 buckets for orphaned files
- [ ] Review IAM permissions
- [ ] Update dependencies (`npm audit fix`)

### Quarterly
- [ ] Rotate AWS access keys
- [ ] Review and update privacy policy
- [ ] Pen test convert workflow
- [ ] Load test MediaConvert capacity

---

**Last Updated**: January 2026
**Next Review**: April 2026
