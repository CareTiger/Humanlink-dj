from django.shortcuts import render
from api_helpers import ComposeJsonResponse
from account.models import Account, CareGiver

# Create your views here.

def index(request):
    """Return Account Template...?"""


def me(request):
    """ - Retrieve Current Account Information in JSON Format """
    user = request.user
    account = Account.objects.get(email=user.email)
    thread = Thread.objects.get(id=account.id)

    context = {
        "user": user
    }

    return ComposeJsonResponse(200, "", context)


def update(request):
    """ - Update Account Information """

    user = request.user
    account = Account.objects.get(email=user.email)

    if request.POST:
        cleaned_data = form.cleaned_data
        account.first_name = cleaned_data['first_name']
        account.last_name = cleaned_data['last_name']
        account.phone = cleaned_data['phone']
        account.save()
    else:
        pass

    return ComposeJsonResponse(200, "", user)

def update_caregiver(request):
    """Update Caregiver Information
       -Updates Account's Caregiver Information.
    """

def profile(request):
    """Retrieve Profile of the Specified Account
       - Get Account By ID
    """

def caregiver_info(request):
    """Retrieve Caregiver Details
       - Retrieve Caregiver Details Associated With the Specified Account
    """
