# Veez Apparels - Deployment Guide

## 🚀 Production Deployment

Complete step-by-step guide to deploy Veez Apparels to production.

### Prerequisites
- GitHub account with repository access
- PostgreSQL database
- AWS account (or equivalent S3 provider for media files)
- Email service account (SendGrid, AWS SES, etc.)
- Hosting platform account (Render, Railway, Heroku, etc.)

---

## Backend Deployment (Django)

### Option 1: Deploy to Render

#### Step 1: Prepare Backend

```bash
cd backend

# Create .env.production file
cat > .env.production << EOF
DJANGO_SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_NAME=veez_apparels_db
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_HOST=your-db-host.com
DB_PORT=5432
WHATSAPP_BUSINESS_NUMBER=+234xxxxxxxxxx
BUSINESS_EMAIL=info@veezapparels.com
BUSINESS_PHONE=+234xxxxxxxxxx
BUSINESS_ADDRESS=Lagos, Nigeria
INSTAGRAM_URL=https://instagram.com/veezapparels
FACEBOOK_URL=https://facebook.com/veezapparels
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
DEFAULT_DELIVERY_FEE=5000
CURRENCY=NGN
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_STORAGE_BUCKET_NAME=veez-apparels-media
AWS_S3_REGION_NAME=us-east-1
EOF
```

#### Step 2: Create Procfile

```bash
cat > Procfile << EOF
web: gunicorn veez_store.wsgi --log-file -
release: python manage.py migrate
EOF
```

#### Step 3: Update requirements.txt

```bash
# Add to requirements.txt
gunicorn==21.2.0
whitenoise==6.5.0
django-storages==1.14.2
boto3==1.26.137
psycopg2-binary==2.9.6
```

#### Step 4: Push to GitHub

```bash
git add .
git commit -m "Production deployment configuration"
git push origin master
```

#### Step 5: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect GitHub repository
5. Configure:
   - Name: `veez-apparels-api`
   - Environment: `Python 3.11`
   - Build Command: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --no-input`
   - Start Command: `gunicorn veez_store.wsgi`
6. Add environment variables from .env.production
7. Click "Create Web Service"

### Option 2: Deploy to Railway

1. Go to https://railway.app
2. Click "New Project" → "GitHub Repo"
3. Select your repository
4. Configure variables
5. Railway auto-detects Django and deploys

### Option 3: Deploy to Heroku

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create veez-apparels-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set DJANGO_SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS=veez-apparels-api.herokuapp.com

# Deploy
git push heroku master

# Run migrations
heroku run python manage.py migrate
```

---

## Frontend Deployment (React)

### Option 1: Deploy to Vercel (Recommended)

#### Step 1: Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub

#### Step 2: Configure Environment
```bash
cd frontend

cat > .env.production << EOF
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_APP_NAME=Veez Apparels
EOF
```

#### Step 3: Import Project
1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Framework: Vite
4. Root Directory: `./frontend`
5. Build Command: `npm run build`
6. Output Directory: `dist`

#### Step 4: Add Environment Variables
- Add `VITE_API_BASE_URL` with backend URL
- Add `VITE_APP_NAME` with app name

#### Step 5: Deploy
- Click "Deploy"
- Vercel automatically deploys on git push

### Option 2: Deploy to Netlify

1. Go to https://netlify.com
2. Click "New site from Git"
3. Select your repository
4. Build Command: `npm run build`
5. Publish Directory: `dist`
6. Add environment variables
7. Click "Deploy site"

### Option 3: Deploy to AWS S3 + CloudFront

```bash
# Build
npm run build

# Create S3 bucket
aws s3 mb s3://veez-apparels-web

# Upload files
aws s3 sync dist/ s3://veez-apparels-web --delete

# Create CloudFront distribution
# (Use AWS Console)

# Update DNS
# Point yourdomain.com to CloudFront distribution
```

---

## Database Setup

### PostgreSQL on AWS RDS

1. Go to AWS RDS Console
2. Click "Create database"
3. Engine: PostgreSQL 14+
4. DB instance class: db.t3.micro (free tier)
5. Allocated storage: 20 GB
6. DB name: `veez_apparels`
7. Master username: `postgres`
8. Create automated backups: Yes
9. Click "Create database"
10. Get endpoint from Database Details
11. Add to backend .env

### Heroku PostgreSQL
Already included in Heroku deployment

### Railway PostgreSQL
Automatically provisioned

---

## Media Storage (AWS S3)

### Step 1: Create S3 Bucket

```bash
aws s3 mb s3://veez-apparels-media
```

### Step 2: Create IAM User

1. Go to IAM Console
2. Create user: `veez-apparels`
3. Attach policy: `AmazonS3FullAccess`
4. Get Access Key ID and Secret Access Key
5. Add to backend .env

### Step 3: Configure Django

```python
# settings.py
if not DEBUG:
    # S3 Configuration
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
```

---

## Email Configuration

### Using SendGrid

```bash
# Install
pip install sendgrid-django

# settings.py
EMAIL_BACKEND = "sendgrid_backend.SendgridBackend"
SENDGRID_SANDBOX_MODE_IN_DEBUG = False
SENDGRID_API_KEY = env('SENDGRID_API_KEY')
```

### Using AWS SES

```bash
# Install
pip install django-ses

# settings.py
EMAIL_BACKEND = 'django_ses.SESBackend'
AWS_SES_REGION_NAME = 'us-east-1'
AWS_SES_REGION_ENDPOINT = 'email.us-east-1.amazonaws.com'
```

---

