import logging

from django.contrib.sites.shortcuts import get_current_site
from django.shortcuts import render_to_response, render
from django.template import RequestContext
from django.contrib.auth.forms import AuthenticationForm
from django.utils.http import is_safe_url


def login(request, redirect_field_name, authentication_form=AuthenticationForm, extra_context=None):

    redirect_to = request.POST.get(redirect_field_name,
                                   request.GET.get(redirect_field_name, ''))

    if request.method == "POST":
        form = authentication_form(request.POST, data=request.POST)
        if form.is_valid():
            if not is_safe_url(url=redirect_to, host=request.get_host()):
                redirect_to = resolve_url(settings.LOGIN_REDIRECT_URL)

            auth_login(request, form.get_user())

    else:
        form = AuthenticationForm(request)

    current_site = get_current_site(request)

    context = {
        'form': form,
        redirect_field_name: redirect_to,
        'site': current_site,
        'site_name': current_site.name,
    }
    if extra_context is not None:
        context.update(extra_context)

    return render(request, "index.html", form)

