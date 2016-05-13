from django import forms


class UpdateThread(forms.Form):
	name = forms.CharField(required=True, min_length=3, max_length=30)
	purpose = forms.CharField(widget=forms.Textarea(), required=False)
	privacy = forms.IntegerField(min_value=0, max_value=3, required=False)


class NewThread(UpdateThread):
	org_id = forms.IntegerField(required=False)


class NewChat(forms.Form):
    message = forms.CharField(widget=forms.Textarea())


class ThreadHistory(forms.Form):
	ts = forms.IntegerField(min_value=0)


class AddMember(forms.Form):
	account_id = forms.IntegerField(min_value=0, required=False)
	name = forms.CharField(max_length=70)
	email = forms.EmailField(max_length=100)


class RemoveMember(forms.Form):
	account_id = forms.IntegerField(min_value=0)
