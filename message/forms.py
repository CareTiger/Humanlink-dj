from django import forms


class UpdateThread(forms.Form):
	name = forms.CharField(required=True, min_length=3, max_length=30)
	purpose = forms.Textarea()
	privacy = forms.IntegerField(min=0, max=3)


class NewThread(UpdateThread):
	org_id = forms.IntegerField(required=True,)


class NewChat(forms.Form):
	message = forms.Textarea()


class ThreadHistory(forms.Form):
	ts = forms.IntegerField(min=0)
