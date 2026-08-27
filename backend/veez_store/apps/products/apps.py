"""
App configuration for products.
"""

from django.apps import AppConfig


class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'veez_store.apps.products'
    verbose_name = 'Products'
