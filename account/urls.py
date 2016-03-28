from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^me', views.me, name="me"),
    url(r'^update', views.update, name="update"),
    url(r'^update_caregiver', views.update_caregiver, name="update_caregiver"),
    url(r'^profile', views.profile, name="profile"),
    url(r'^caregiver_info', views.caregiver_info, name="caregiver_info")
]