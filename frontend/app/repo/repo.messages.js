(function () {
    'use strict';

    angular
        .module('app.repo')
        .factory('MessagesRepo', MessagesRepo);

    /** ngInject */
    function MessagesRepo($q, $log, AbstractRepo) {

        return {
            fetchThreads: fetchThreads,
            fetchHistory: fetchHistory,
            send: send,
            create: create,
            invite: invite,
            removeMember: removeMember,
            update: update,
            leave: leave,
            archive: archive,
            search: search
        };


        function fetchThreads() {
            return AbstractRepo.get('/threads').then(
                apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Retrieve thread history.
         *
         * @param threadId:
         * @param model: {ts}
         */
        function fetchHistory(threadId, model) {
            return AbstractRepo.post('/threads/' + threadId + '/history', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Send message to a thread.
         *
         * @param threadId:
         * @param model: {message}.
         */
        function send(threadId, model) {
            return AbstractRepo.post('/threads/' + threadId + '/send', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Create a new thread.
         *
         * @param model: {org_id, thread name, purpose}
         */
        function create(model) {
            return AbstractRepo.post('/threads/create', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Remove Member from thread.
         *
         * @param model: {account_id}
         */
        function removeMember(threadId, model) {
            return AbstractRepo.post('/threads/' + threadId + '/remove', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Send Invite to a new person
         *
         * @param threadID:
         * @param model: name and email of the person receiving the invite.
         */
        function invite(threadId, model) {
            return AbstractRepo.post('/threads/' + threadId + '/member', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Update thread information.
         *
         * @param threadId:
         * @param model: {thread name, purpose}
         */
        function update(threadId, model) {
            return AbstractRepo.put('/threads/' + threadId, model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Leave channel
         *
         * @param threadID:
         */
        function leave(threadId) {
            return AbstractRepo.post('/threads/' + threadId + '/leave')
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Archive the channel
         *
         * @param threadID:
         */
        function archive(threadId) {
            return AbstractRepo.post('/threads/' + threadId + '/archive')
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Search caregivers
         *
         * @param threadID:
         */
        function search(threadId) {
            return AbstractRepo.post('/threads/' + threadId + '/search')
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        function apiGenericSuccess(response) {
            return response.data.data;
        }

    }

})();
