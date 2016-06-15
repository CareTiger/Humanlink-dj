/**
 * Dashboard helper/bootstraper.
 */
(function () {
    'use strict';

    DashboardHelper.$inject = ["$q", "$log", "$timeout", "$pusher", "PushListener", "MessagesService", "Session"];
    angular
        .module('app.dashboard')
        .factory('DashboardHelper', DashboardHelper);

    /** ngInject */
    function DashboardHelper($q, $log, $timeout, $pusher, PushListener,
                             MessagesService, Session) {

        return {
            initialize: init
        };

        /**
         * Bootstraps the Dashboard module, specifically:
         *   - Fetches org summary
         *   - Fetches thread messages
         *   - Binds pusher events.
         */
        function init() {
            var threadsPr = MessagesService.getThreads().then(function (threads) {
                // Asynchronously fetch thread histories.
                // TODO: Delay won't be necessary once all templates are in one place.
                $timeout(function () {fetchThreads(threads)}, 100);
                return threads;
            });
            var pusherPr = bindPusher();
            return $q.all([threadsPr, pusherPr]);
        //    remember to put pusherPr back into array on line above next to threadsPr
        }

        /**
         * Fetches history for all the threads in the org.
         *
         * TODO: only fetch recent 3-5 threads.
         */
        function fetchThreads(threads) {
            threads[0].forEach(function (thread) {
                if (thread.is_archived) {
                    return;
                }
                MessagesService.getHistory(thread.id);
            });
        }

        /**
         * Subscribes to user's Pusher channel and binds callback events.
         */
        function bindPusher() {
            var defer = $q.defer();

            var channelName = 'public-account-' + Session.account.id;
            var channel = $pusher.client.subscribe(channelName);

            channel.bind('my_event', function(data) {
                alert('There\'s a new chat !');
            });

            channel.bind('pusher:subscription_succeeded', function (data) {
                $log.debug('Pusher subscribed: ' + channel.name);
                PushListener.bindAndListen(channel);
                defer.resolve(data);
            });
            channel.bind('pusher:subscription_error', function (status) {
                if (status === 403) {
                    var msg = 'Pusher channel not authorized.';
                    $log.warn(msg);
                    defer.reject(msg);
                }
            });

            return defer.promise;
        }
    }

})();