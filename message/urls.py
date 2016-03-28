from django.conf.urls import url

from message.views import get_threads, new_thread, get_thread, update_thread, send, history, add_member, leave, remove, archive, unarchive

urlpatterns = [
	url(r'^threads/?$', get_threads),
	url(r'^create/?$', new_thread),
	url(r'^(?P<thread_id>\d+)/?$', get_thread),
	url(r'^(?P<thread_id>\d+)/?$', update_thread),
	url(r'^(?P<thread_id>\d+)/send?$', send),
	url(r'^(?P<thread_id>\d+)/history?$', history),
	url(r'^(?P<thread_id>\d+)/member?$', add_member),
	url(r'^(?P<thread_id>\d+)/leave?$', leave),
	url(r'^(?P<thread_id>\d+)/remove?$', remove),
	url(r'^(?P<thread_id>\d+)/archive?$', archive),
	url(r'^(?P<thread_id>\d+)/unarchive?$', unarchive),
]