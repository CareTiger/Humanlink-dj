from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^me', views.me, name="me"),
    url(r'^update', views.update, name="update"),
    url(r'^caregiver', views.update_caregiver, name="update_caregiver"),
    url(r'^(?P<account_id>\d+)/?$', views.profile, name="profile"),
    url(r'^(?P<account_id>\d+)/caregiver', views.caregiver_info, name="caregiver_info")
]