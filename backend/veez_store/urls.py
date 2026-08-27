"""
Main URL Configuration for Veez Apparels.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', include('veez_store.apps.products.urls')),
    path('api/orders/', include('veez_store.apps.orders.urls')),
    path('api/bespoke/', include('veez_store.apps.bespoke.urls')),
    path('api/appointments/', include('veez_store.apps.appointments.urls')),
    path('api/core/', include('veez_store.apps.core.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # Debug toolbar
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        urlpatterns = [
            path('__debug__/', include('debug_toolbar.urls')),
        ] + urlpatterns
