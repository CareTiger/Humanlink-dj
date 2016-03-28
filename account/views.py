from django.shortcuts import render
from api_helpers import ComposeJsonResponse

# Create your views here.

def index(request):
    """Return Account Template...?"""

def me(request):
    """ - Retrieve Current Account Information in JSON Format """
    user = get_current_user(request)

    return_data = {
        "user": user
    }

    return ComposeJsonResponse(200, "", return_data)

def update(request):
    """ - Update Account Information """

    if request.POST:
        "Update"
    else:
        pass


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

def get_current_user(request):
    user = request.user