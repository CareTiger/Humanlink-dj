from django.contrib import admin

from account.models import Account, CareGiver


# Register your models here.
class AccountAdmin(admin.ModelAdmin):
	list_filter = ('is_active', )
	list_display = ('username', 'email', 'phone_number', 'is_active')
	search_fields = ('username', 'email', 'phone_number')


class CareGiverAdmin(admin.ModelAdmin):
	list_display = ('account', 'is_hireable', 'location')


admin.site.register(Account, AccountAdmin)
admin.site.register(CareGiver, CareGiverAdmin)

