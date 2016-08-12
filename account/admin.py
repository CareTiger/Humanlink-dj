from django.contrib import admin

from account.models import Account, CareGiver, CareSeeker


# Register your models here.
class AccountAdmin(admin.ModelAdmin):
	list_filter = ('is_active', )
	list_display = ('email', 'username', 'phone_number', 'is_active')
	search_fields = ('username', 'email', 'phone_number')


class CareGiverAdmin(admin.ModelAdmin):
	list_display = ('account', 'is_hireable', 'location')

class CareSeekerAdmin(admin.ModelAdmin):
	list_display = ('account', 'public', 'team_name')



admin.site.register(Account, AccountAdmin)
admin.site.register(CareGiver, CareGiverAdmin)
admin.site.register(CareSeeker, CareSeekerAdmin)

