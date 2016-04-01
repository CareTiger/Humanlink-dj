from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.orgs, name="index_orgs"),
    url(r'^(?P<org_id>\d+)/invite-email?$', views.invite_by_email, name="history"),
]