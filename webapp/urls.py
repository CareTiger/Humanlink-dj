from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from account import views as account_views
from . import views

admin.autodiscover()

urlpatterns = [
    url(r'^$', views.index),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^logout/', views.logout_user, name="logout"),
    url(r'^r/', views.r, name="redirect"),
    url(r'^verify/(?P<token>.*)/?$', views.verify_email, name="verify_email"),
    url(r'^caregivers/', views.caregivers, name="caregivers"),
    url(r'^pusher/auth', views.pusher_auth, name="pusher_auth"),
    url(r'^home/accept/(?P<token>\w+)?$', views.invite_accept, name="invite_accept"),
    url(r'^home/accounts/availability/(?P<email>.*)', views.check_availability,
        name="invite_accept"),
    url(r'^home/thread/(?P<token>\w+)?$', views.thread_invite_accept_redirect,
        name="invite_accept"),
    url(r'^home/', views.home, name="home"),
    url(r'^app/', views.app, name="app"),
    url(r'^settings/', views.settings, name="settings"),
    url(r'^terms/', views.terms, name="terms"),
    url(r'^accounts/', include("account.urls"), name="account-urls"),
    url(r'^orgs/', include("org.urls"), name="org-urls"),
    url(r'^message/', include("message.urls"), name="message-urls")
]

if settings.DEVELOPMENT:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
