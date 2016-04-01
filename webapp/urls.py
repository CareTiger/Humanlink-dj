from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from . import views

from . import views as webapp_views

admin.autodiscover()

urlpatterns = [
	url(r'^admin/filebrowser/', include('filebrowser.urls')),
	url(r'^admin/', include(admin.site.urls)),
	url(r'^login/', views.login, name="login"),
	url(r'^logout/', views.logout, name="logout"),
	url(r'^r/', views.r, name="redirect"),
	url(r'^$/', views.index, name="index"),
	url(r'^verify/(?P<token>\d+)/?$', views.verify_email, name="verify_email"),
	url(r'^accept/(?P<token>\d+)/?$', views.invite_accept, name="invite_accept"),
	url(r'^caregivers/', views.caregivers, name="caregivers"),
	url(r'^pusher/auth/', views.pusher_auth, name="pusher_auth"),
	url(r'^home/', views.home, name="home"),
	url(r'^app/', views.app, name="app"),
	url(r'^settings/', views.settings, name="settings"),
	url(r'^terms/', views.terms, name="terms"),
	url(r'^account/', include("account.views"), name="account-views"),
	url(r'^orgs/', include("org.views"), name="org-views"),
	url(r'^message/', include("message.views"), name="message-views")
]

if settings.DEVELOPMENT:
	urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)