## SSL/HTTPS Setup

### Automatic (Render, Vercel, Netlify)
Automatically configured with Let's Encrypt

### Manual (Custom Domain)
1. Request SSL certificate
2. Upload to server
3. Configure web server to use it

---

## Post-Deployment Checklist

### Database
- [ ] Database created and accessible
- [ ] Migrations run successfully
- [ ] Initial data loaded (products, categories)

### Backend
- [ ] API endpoints accessible
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Static files serving
- [ ] Media files uploading to S3

### Frontend
- [ ] Build completes without errors
- [ ] App loads on domain
- [ ] API calls work
- [ ] Environment variables correct
- [ ] WhatsApp integration functional

### Security
- [ ] DEBUG = False
- [ ] SECRET_KEY is random and strong
- [ ] ALLOWED_HOSTS configured
- [ ] HTTPS enforced
- [ ] CORS_ALLOWED_ORIGINS correct
- [ ] SQL injection protection verified
- [ ] XSS protection enabled

### Functionality
- [ ] User can browse products
- [ ] Search and filtering work
- [ ] Add to cart functions
- [ ] Checkout completes
- [ ] Orders created in database
- [ ] WhatsApp messages send
- [ ] Email notifications work
- [ ] File uploads (bespoke images) work

### Performance
- [ ] Frontend loads fast (< 3s)
- [ ] API responds quickly (< 500ms)
- [ ] Images optimized
- [ ] Database queries indexed
- [ ] CDN caching configured

### Monitoring
- [ ] Error logging enabled
- [ ] Uptime monitoring active
- [ ] Database backups scheduled
- [ ] Log aggregation set up
- [ ] Alerts configured

---

## Custom Domain Setup

### Update DNS Records

```
CNAME/A Record pointing to your hosting provider:
yourdomain.com → your-backend.render.com (backend)
www.yourdomain.com → your-frontend-domain.vercel.app (frontend)
```

### Alternative Subdomains

```
api.yourdomain.com → backend
app.yourdomain.com → frontend
admin.yourdomain.com → Django admin
```

---

## Environment Variables Reference

### Backend (.env)
```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_NAME=veez_apparels
DB_USER=postgres
DB_PASSWORD=secure-password
DB_HOST=db-host.com
DB_PORT=5432
WHATSAPP_BUSINESS_NUMBER=+234xxxxxxxxxx
BUSINESS_EMAIL=info@veezapparels.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
DEFAULT_DELIVERY_FEE=5000
CURRENCY=NGN
AWS_ACCESS_KEY_ID=key
AWS_SECRET_ACCESS_KEY=secret
AWS_STORAGE_BUCKET_NAME=bucket-name
SENDGRID_API_KEY=key
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=Veez Apparels
```

---

## Troubleshooting

### API Calls Fail (CORS Error)
- Check CORS_ALLOWED_ORIGINS in backend .env
- Ensure frontend domain is included
- Restart backend after changing

### Database Connection Error
- Verify DB_HOST, DB_NAME, DB_USER credentials
- Check security groups/firewall rules
- Ensure database is running

### Static Files Not Loading
- Run `python manage.py collectstatic`
- Verify AWS S3 bucket permissions
- Check STATIC_URL configuration

### WhatsApp Messages Not Sending
- Verify WHATSAPP_BUSINESS_NUMBER is correct
- Check message format
- Test with curl command

### Build Fails
- Check build logs on hosting platform
- Verify all environment variables set
- Ensure no secrets in code
- Run build locally first

---

## Scaling Considerations

### Database
- Add read replicas for heavy traffic
- Enable automated backups
- Set up replication
- Monitor query performance

### Backend
- Use load balancer (multiple instances)
- Enable caching (Redis)
- Optimize database queries
- Implement rate limiting

### Frontend
- Use CDN (CloudFlare, AWS CloudFront)
- Enable gzip compression
- Lazy load images
- Code splitting

### Infrastructure
- Auto-scaling groups
- Database connection pooling
- Message queues (Celery)
- Background jobs

---

## Backup & Recovery

### Database Backups
- Automated daily backups
- Keep 30-day retention
- Test restore procedures
- Store backups in different region

### File Backups
- S3 versioning enabled
- Cross-region replication
- Regular download backups
- Document restore process

---

## Support & Monitoring

### Error Tracking
- Set up Sentry or similar
- Alert on critical errors
- Track error patterns

### Performance Monitoring
- Use DataDog, New Relic, or similar
- Monitor API response times
- Track database performance
- Alert on threshold breaches

### Logs
- Centralized logging (ELK, CloudWatch)
- Retain logs for 30 days
- Regular log analysis
- Alert on error patterns

---

## Updates & Maintenance

### Regular Tasks
- Update dependencies monthly
- Security patches immediately
- Database maintenance weekly
- Log cleanup daily

### Testing in Production-Like Environment
- Staging environment mirrors production
- Test all changes there first
- Load test before major changes
- Have rollback plan

---

## Going Live Checklist

- [ ] All environment variables configured
- [ ] Database and migrations complete
- [ ] SSL/HTTPS working
- [ ] Domain pointing correctly
- [ ] API and frontend communicating
- [ ] Checkout flow tested end-to-end
- [ ] WhatsApp integration tested
- [ ] File uploads working
- [ ] Error handling verified
- [ ] Monitoring and alerts active
- [ ] Backup procedures tested
- [ ] Documentation updated
- [ ] Team trained on operations
- [ ] Support plan in place
- [ ] Announce to customers!

---

**🚀 Once all checks pass, you're ready to start taking orders!**
