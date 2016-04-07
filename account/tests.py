from django.test import TestCase
from account.models import Account
from message.models import Thread

# Create your tests here.

class AccountTestCase(TestCase):
    def setUp(self):
        Account.objects.create(email="timbaney1989@gmail.com")

    def member_add_to_thread(self):
        tim = Account.objects.get(email="timbaney1989@gmail.com")
        thread = Thread.objects.create(account_id=tim.id)
        Thread.add_members(thread, account_id=tim.id)
        self.assertTrue(thread.account_id == tim.id)

