from django.contrib import admin
from .models import Setting


# Register all models in a single line
admin.site.register(Setting)
# admin.site.site_header = "EasyHisab Admin"
# admin.site.site_title = "EasyHisab Admin Portal"
