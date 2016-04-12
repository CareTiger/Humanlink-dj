from django.contrib.auth.decorators import login_required
from django.shortcuts import render
import datetime
from account.models import Account
from api_helpers import composeJsonResponse
from message.forms import NewThread, UpdateThread, NewChat, ThreadHistory, AddMember, RemoveMember
from message.models import Thread, ThreadMember, ThreadChat, ThreadInvite, CHAT_CHOICES
from account.views import broadcast, generate_token, get_current_user


@login_required
def get_threads(request):
    # """Get list of all the threads for the account."""

    account = get_current_user(request)

    # all_threads = Thread.objects.join(Thread.ThreadMember_set).filter(ThreadMember.account_id == account.id)
    all_threads = []
    all_members = ThreadMember.objects.all()
    for member in all_members:
        if member.account_id == account:
            all_threads.append(member.Thread_id)
            return all_threads


    context = {"all_threads": all_threads}
    return composeJsonResponse(200, "", context)


@login_required
def new_thread(request):
    # """Create a new thread."""

    account = get_current_user(request)

    thread = Thread()

    if request.method == "POST":
        form = NewThread(request.POST)

        if form.is_valid():
            cleaned_data = form.cleaned_data
            thread.org_id = cleaned_data['org_id']
            thread.name = cleaned_data['name']
            thread.purpose = cleaned_data['purpose']
            thread.privacy = cleaned_data['privacy']
            thread .account_id = account.id
            thread.save()
    else:
        form = NewThread()

    context = {"thread": thread, "form": form}
    return composeJsonResponse(200, "", context)


@login_required
def get_thread(request, thread_id):
    # """Retrieve thread information."""

    account = get_current_user(request)

    thread = Thread.objects.get(id=thread_id, account_id=account.id)

    context = {"thread": thread}
    return composeJsonResponse(200, "", context)


@login_required
def update_thread(request, thread_id):
    # """Update thread information."""

    thread = Thread.objects.get(id=thread_id)

    if request.method == "PUT":
        form = UpdateThread(request.POST)

        if form.is_valid():
            cleaned_data = form.cleaned_data
            thread.name = cleaned_data['name']
            thread.purpose = cleaned_data['purpose']
            thread.privacy = cleaned_data['privacy']
            thread.save()
    else:
        form = UpdateThread()

    context = {"thread": thread, "form": form}
    return composeJsonResponse(200, "", context)


@login_required
def send(request, thread_id):
    # """Send a message to the thread."""

    account = get_current_user(request)
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

            broadcast(threadchat.id)
    else:
        form = NewChat()

    context = {"thread": thread, "threadchat": threadchat, "form": form}
    return composeJsonResponse(200, "", context)


@login_required
def history(request, thread_id):
    # """Retrieve messages history for the thread up until `ts`."""

    messages = None

    thread = Thread.objects.get(thread_id=thread_id)

    if request.method == "POST":
        form = ThreadHistory(request.post)

        if form.is_valid():
            cleaned_data = form.cleaned_data
            ts = cleaned_data['ts']
            ts_date = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

            messages = ThreadChat.objects.filter(thread_id=thread.id, created_on__lte=ts_date)

    else:
        form = ThreadHistory()

    context = {"messages": messages, "form": form}
    return composeJsonResponse(200, "", context)


def add_member(request, thread_id):
    # """Add a member to the thread."""

    thread = Thread.objects.get(id=thread_id)

    if request.method == "POST":
        form = AddMember(request.POST)
        res = {'message': 'ok'}

        if form.is_valid():
            cleaned_data = form.cleaned_data
            if cleaned_data['account_id']:
                account = Account.objects.get(account_id=cleaned_data['account_id'])
                thread.add_members(account.id)
            elif cleaned_data['email']:
                account = Account.objects.get(email=cleaned_data['email'])
                token = generate_token(8)
                thread_invite = ThreadInvite(actor_id=account.id, thread_id=thread.id, token=token,
                                             email=cleaned_data['email'], name=cleaned_data['name'])
                thread_invite.save()

                # TO-DO = Create email to send, previous author never did it.

            else:
                res['message'] = 'Provide either account or email address.'
    else:
        form = AddMember()
        res = {}

    context = {"res": res, "form": form}
    return composeJsonResponse(200, "", context)


@login_required
def leave(request, thread_id):
    # """Leave the thread."""

    account = get_current_user(request)
    thread_member = ThreadMember.objects.get(account_id=account.id, thread_id=thread_id)
    thread = Thread.objects.get(id=thread_id)
    thread.delete(thread_member)

    context = {"account": account, "thread_member": thread_member, "thread": thread}
    return composeJsonResponse(200, "", context)


@login_required
def remove(request, thread_id):
    # """Remove a user from the thread."""

    thread = Thread.objects.get(id=thread_id)
    member = ThreadMember()

    if request.method == "POST":
        form = RemoveMember(request.POST)

        if form.is_valid():
            cleaned_data = form.cleaned_data

            member = ThreadMember.objects.get(thread_id=thread_id, account_id=cleaned_data['account_id'])
            thread.remove(member)
    else:
        form = RemoveMember()

    context = {"member": member, "form": form}
    return composeJsonResponse(200, "", context)


@login_required
def archive(request, thread_id):
    # """Archive the thread."""

    thread = Thread.objects.get(id=thread_id)
    thread_chat = ThreadChat.objects.get(thread_id=thread.id, account_id=thread.actor.id,
                                         message=thread.actor.id, kind=CHAT_CHOICES(4))
    thread_chat.save()

    thread.is_archived = True
    thread.save()

    broadcast(thread_chat.id)

    context = {"thread": thread}
    return composeJsonResponse(200, "", context)


@login_required
def unarchive(thread_id):
    # """Un-archive the thread."""

    thread = Thread.objects.get(id=thread_id)
    thread_chat = ThreadChat.objects.get(thread_id=thread.id, account_id=thread.actor.id,
                                         message=thread.actor.id, kind=CHAT_CHOICES(5))
    thread_chat.save()

    thread.is_archived = True
    thread.save()

    broadcast(thread_chat.id)

    context = {"thread": thread}
    return composeJsonResponse(200, "", context)
