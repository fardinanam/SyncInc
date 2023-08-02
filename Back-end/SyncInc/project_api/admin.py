from django.contrib import admin
from .models import *

admin.site.register(Organization)
admin.site.register(Designation)
admin.site.register(Tag)
admin.site.register(Vendor)
admin.site.register(Client)
admin.site.register(Project)
admin.site.register(UserTask)
admin.site.register(VendorTask)
admin.site.register(Message)
