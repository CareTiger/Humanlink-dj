from django.conf.urls import url

from message.views import *

urlpatterns = [
	url(r'^$', get_threads, name="get_threads"),
	url(r'^create/?$', new_thread, name="new_thread"),
	url(r'^(?P<thread_id>\d+)/?$', handle_thread, name="get_thread"),
	url(r'^(?P<thread_id>\d+)/send/?$', send, name="send"),
	url(r'^(?P<thread_id>\d+)/history/?$', history, name="history"),
	url(r'^(?P<thread_id>\d+)/member/?$', add_member, name="add_member"),
	url(r'^(?P<thread_id>\d+)/leave/?$', leave, name="leave"),
	url(r'^(?P<thread_id>\d+)/(?P<member_id>\d+)/remove/?$', remove, name="remove"),
	url(r'^(?P<thread_id>\d+)/archive/?$', archive, name="archive"),
	url(r'^(?P<thread_id>\d+)/unarchive/?$', unarchive, name="unarchive"),
]