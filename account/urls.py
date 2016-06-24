from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^login/', views.login, name="login"),
    url(r'^me/', views.me, name="me"),
    url(r'^update/', views.update, name="update"),
    url(r'^getTeam/', views.getTeam, name="getTeam"),
    url(r'^updateTeam/', views.update_team, name="update_team"),
    url(r'^signup/', views.signup, name="signup"),
    url(r'^accept/', views.accept_invite, name="accept_invite"),
    url(r'^caregiver/', views.update_caregiver, name="update_caregiver"),
    url(r'^(?P<account_id>\d+)/?$', views.profile, name="profile"),
    url(r'^(?P<account_id>\d+)/caregiver/', views.caregiver_info, name="caregiver_info"),
    url(r'^invite/(?P<token>\w+)/?$', views.invite, name="invite"),
    url(r'^search_caregivers/', views.get_caregivers, name="get_caregivers"),
    url(r'^search_seekers/', views.get_careseekers, name="get_careseekers"),]

