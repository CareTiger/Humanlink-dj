from django.contrib.auth.decorators import login_required
from django.shortcuts import render
import datetime
from account.models import Account
from api_helpers import ComposeJsonResponse
from message.forms import NewThread, UpdateThread, NewChat, ThreadHistory, AddMember, RemoveMember
from message.models import Thread, ThreadMember, ThreadChat


@login_required
def get_threads(request):
    """Get list of all the threads for the account."""
    user = get_current_user(request)
    account = Account.objects.get(email=user.email, password=user.password)
    thread = Thread.objects.get(account_id=account.id)

    context = {"thread": thread, }

    return ComposeJsonResponse(200, "", context)


@login_required
def new_thread(request):
    """Create a new thread."""
    thread = Thread()

    if request.method == "POST":
        form = NewThread(request.POST)

        if form.is_valid():
            cleaned_data = form.cleaned_data
            thread.org_id = cleaned_data['org_id']
            thread.name = cleaned_data['name']
            thread.purpose = cleaned_data['purpose']
            thread.privacy = cleaned_data['privacy']
            thread.save()

    context = {"thread": thread}

    return ComposeJsonResponse(200, "", context)


@login_required
def get_thread(thread_id):
    """Retrieve thread information."""
    thread = Thread.objects.get(id=thread_id)

    context = {"thread": thread}
    return ComposeJsonResponse(200, "", context)


@login_required
def update_thread(request, thread_id):
    """Update thread information."""
    thread = Thread.objects.get(id=thread_id)

    if request.method == "PUT":
        form = UpdateThread(request.POST)

        if form.is_valid():
            cleaned_data = form.cleaned_data
            thread.name = cleaned_data['name']
            thread.purpose = cleaned_data['purpose']
            thread.privacy = cleaned_data['privacy']
            thread.save()

    context = {"thread": thread}
    return ComposeJsonResponse(200, "", context)


@login_required
def send(request, thread_id):
    """Send a message to the thread."""
    user = get_current_user(request)
    account = Account.objects.get(email=user.email, password=user.password)
    thread = Thread.objects.get(id=thread_id)
    threadchat = ThreadChat()

    if request.method == "POST":
        form = NewChat(request.POST)

        if form.is_valid():
            cleaned_data = form.cleaned_data
            threadchat.text = cleaned_data['message']
            threadchat.account_id = account.id
            threadchat.thread_id = thread.id
            threadchat.save()

            context = {"thread": thread, "threadchat": threadchat}
            return ComposeJsonResponse(200, "", context)


@login_required
def history(request, thread_id):
    """Retrieve messages history for the thread up until `ts`."""

    messages = None

    if request.method == "POST":
        form = ThreadHistory(request.post)

        if form.is_valid():
            cleaned_data = form.cleaned_data
            ts = cleaned_data['ts']
            ts_date = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

            messages = ThreadChat.objects.filter(created_on__lte=ts_date)

    else:
        form = ThreadHistory()

    context = {"messages": messages, "form": form}
    return ComposeJsonResponse(200, "", context)


def add_member(request, thread_id):
    """Add a member to the thread."""

    thread = Thread.objects.get(id=thread_id)
    member = ThreadMember()
    if request.method == "POST":
        form = AddMember(request.POST)

        if form.is_valid():
            cleaned_data = form.cleaned_data
            if cleaned_data['account_id']:
                account = Account.objects.get(account_id=cleaned_data['account_id'])
            elif cleaned_data['email']:
                account = Account.objects.get(email=cleaned_data['email'])
            elif cleaned_data['name']:
                account = Account.objects.get(__str__=cleaned_data['name'])
            thread.add_member(member.account_id)
            thread.save()

    context = {"thread": thread}
    return ComposeJsonResponse(200, "", context)


@login_required
def leave(request, thread_id):
    """Leave the thread."""
    user = get_current_user(request)
    account = Account.objects.get(email=user.email)
    thread_member = ThreadMember.objects.get(account_id=account.id, thread_id=thread_id)
    thread = Thread.objects.get(id=thread_id)
    thread.delete(thread_member)

    context = {"account": account, "thread_member": thread_member, "thread": thread}
    return ComposeJsonResponse(200, "", context)


@login_required
def remove(request, thread_id):
    """Remove a user from the thread."""

    thread = Thread.objects.get(id=thread_id)
    member = ThreadMember()

    if request.method == "POST":
        form = RemoveMember(request.POST)

        if form.is_valid():
            cleaned_data = form.cleaned_data
            member = ThreadMember.objects.get(account_id=cleaned_data['account_id'])
            thread.remove(member)

    context = {"member": member}
    return ComposeJsonResponse(200, "", context)


@login_required
def archive(thread_id):
    """Archive the thread."""
    context = {}
    return ComposeJsonResponse(200, "", context)


@login_required
def unarchive(thread_id):
    """Un-archive the thread."""
    context = {}
    return ComposeJsonResponse(200, "", context)


def get_current_user(request):
    user = request.user