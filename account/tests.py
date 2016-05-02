import codecs
import os

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import request
from django.test import TestCase, Client
from account.models import Account
from account.views import verification_token
from message.models import Thread
from org.models import Org, OrgMember, OrgInvite


# Create your tests here.

class AccountTestCase(TestCase):
    def setUp(self):
        Account.objects.create(email="timbaney1989@gmail.com")

    def member_add_to_thread(self):
        tim = Account.objects.get(email="timbaney1989@gmail.com")
        thread = Thread.objects.create(account_id=tim.id)
        Thread.add_members(thread, account_id=tim.id)
        self.assertTrue(thread.account_id == tim.id)

# Response Codes are 3-digit Integers.
# 2xx = Success, 3xx = Redirection, 4xx = Client Error, 5xx = Server Error
# *SEE http://www.restapitutorial.com/httpstatuscodes.html

# URLs with a number of 100 means there is an id, or token being passed in.
# 3 out of 36 => FAILING or HAS ERRORS

'''
* Webapp - pusher/auth: ERROR "IndexError: list index out of range, resource = fragments[1]"
* Account - signup: ERROR "Invalid Mandrill API Key"
'''

class WebappViewTestCase(TestCase):
    c = Client()

    def setUp(self):
        Account.objects.create(username='testuser', email='timbaney1989@gmail.com', first='tim', last='baney')
        account = Account.objects.get(username='testuser')
        Org.objects.create(name='test-org', actor_id=account)
        org = Org.objects.get(name='test-org')
        OrgInvite.objects.create(token=100, account_id=account, org_id=org)

    def login(self):
        self.user = User.objects.create(username='testuser', password='12345', is_active=True, is_staff=True, is_superuser=True)
        self.user.set_password('hello')
        self.user.save()
        self.user = authenticate(username='testuser', password='hello')
        login = self.c.login(username='testuser', password='hello')
        self.assertTrue(login)

    def test_index(self):
        response = self.c.get('/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, Just needs template

    def test_redirect(self):
        response = self.c.get('/r/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE = 302

    def test_admin(self):
        response = self.c.get('/admin/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE = 302

    def test_logout(self):
        response = self.c.get('/logout/')
        code = response.status_code
        self.assertTrue(code != 404 or code != 500)
    #  SUCCESS, CODE 302

    def test_verify(self):
        self.login()
        account = Account.objects.get(username='testuser')
        token = verification_token(account.id)
        response = self.c.get('/verify/' + token)
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS"

    def test_accept(self):
        response = self.c.get('/accept/100/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS

    def test_caregivers(self):
        response = self.c.get('/caregivers/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, Just needs template

    def test_home(self):
        response = self.c.get('/home/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, Just needs template

    #@login_required
    def test_app(self):
        response = self.c.get('/app/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    #@login_required
    def test_settings(self):
        response = self.c.get('/settings/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    def test_terms(self):
        response = self.c.get('/terms/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, Just needs template

    def test_pusher_auth(self):
        response = self.c.get('/pusher/auth/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  ERROR "IndexError: list index out of range, resource = fragments[1]"

class AccountViewTestCase(TestCase):
    c = Client()

    def setUp(self):
        Account.objects.create(id=2)
        account = Account.objects.get(id=2)
        Org.objects.create(id=2)
        org = Org.objects.get(id=2)
        thread = Thread.objects.create(org_id=org, kind=0, owner_id=account, name='welcome')
        OrgInvite.objects.create(token=1234, account_id=account, org_id=org)
        OrgInvite.objects.create(token=100, account_id=account, org_id=org, used=False)

    def login(self):
        self.user = User.objects.create(username='testuser', password='12345', is_active=True, is_staff=True, is_superuser=True)
        self.user.set_password('hello')
        self.user.save()
        self.user = authenticate(username='testuser', password='hello')
        self.c.login(username='testuser', password='hello')

    #@login_required
    def test_index(self):
        response = self.c.get('/accounts/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    #@login_required
    def test_me(self):
        response = self.c.get('/accounts/me/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    def test_login(self):
        response = self.c.post('/accounts/login/', {'email': 'timbaney1989@gmail.com', 'password': 'Whopper123@@'})
        code = response.status_code
        self.assertTrue(code != 404 and code != 500 and code != 403)
    #  SUCCESS, CODE 200

    #@login_required
    def test_update(self):
        response = self.c.post('/accounts/update/', {'first_name': 'timoteo', 'last_name': 'banateo', 'phone': '444-333-2222'})
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    def test_signup(self):
        response = self.c.post('/accounts/signup/', {'email': 'test@test.com', 'password': 'test123', 'password_conf': 'test123',
                                                     'org_name': 'test org', 'org_username': 'test org username', 'invite': '1234'})
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  ERROR "Invalid Mandrill API Key"

    def test_accept(self):
        response = self.c.post('/accounts/accept/', {'email': 'test@test.com', 'password': 'test123', 'password_conf': 'test123',
                                                    'token': '1234'})
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS

    #@login_required
    def test_caregiver(self):
        response = self.c.get('/accounts/caregiver/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    #@login_required
    def test_caregiver_info(self):
        response = self.c.get('/accounts/100/caregiver/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    #@login_required
    def test_profile(self):
        response = self.c.get('/accounts/100/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    def test_invite(self):
        response = self.c.get('/accounts/invite/100/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
#      SUCCESS, CODE 302

class MessageViewTestCase(TestCase):
    c = Client()

    def setUp(self):
        Account.objects.create(id=100)
        Account.objects.create(username='testuser', email='timbaney1989@gmail.com', first='tim', last='baney')
        Org.objects.create(id=100)

    def login(self):
        self.user = User.objects.create(username='testuser', password='12345', is_active=True, is_staff=True, is_superuser=True)
        self.user.set_password('hello')
        self.user.save()
        self.user = authenticate(username='testuser', password='hello')
        self.c.login(username='testuser', password='hello')

    #@login_required
    def test_index(self):
        self.login()

        response = self.c.get('/message/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    #@login_required
    def test_new_thread(self):
        response = self.c.post('/message/create/', {'org_id': 100, 'name': 'brand_new_thread', 'purpose': 'to test the view',
                                                    'privacy': 0})
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    #@login_required
    def test_get_thread(self):
        response = self.c.get('/message/100/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    #@login_required
    def test_update_thread(self):
        response = self.c.put('/message/100/', {'name': 'new_test_thread', 'purpose': 'to test the view with data',
                                                'privacy': 0})
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    #@login_required
    def test_send(self):
        response = self.c.post('/message/100/send/', {'message': 'this is a test message.'})
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    #@login_required
    def test_history(self):
        response = self.c.post('/message/100/history/', {'ts': 1460486530})
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    def test_add_member(self):
        account = Account.objects.get(id=100)
        org = Org.objects.get(id=100)

        Thread.objects.create(id=100, kind=0, org_id=org, owner_id=account)
        response = self.c.post('/message/100/member/', {'account_id': 100})
        response2 = self.c.post('/message/100/member/', {'email': 'timbaney1989@gmail.com'})
        code = response.status_code
        code2 = response2.status_code
        self.assertTrue(code != 404 and code != 500)
        self.assertTrue(code2 != 404 and code2 != 500)
    #  SUCCESS, CODE 200

    #@login_required
    def test_leave(self):
        response = self.c.get('/message/100/leave/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    #@login_required
    def test_remove(self):
        response = self.c.post('/message/100/remove/', {'account_id': 100})
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    #@login_required
    def test_archive(self):
        response = self.c.get('/message/100/archive/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

    #@login_required
    def test_unarchive(self):
        response = self.c.get('/message/100/unarchive/')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    #  SUCCESS, CODE 302

class OrgViewTestCase(TestCase):
    c = Client()

    #@login_required
    def test_orgs(self):
        response = self.c.get('/orgs')
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    # SUCCESS, CODE 301

    #@login_required
    def test_inviteByEmail(self):
        Org.objects.create(id=1000)
        token = codecs.encode(os.urandom(8), 'hex')
        response = self.c.post('/orgs/1000/invite-email/', {'name': 'test_org', 'email': 'test_email@yahoo.com', 'is_admin': 'True'})
        code = response.status_code
        self.assertTrue(code != 404 and code != 500)
    # SUCCESS, CODE 302
