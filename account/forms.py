from django import forms
from django.contrib import messages
from django.contrib.auth import authenticate
from django.contrib.auth.forms import SetPasswordForm
from django.contrib.auth.models import User


# Login form that caches a User with clean username and password
class LoginForm(forms.Form):
    email = forms.CharField()
    password = forms.CharField()

    def __init__(self, request=None, *args, **kwargs):
		self.cached_user = None
		self.request = request
		kwargs.setdefault('label_suffix', '')
		super(LoginForm, self).__init__(*args, **kwargs)

    def clean(self):
        cleaned_data = self.cleaned_data

        if len(self._errors) > 0:
            return cleaned_data
        else:
			email = cleaned_data.get('email')
			password = cleaned_data.get('password')

			if email is None or password is None:
				messages.error(self.request, 'Please enter an email and password.')
				return forms.ValidationError("Error")
			else:
				self.cached_user = authenticate(username=email, password=password)

				if self.cached_user is None:
					self._errors["password"] = self.error_class(["Password incorrect. Passwords are case sensitive."])
				elif not self.cached_user.is_active:
					messages.error(self.request,
					               'This account is inactive. Please check your inbox for our confirmation email, and click the link within to activate your account.')
                    raise forms.ValidationError("Error")

		if not cleaned_data.get('remember_me'):
			self.request.session.set_expiry(0)

		return cleaned_data

	def get_user(self):
		return self.cached_user