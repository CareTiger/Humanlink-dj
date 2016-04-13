/**
 * Service that keeps track of the current logged in user.
 */
(function () {
    'use strict';

    angular
        .module('app.common')
        .provider('Session', Session);

    function Session() {

        var roles = {
            GUEST: 0,
            AUTHORIZED: 1
        };

        return {
            roles: roles,
            $get: SessionService
        };

        function SessionService(AccountRepo) {
            var self = this;

            // Initial page load.
            // TODO: Rename this to window.hl.account
            self.account = window.HL.userdata;

            return {
                roles: roles,
                account: self.account,
                isAuthorized: isAuthorized,
                update: update
            };

            /**
             * Refreshes the user information from the server.
             * @return {Promise}
             */
            function update() {
                return AccountRepo.me().then(
                    function (data) {
                        self.account = data;
                    },
                    function (error) {
                        self.account = null;
                    }
                );
            }

            /**
             * Returns whether or not the current user is logged in.
             * @return {boolean}
             */
            function isAuthorized() {
                return angular.isObject(self.account);
            }
        }

    }

})();
