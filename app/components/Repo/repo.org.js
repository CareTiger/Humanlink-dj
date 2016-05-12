(function () {
    'use strict';

    OrgsRepo.$inject = ["AbstractRepo"];
    angular
        .module('app.repo')
        .factory('OrgsRepo', OrgsRepo);

    /** ngInject */
    function OrgsRepo(AbstractRepo ) {

        return {
            fetchSummary: fetchSummary,
            sendInvite: sendInvite
        };

        /**
         * Retrieve org summary for the current account.
         */
        function fetchSummary() {
            return AbstractRepo.get('/orgs').then(
                function (response) {
                    return response.data.response;
                },
                AbstractRepo.genericError
            );
        }

        /**
         * Send Invite to a new person
         *
         * @param orgID:
         * @param model: name and email of the person receiving the invite.
         */
        function sendInvite(orgId, model) {
            return AbstractRepo.post('/org/' + orgId + '/invite-email', model)
                .then(AbstractRepo.genericSuccess, AbstractRepo.genericError);
        }

    }

})();