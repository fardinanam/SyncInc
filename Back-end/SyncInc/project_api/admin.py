from django.contrib import admin
from .models import *

admin.site.register(Organization)
admin.site.register(Designation)
admin.site.register(Invitation)
admin.site.register(Vendor)
admin.site.register(Client)
admin.site.register(Project)
admin.site.register(UserTask)
admin.site.register(VendorTask)
admin.site.register(Message)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    def get_users(self, obj):
        return [user.username for user in obj.users.all()]

    list_display = ['name', 'get_users']