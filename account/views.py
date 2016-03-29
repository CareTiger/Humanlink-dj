from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from api_helpers import ComposeJsonResponse
from account.models import Account, CareGiver
from .forms import BasicInfo, CareGiverInfo, LoginForm

# Create your views here.

def index(request):
    """ -Return Account Template...?"""

def login(request):
    """ -Log in the user if credentials are valid """
    if request.method == "POST":
        form = LoginForm(request.POST)
    else:
        form = LoginForm()

def signup(request):
    """ -Register a new account with a new org."""

def accept_invite(request):
    """ -Create a new account and accept an org member invitation."""

def invite(request, token):
    """ -Retrieve an org member invitation information """

@login_required
def me(request):
    """ - Retrieve Current Account Information in JSON Format """

    user = request.user
    account = Account.objects.get(email=user.email, password=user.password)

    context = {
        "account": account
    }

    return ComposeJsonResponse(200, "", context)

@login_required
def update(request):
    """ - Update Account Information """

    user = request.user
    account = Account.objects.get(email=user.email, password=user.password)

    if request.method == "POST":
        form = BasicInfo(request.POST)

        if form.is_valid:

            cleaned_data = form.cleaned_data
            account.first_name = cleaned_data['first_name']
            account.last_name = cleaned_data['last_name']
            account.phone = cleaned_data['phone']
            account.save()

            context = {
                'account': account
            }

    return ComposeJsonResponse(200, "", context)

@login_required
def update_caregiver(request):
    """ -Updates Account's Caregiver Information. """

    user = request.user
    account = Account.objects.get(email=user.email, password=user.password)
    caregiver = CareGiver.objects.get(account_id=account.id)

    if request.method == "POST":
        form = CareGiverInfo

        if form.is_valid:

            cleaned_data = form.cleaned_data
            caregiver.is_hireable = cleaned_data['is_hireable']
            caregiver.location = cleaned_data['location']
            caregiver.about = cleaned_data['about']
            caregiver.certs = cleaned_data['certs']
            caregiver.save()

            context = {
                'caregiver': caregiver
            }

    return ComposeJsonResponse(200, "", context)

@login_required
def profile(request, account_id):
    """ -Retrieve Profile With Account ID """

    account = Account.objects.get(id=account_id)
    context = {
        'account': account
    }

    return ComposeJsonResponse(200, "", context)

@login_required
def caregiver_info(request, account_id):
    """ -Retrieve Caregiver Details for an Account """

    caregiver = CareGiver.objects.get(account=account_id)
    context = {
        'caregiver': caregiver
    }

    return ComposeJsonResponse(200, "", context)
