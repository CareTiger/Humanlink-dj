import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import render
import datetime
from account.models import Account
from api_helpers import composeJsonResponse
from message.forms import NewThread, UpdateThread, NewChat, ThreadHistory, AddMember, RemoveMember
from message.models import Thread, ThreadMember, ThreadChat, ThreadInvite, CHAT_CHOICES
from account.views import broadcast, generate_token, get_current_user, requestPost
from django.views.decorators.csrf import csrf_exempt
import time


# @login_required
def get_threads(request):
    # """Get list of all the threads for the account."""

    account = request.user

    all_threads = []
    all_members = ThreadMember.objects.all()
    threadCount = 0
    for member in all_members:
        if member.account.email == account.email:
            thread = Thread.objects.get(id=member.thread.id)

            threads_members = []
            all_thread_members = ThreadMember.objects.filter(thread=thread)
            count = 0
            for threadMember in all_thread_members:
                memberObject = {
                    'id': threadMember.id,
                    'account': threadMember.account,
                    'profile': {
                        'gravatar_url': threadMember.account.gravatar_url(),
                        'email': threadMember.account.email
                    }
                }
                threads_members.append(memberObject)
                count += 1

            threadObject = {
                "id": thread.id,
                "owner": {
                    "id": thread.owner.id
                },
                "name": thread.name,
                "is_archived": thread.is_archived,
                "members": threads_members
            }
            all_threads.append(threadObject)
            threadCount += 1


    threads = {"threads": all_threads}
    return composeJsonResponse(200, "", threads)


# @login_required
def new_thread(request):
    # """Create a new thread."""

    account = Account.objects.get(email=request.user.username)

    thread = Thread()

    if request.method == "POST":
        form = NewThread(requestPost(request))

        if form.is_valid():
            cleaned_data = form.cleaned_data
            thread.org = cleaned_data['org_id']
            thread.name = cleaned_data['name']
            # thread.purpose = cleaned_data['purpose']
            thread.privacy = cleaned_data['privacy']
            thread.account = account
            thread.owner = account
            thread.save()

            ThreadMember.objects.create(thread=thread, account=account)
    else:
        form = NewThread()

    context = {"name": thread.name,
               "owner": {
                   "id": thread.owner.id,
                   "email": thread.owner.email
                }
               }
    return composeJsonResponse(200, "", context)


# @login_required
# @csrf_exempt
def handle_thread(request, thread_id):
    # """Retrieve and update thread information."""

    thread = Thread.objects.get(id=thread_id)

    if request.method == "PUT":
        form = UpdateThread(requestPost(request))

        if form.is_valid():
            cleaned_data = form.cleaned_data
            thread.name = cleaned_data['name']
            # thread.purpose = cleaned_data['purpose']
            thread.privacy = cleaned_data['privacy']
            thread.save()

            context = {"thread": thread}
            return composeJsonResponse(200, "", context)
        else:
            context = {"message": form.errors}
            return composeJsonResponse(200, "", context)
    else:
        context = {"thread": thread}
        return composeJsonResponse(200, "", context)


# @login_required
def send(request, thread_id):
    # """Send a message to the thread."""

    account = Account.objects.get(email=request.user.username)
    thread = Thread.objects.get(id=thread_id)

    if request.method == "POST":
        x = requestPost(request)
        form = NewChat(requestPost(request))

        if form.is_valid():
            cleaned_data = form.cleaned_data
            threadchat = ThreadChat.objects.create(text=cleaned_data['message'], account=account, thread=thread)

            broadcast(threadchat.id)

            context = {"threadchat": threadchat}
            return composeJsonResponse(200, "", context)


# @login_required
def history(request, thread_id):
    # """Retrieve messages history for the thread up until `ts`."""

    messages = None

    thread = Thread.objects.get(id=thread_id)

    if request.method == "POST":

        form = ThreadHistory(requestPost(request))


        if form.is_valid():
            cleaned_data = form.cleaned_data
            ts = cleaned_data['ts']
            ts_date = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')

            messages = ThreadChat.objects.filter(thread=thread.id, created_on__lte=ts_date)

            context = {"messages": messages}
            return composeJsonResponse(200, "", context)
        else:
            all_chats = []


            all_chats_list = ThreadChat.objects.filter(thread=thread)

            for chat in all_chats_list:
                chatObject = {
                    'account': {
                        'name': chat.account,
                        'gravatar_url': chat.account.gravatar_url()
                    },
                    'created': chat.created_on,
                    'kind': chat.kind,
                    'text': chat.text,
                    'remover': chat.remover
                }
                all_chats.append(chatObject)

            context = {
                'all_chats': all_chats
            }
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
                account = Account.objects.get(account=cleaned_data['account_id'])
                thread.add_members(account)
            elif cleaned_data['email']:
                account = Account.objects.get(email=cleaned_data['email'])
                token = generate_token(8)
                thread_invite = ThreadInvite.objects.create(actor=account, thread=thread, token=token,
                                             email=cleaned_data['email'], name=cleaned_data['name'])

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
    thread_member = ThreadMember.objects.get(account=account.id, thread=thread_id)
    thread = Thread.objects.get(id=thread_id)
    thread.delete(thread_member)

    context = {"account": account, "thread_member": thread_member, "thread": thread}
    return composeJsonResponse(200, "", context)


# @login_required
def remove(request, thread_id, member_id):
    # """Remove a user from the thread."""

    if request.method == "POST":
        thread = Thread.objects.get(id=thread_id)
        member = ThreadMember.objects.filter(thread=thread, id=member_id)

        member.delete()

        context = {"member": member}
        return composeJsonResponse(200, "", context)


@login_required
def archive(request, thread_id):
    # """Archive the thread."""

    thread = Thread.objects.get(id=thread_id)
    thread.is_archived = True
    thread.save()

    thread_chat = ThreadChat.objects.create(thread=thread.id, account=thread.account,
                                         message=thread.account.id, kind=CHAT_CHOICES(4))

    broadcast(thread_chat.id)

    context = {"thread": thread}
    return composeJsonResponse(200, "", context)


@login_required
def unarchive(thread_id):
    # """Un-archive the thread."""

    thread = Thread.objects.get(id=thread_id)
    thread.is_archived = False
    thread.save()

    thread_chat = ThreadChat.objects.create(thread=thread, account=thread.account,
                                         message=thread.account.id, kind=CHAT_CHOICES(5))

    broadcast(thread_chat.id)

    context = {"thread": thread}
    return composeJsonResponse(200, "", context)