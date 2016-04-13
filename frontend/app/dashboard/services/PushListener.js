/**
 * Dashboard push notification listeners.
 *
 * This service is responsible for listening and dispatching events
 * that were sent from Pusher.
 */
(function () {
    'use strict';

    angular
        .module('app.dashboard')
        .factory('PushListener', PushListener);

    /** ngInject */
    function PushListener($log, $rootScope, CommonService,
                          Notifications, MessagesService) {

        var EVENTS = {
            newMessage: 'message.new',
            threadCreated: 'thread.created'

        };

        // New message listener.
        CommonService.on(EVENTS.newMessage, onNewMessage);

        return {
            bindAndListen: bindAndListen
        };

        /**
         * Bind pre-defined user events to the given Pusher channel.
         *
         * This method simply re-broadcasts those events at the $rootScope level
         * so that anybody can subscribe at an application level.
         *
         * @param channel user's private channel
         */
        function bindAndListen(channel) {
            angular.forEach(EVENTS, function (name, key) {
                channel.bind(name, function (data) {
                    CommonService.broadcast(name, data);
                    digest();
                });
            });
        }

        function onNewMessage(scope, data) {
            $log.debug(EVENTS.newMessage + ': on');
            MessagesService.append(data.thread_id, data.chat);
            Notifications.newMessage(data.thread_id, data.chat);
        }

        function digest () {
            $rootScope.$digest();
        }

    }

})();
