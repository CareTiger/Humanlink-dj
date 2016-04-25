from django.contrib import admin
from message.models import Thread, ThreadMember, ThreadChat, ThreadInvite


class ThreadMemberInline(admin.TabularInline):
	model = ThreadMember
	list_display = ('account', 'last_seen')
	raw_id_fields = ('account', )

	readonly_fields = ['last_seen',]
	fieldsets = (
		(None, {
			'fields': ('account', 'last_seen')
		}),
	)


class ThreadAdmin(admin.ModelAdmin):
	list_display = ('name','owner','org','privacy')
	list_filter = ('org','privacy')
	search_fields = ('name', 'owner__email')
	raw_id_fields = ('account', 'owner', 'org')
	inlines = [ThreadMemberInline, ]


class ThreadMemberAdmin(admin.ModelAdmin):
	search_fields = ('account__email', 'thread__name')
	list_filter = ('last_seen', )
	list_display = ('thread', 'account', 'last_seen')
	raw_id_fields = ('thread', 'account')


class ThreadChatAdmin(admin.ModelAdmin):
	list_display = ('thread', 'account', 'created_on')
	list_filter = ('created_on', 'kind')
	raw_id_fields = ('account',)


class ThreadInviteAdmin(admin.ModelAdmin):
	list_display = ('thread', 'actor', 'name', 'email')
	raw_id_fields = ('thread', 'actor')

admin.site.register(Thread, ThreadAdmin)
admin.site.register(ThreadMember, ThreadMemberAdmin)
admin.site.register(ThreadChat, ThreadChatAdmin)
admin.site.register(ThreadInvite, ThreadInviteAdmin)


