from django.shortcuts import render
from api_helpers import ComposeJsonResponse
from account.models import Account, CareGiver
from .forms import BasicInfo, CareGiverInfo

# Create your views here.

def index(request):
    """Return Account Template...?"""


def me(request):
    """ - Retrieve Current Account Information in JSON Format """

    user = request.user
    account = Account.objects.get(email=user.email, password=user.password)

    context = {
        "account": account
    }

    return ComposeJsonResponse(200, "", context)


def update(request):
    """ - Update Account Information """

    user = request.user
    account = Account.objects.get(email=user.email, password=user.password)

    context = {
        acc
    }

    if request.POST:
        form = BasicInfo(request.POST)

        cleaned_data = form.cleaned_data
        account.first_name = cleaned_data['first_name']
        account.last_name = cleaned_data['last_name']
        account.phone = cleaned_data['phone']
        account.save()

    return ComposeJsonResponse(200, "", user)

def update_caregiver(request):
    """ -Updates Account's Caregiver Information. """

    user = request.user
    account = Account.objects.get(email=user.email, password=user.password)
    caregiver = CareGiver.objects.get(account_id=account.id)

    if request.POST:
        form = CareGiverInfo

        cleaned_data = form.cleaned_data
        caregiver.is_hireable = cleaned_data['is_hireable']
        caregiver.location = cleaned_data['location']
        caregiver.about = cleaned_data['about']
        caregiver.certs = cleaned_data['certs']

    return ComposeJsonResponse(200, "", context)


def profile(request, account_id):
    """Retrieve Profile of the Specified Account
       - Get Account By ID
    """

def caregiver_info(request, account_id):
    """Retrieve Caregiver Details
       - Retrieve Caregiver Details Associated With the Specified Account
    """
