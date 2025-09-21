from django.contrib import admin
from .models import CustomUser


# Register all models in a single line
admin.site.register(CustomUser)
# admin.site.site_header = "EasyHisab Admin"
# admin.site.site_title = "EasyHisab Admin Portal"
