from django import forms


class NewOrg(forms.Form):
	name = forms.CharField(required=True, min_length=3, max_length=35)
	username = forms.CharField(min_length=3, max_length=35)
	description = forms.Textarea()
	is_public = forms.BooleanField()


class OrgInviteEmail(forms.Form):
	name = forms.CharField(max_length=70)
	email = forms.EmailField()
	is_admin = forms.BooleanField()