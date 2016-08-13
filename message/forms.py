from django import forms


class UpdateThread(forms.Form):
    name = forms.CharField(required=True, min_length=3, max_length=30)
    purpose = forms.CharField(widget=forms.Textarea(), required=False)
    purpose_type = forms.IntegerField(min_value=0, max_value=1, required=False)
    privacy = forms.IntegerField(min_value=0, max_value=3, required=False)
    hours = forms.IntegerField(min_value=0, max_value=168, required=False)
    hobbies = forms.CharField(widget=forms.Textarea(), required=False)
    notes = forms.CharField(widget=forms.Textarea(), required=False)
    gender = forms.IntegerField(min_value=0, max_value=2, required=False)


class NewThread(UpdateThread):
    org_id = forms.IntegerField(required=False)


class NewChat(forms.Form):
    message = forms.CharField(widget=forms.Textarea())


class ThreadHistory(forms.Form):
    ts = forms.IntegerField(min_value=0)


class AddMember(forms.Form):
    account_id = forms.IntegerField(min_value=0, required=False)
    name = forms.CharField(max_length=70, required=False)
    email = forms.EmailField(max_length=100)


class RemoveMember(forms.Form):
    account_id = forms.IntegerField(min_value=0)
