from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from . import views
from account.views import login
from django.contrib.sitemaps import GenericSitemap
from django.contrib.sitemaps.views import sitemap

from . import views as webapp_views

admin.autodiscover()

urlpatterns = [
	url(r'^admin/filebrowser/', include('filebrowser.urls')),
	url(r'^admin/', include(admin.site.urls)),
	url(r'^login', login, name="login")
]

if settings.DEVELOPMENT:
	urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# This url pattern must be last since it will match on anything