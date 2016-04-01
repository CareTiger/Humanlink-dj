from django.test import TestCase
from account.models import *

# Create your tests here.

class AccountTestCase(TestCase):
    def setUp(self):
        Account.objects.create(email="timbaney1989@gmail.com", password="Password123@@")
        Account.objects.create(email="courtney.schuman92@gmail.com", password="Password456@@")

    def account_id_type_is_valid(self):
        tim = Account.objects.get(email="timbaney1989@gmail.com")
        courtney = Account.objects.get(email="courtney.schuman92@gmail.com")
        self.assertTrue(tim.password == "Password123@@")
        self.assertTrue(courtney.password == "WrongPassword")
