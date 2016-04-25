from django.contrib import admin
from org.models import Org, OrgMember, OrgInvite


class OrgMemberInline(admin.TabularInline):
	model = OrgMember
	fieldsets = (
		(None, {
			'fields': ('account', 'status', 'is_active')
		}),
	)
	raw_id_fields = ('account',)


class OrgAdmin(admin.ModelAdmin):
	list_display = ('name', 'username', 'is_public')
	raw_id_fields = ('actor',)
	inlines = (OrgMemberInline, )


class OrgMemberAdmin(admin.ModelAdmin):
	list_filter = ('is_active', 'is_owner', 'is_admin')
	list_display = ('org', 'account', 'status', 'is_active')
	search_fields = ('org__name', 'account__email')
	raw_id_fields = ('org',)


class OrgInviteAdmin(admin.ModelAdmin):
	search_fields = ('name', 'email')
	list_display = ('org', 'account', 'name', 'email')
	raw_id_fields = ('org', 'account')


admin.site.register(Org, OrgAdmin)
admin.site.register(OrgMember, OrgMemberAdmin)
admin.site.register(OrgInvite, OrgInviteAdmin)
