from django.conf.urls import url

from message.views import *

urlpatterns = [
    url(r'^$', get_threads, name="get_threads"),
    url(r'^create/?$', new_thread, name="new_thread"),
    url(r'^(?P<thread_id>\d+)/update/?$', update, name="update"),
    url(r'^(?P<thread_id>\d+)/send/?$', send, name="send"),
    url(r'^(?P<thread_id>\d+)/history/?$', history, name="history"),
    url(r'^(?P<thread_id>\d+)/member/?$', add_member, name="add_member"),
    url(r'^(?P<thread_id>\d+)/leave/?$', leave, name="leave"),
    url(r'^(?P<thread_id>\d+)/(?P<member_id>\d+)/remove/?$', remove, name="remove"),
    url(r'^(?P<thread_id>\d+)/archive/?$', archive, name="archive"),
    url(r'^(?P<thread_id>\d+)/unarchive/?$', unarchive, name="unarchive"),
    url(r'^accept/(?P<token>.+)/?$', accept_thread_invite, name="accept_thread_invite"),
    url(r'^invite/(?P<token>.+)/?$', thread_invite, name="thread_invite")
]
