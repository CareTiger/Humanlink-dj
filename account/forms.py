from django import forms
from django.contrib.auth.forms import SetPasswordForm
from django.contrib.auth.models import User
from .models import Account, CareGiver


# Login form that caches a User with clean username and password
class LoginForm(forms.Form):
    email = forms.EmailField(max_length=100)
    password = forms.CharField(max_length=20)
    invite = forms.CharField(max_length=20, required=False)
    token = forms.CharField(max_length=20, required=False)

    def __init__(self, *args, **kwargs):
        self.cached_user = None
        self.request = kwargs
        kwargs.setdefault('label_suffix', '')
        super(LoginForm, self).__init__(*args, **kwargs)


    def get_user(self):
        return self.cached_user

class BasicInfo(forms.ModelForm):

    class Meta:
        model = Account
        fields = ['username', 'first', 'last', 'phone_number']

class CareGiverInfo(forms.ModelForm):

    class Meta:
        model = CareGiver
        fields = ['is_hireable', 'location', 'about', 'certs']

class AcceptInvite(forms.Form):
    email = forms.EmailField(required=True)
    password = forms.CharField(required=True)
    password_conf = forms.CharField(required=True)
    token = forms.CharField(required=True)

class SignUp(forms.Form):
    email = forms.EmailField(required=True)
    invite = forms.CharField(required=False)
    token = forms.CharField(required=False)
    password = forms.CharField(required=True)
    password_confirm = forms.CharField(required=True)
    org_name = forms.CharField(required=False)
    org_username = forms.CharField(required=False)
