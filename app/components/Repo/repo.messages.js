(function () {
    'use strict';

    MessagesRepo.$inject = ["$q", "$log", "AbstractRepo"];
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
            updatePurpose: updatePurpose,
            leave: leave,
            archive: archive,
            search: search
        };


        function fetchThreads() {
            return AbstractRepo.get('/message/').then(
                apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Retrieve thread history.
         *
         * @param threadId:
         * @param model: {ts}
         */
        function fetchHistory(threadId, model) {
            return AbstractRepo.post('/message/' + threadId + '/history/', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Send message to a thread.
         *
         * @param threadId:
         * @param model: {message}.
         */
        function send(threadId, model) {
            return AbstractRepo.post('/message/' + threadId + '/send/', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Create a new thread.
         *
         * @param model: {org_id, thread name, purpose}
         */
        function create(model) {
            return AbstractRepo.post('/message/create/', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Remove Member from thread.
         *
         * @param model: {account_id}
         */
        function removeMember(threadId, model) {
            return AbstractRepo.post('/message/' + threadId.thread_id + '/' + threadId.member_id + '/remove/', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Send Invite to a new person
         *
         * @param threadID:
         * @param model: name and email of the person receiving the invite.
         */
        function invite(threadId, model) {
            return AbstractRepo.post('/message/' + threadId + '/member/', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Update thread purpose.
         *
         * @param threadId:
         * @param model: {thread name, purpose}
         */
        function updatePurpose(threadId, model) {
            return AbstractRepo.put('/message/' + threadId + '/update/', model)
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Leave channel
         *
         * @param threadID:
         */
        function leave(threadId) {
            return AbstractRepo.post('/message/' + threadId + '/leave/')
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Archive the channel
         *
         * @param threadID:
         */
        function archive(threadId) {
            return AbstractRepo.post('/message/' + threadId + '/archive/')
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        /**
         * Search caregivers
         *
         * @param threadID:
         */
        function search(threadId) {
            return AbstractRepo.post('/message/' + threadId + '/search/')
                .then(apiGenericSuccess, AbstractRepo.genericError);
        }

        function apiGenericSuccess(response) {
            return response.data.response;
        }

    }

})();