from django.contrib import admin
from message.models import Thread, ThreadMember, ThreadChat, ThreadInvite

admin.site.register(Thread)
admin.site.register(ThreadMember)
admin.site.register(ThreadChat)
admin.site.register(ThreadInvite)
