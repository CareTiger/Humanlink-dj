/**
 *
 */
(function () {
    'use strict';

    AccountService.$inject = ["$log", "$q", "Session"];
    angular
        .module('app.dashboard')
        .factory('AccountService', AccountService);

    /** @ngInject */
    function AccountService($log, $q, Session) {

        return {
            isAccountMe: isAccountMe,
            accountName: getAccountName
        };

        /**
         * Checks if the account ID is the same as the logged in user's.
         *
         * @param accountId:
         * @return {Account|false}
         */
        function isAccountMe(accountId) {
            return Session.account.id === parseInt(accountId);
        }

        /**
         * Returns account name.
         * @param member: Account object
         * @returns {String}
         */
        function getAccountName(profile) {
            if (profile.name.trim()) {
                return profile.name;
            }
            var name = profile.first;
            if (profile.last) {
                name += ' ' + profile.last;
            }
            if (!name) {
                name = profile.username || profile.email || 'Unnamed';
            }
            profile.name = name;
            return name;
        }
    }
})();
