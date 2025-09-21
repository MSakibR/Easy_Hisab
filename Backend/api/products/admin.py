from django.contrib import admin
from .models import Products


# Register all models in a single line
admin.site.register(Products)
# admin.site.site_header = "EasyHisab Admin"
# admin.site.site_title = "EasyHisab Admin Portal"
