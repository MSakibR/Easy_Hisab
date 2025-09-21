from django.contrib import admin
from .models import Invoice, InvoiceItem


# Register all models in a single line
admin.site.register([Invoice, InvoiceItem])
# admin.site.site_header = "EasyHisab Admin"
# admin.site.site_title = "EasyHisab Admin Portal"
