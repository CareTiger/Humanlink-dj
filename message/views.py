from django.shortcuts import render
from api_helpers import ComposeJsonResponse
from message.models import Thread, ThreadMember


@login_required
def get_threads(request):
    """Get list of all the threads for the account."""
    user = get_current_user(request)
    thread = Thread.objects.get()

    context = {"user": user, "thread": thread}

    return ComposeJsonResponse(200, "", context)


@login_required
def new_thread(request):
    """Create a new thread."""
    thread = Thread()

    if request.method=="POST":
        form = NewThread(data=request.POST)

        if form.is_valid():
            cleaned_data = form.cleaned_data
            thread.org_id = cleaned_data['org_id']
            thread.save()

    context = {"thread": thread}

    return ComposeJsonResponse(200, "", context)


@login_required
def get_thread(thread_id):
    """Retrieve thread information."""
    thread_id = ThreadMember.objects.get(thread_id=thread_id)

    context = {"thread_id": thread_id}
    return ComposeJsonResponse(200, "", context)


@login_required
def update_thread(request, thread_id):
    """Update thread information."""
    thread = Thread()

    if request.method=="PUT":
        form = UpdateThread(data=request.POST)

        if form.is_valid():
            form.save()

    context = {"thread": thread}
    return ComposeJsonResponse(200, "", context)


@login_required
def send(request, thread_id):
    """Send a message to the thread."""
    thread_id = ThreadMember.objects.get(thread_id=thread_id)

    if request.method=="POST":
        form = NewChat(data=request.POST)

        if form.is_valid():
            cleaned_data = form.cleaned_data
            thread_id.message = cleaned_data['message']
            thread_id.save()

    return ComposeJsonResponse(200, "", context)


@login_required
def history(thread_id):
    """Retrieve messages history for the thread up until `ts`."""

    return json_response(chats)


def add_member(thread_id):
    """Add a member to the thread."""

    return json_response(res)

@login_required
def leave(thread_id):
    """Leave the thread."""

    return json_response(chat)


@login_required
def remove(thread_id):
    """Remove a user from the thread."""

    return json_response(chat)


@login_required
def archive(thread_id):
    """Archive the thread."""

    return json_response(chat)


@login_required
def unarchive(thread_id):
    """Un-archive the thread."""

    return json_response(chat)


def get_current_user(request):
    user = request.user