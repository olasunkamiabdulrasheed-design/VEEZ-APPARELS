"""
Production Django settings for Veez Apparels.
"""

from .base import *

DEBUG = False

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_SECURITY_POLICY = {
    'default-src': ("'self'",),
    'script-src': ("'self'", "'unsafe-inline'"),
    'style-src': ("'self'", "'unsafe-inline'"),
}

# Allowed hosts must be set via environment
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

# Database should use PostgreSQL in production
DATABASES['default']['CONN_MAX_AGE'] = 600
