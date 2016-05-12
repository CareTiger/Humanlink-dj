/**
 * Messages view controller.
 */
(function () {
    'use strict';

    Messages.$inject = ["$log", "$stateParams", "$state", "underscore", "CommonService", "CommonEvents", "AccountService", "MessagesService", "MessageFormatter", "threadInfo"];
    angular
        .module('app.dashboard')
        .controller('Messages', Messages);

    /** @ngInject */
    function Messages($log, $stateParams, $state, underscore, CommonService, CommonEvents,
                      AccountService, MessagesService, MessageFormatter, threadInfo) {
        var vm = this;
        vm.thread = null;
        vm.messages = null;
        vm.members = null;
        vm.message = '';
        vm.submitBusy = false;
        vm.errorMessage = null;

        vm.send = send;
        vm.onKeypress = onKeypress;
        vm.accountName = accountName;
        vm.isSameDay = isSameDay;
        vm.localTime = localTime;
        vm.body = body;

        init();

        function init() {
            $log.debug('messages init');

            vm.thread = threadInfo.thread;
            vm.members = threadInfo.members;

            var threadId = $stateParams.threadId

            load(threadId);
        }

        function load(threadId) {
            MessagesService.getHistory(threadId).then(function (chats) {
                vm.messages = chats;
                console.log(chats)
                CommonService.broadcast(CommonEvents.viewReady);
            });
        }

        function send(message) {
            vm.submitBusy = true;
            vm.errorMessage = null;

            var model = {
                message: message
            };

            var threadId = $stateParams.threadId

            MessagesService.send($stateParams.threadId, model).then(
                function (data) {
                    vm.submitBusy = false;
                    vm.message = '';
                    vm.messages.unshift(data.threadchat)
                    console.log(vm.messages)
                },
                function (data) {
                    vm.submitBusy = false;
                    vm.errorMessage = data;
                })


        }

        function onKeypress(event, message) {
            if (event.which === 13 && !event.shiftKey) {
                event.preventDefault();
                if (message.trim()) {
                    return vm.send(message);
                }
            }
        }

        /**
         * Returns whether two dates are the same day.
         * @returns {boolean}
         */
        function isSameDay(date1, date2) {
            return moment(date1).isSame(date2, 'day');
        }

        /**
         * Converts to local date/time from UTC.
         * @returns {Date}
         */
        function localTime(date) {
            return moment.utc(date).toDate();
        }

        /**
         * Renders the message body.
         *
         * @returns {String} HTML output.
         */
        function body(chat) {
            this.ML = this.ML || /\n/gm;
            var ml = this.ML;
            var text = chat.text;

            switch (chat.kind) {
                case 0:
                    text = underscore.escape(text);
                    text = MessageFormatter.run(text);
                    text = text.replace(ml, '<br/>');
                    break;
                case 2:
                    text = "joined " + vm.thread.name;
                    if (chat.inviter !== null) {
                        text += " by invitation from " + accountName(chat.inviter);
                    }
                    break;
                case 3:
                    if (chat.remover !== null) {
                        text = "was removed from " + vm.thread.name + " by " +
                            accountName(chat.remover)
                    }
                    else {
                        text = "left " + vm.thread.name;
                    }
                    break;
                case 4:
                    text = "archived " + vm.thread.name;
                    break;
                case 5:
                    text = "unarchived " + vm.thread.name;
                    break;
                case 6:
                    text = "updated thread " + vm.thread.name;
            }
            return text;
        }

        /**
         * Returns displayable account name.
         * @param accountId
         * @return {String}
         */
        function accountName(accountId) {
            var profile = vm.members[accountId].profile;
            return AccountService.accountName(profile);
        }
    }

})();