/**
 * Messages service.
 */
(function () {
    'use strict';

    MessagesService.$inject = ["$q", "$log", "$state", "underscore", "MessagesRepo"];
    angular
        .module('app.dashboard')
        .factory('MessagesService', MessagesService);

    /** ngInject */
    function MessagesService($q, $log, $state, underscore, MessagesRepo) {
        var self = this;

        var cache = {
            threads: null,
            threadsIndexed: null,
            // thread_id => messages mapping.
            messages: {}
        };

        return {
            append: append,
            getThreads: getThreads,
            getHistory: getHistory,
            getThreadInfo: getThreadInfo,
            send: send,
            navigateToThread: navigateToThread
        };

        /**
         * Returns list of threads the user is member of.

         * @param forceRemote: if true, forces a remote request.
         * @return {Promise -> Array}
         */
        function getThreads(forceRemote) {
            if (cache.threads && !forceRemote) {
                return $q.when(cache.threads);
            }
            return MessagesRepo.fetchThreads()
                .then(function (threads) {
                threads.threads.forEach(function (thread) {
                    thread.membersIndexed = underscore.indexBy(thread.members, 'account');
                });

                cache.threads = underscore.sortBy(threads, 'name');
                cache.threadsIndexed = underscore.indexBy(threads.threads, 'id');

                return cache.threads;
            });
        }

        /**
         * Returns a cached thread history.
         *
         * The content of the array may change after the return call.
         * (e.g a message is posted or removed).
         *
         * Be careful modifying the content of the returned array as it
         * may have side affects.
         *
         * @param threadId
         * @param forceRemote: if true, forces a remote request.
         *
         * @return {Promise -> Array} messages
         */
        function getHistory(threadId, forceRemote) {
            threadId = parseInt(threadId);
            if (cache.messages[threadId] && !forceRemote) {
                    return $q.when(cache.messages[threadId]);
            }
            return MessagesRepo.fetchHistory(threadId).then(function (thread) {
                cache.messages[threadId] = thread.all_chats.slice().reverse();
                return cache.messages[threadId];
            });
        }

        /**
         * Appends a message to the end of the cached messages.
         *
         * @param threadId
         * @param message
         * @return {Promise -> Array}
         */
        function append(threadId, message) {
            threadId = parseInt(threadId);
            return getHistory(threadId).then(function (messages) {
                if (!messages) {
                    $log.warn('Trying to append to a non-existing thread.');
                    return;
                }
                messages.push(message);
                return messages;
            });
        }

        /**
         * Post a new message to a thread.
         *
         * TODO: add a temporary message while sending is in progress.
         *
         * @param model
         * @return {Promise -> Object}
         */
        function send(threadId, model) {
            threadId = parseInt(threadId);
            return MessagesRepo.send(threadId, model);
        }

        /**
         * Returns cached thread information.
         *
         * @param threadId
         * @return {Thread}
         */
        function getThreadInfo(threadId) {
            threadId = parseInt(threadId);
            console.log(threadId)
            return cache.threadsIndexed[threadId];
        }

        /**
         * Navigates to a thread view.
         * @param threadId
         */
        function navigateToThread(threadId) {
            var thread = getThreadInfo(threadId);
            return $state.go('dashboard.messages', {
                threadId: thread.id,
                owner: thread.owner.id,
                thread: thread.name
            });
        }
    }

})();