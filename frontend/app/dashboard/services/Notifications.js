/**
 * Notifications service.
 */
(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .factory('Notifications', Notifications);

    /** ngInject */
    function Notifications($window, AccountService, MessagesService,
                           NotificationManager) {

        return {
            newMessage: newMessage
        };

        /**
         * Displays a new message notification.
         * @param threadId
         * @param chat
         */
        function newMessage(threadId, chat) {
            if (!displayOk() || chat.kind !== 0 || AccountService.isAccountMe(chat.account_id)) {
                return;
            }
            var thread = MessagesService.getThreadInfo(threadId);
            var account = thread.membersIndexed[chat.account_id];
            var title = thread.name;
            var body = AccountService.accountName(account.profile) + ': ' + chat.text;

            NotificationManager.showNotification(title, {
                body: body,
                icon: thread.membersIndexed[chat.account_id].profile.gravatar_url,
                tag: 'main'
            }, onclick);

            function onclick() {
                $window.focus();
                MessagesService.navigateToThread(thread.id);
            }
        }

        function displayOk() {
            return !$window.document.hasFocus() && NotificationManager.isGranted();
        }

    }

})();
