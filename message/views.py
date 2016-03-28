from django.shortcuts import render


@login_required
def get_threads(request):
    """Get list of all the threads for the account."""

    #EXAMPLE
    threads = Thread.objects.filter(account_id=request_id)

    return json_response(threads)

@login_required
def new_thread():
    """Create a new thread."""

    return json_response(thread)


@login_required
def get_thread(thread_id):
    """Retrieve thread information."""

    return json_response(thread)


@login_required
def update_thread(thread_id):
    """Update thread information."""

    return json_response(thread)


@login_required
def send(thread_id):
    """Send a message to the thread."""

    return json_response(chat)


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