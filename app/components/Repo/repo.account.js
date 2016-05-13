(function () {
    'use strict';

    AccountRepo.$inject = ["$q", "$log", "AbstractRepo"];
    angular
        .module('app.repo')
        .factory('AccountRepo', AccountRepo);

    /** ngInject */
    function AccountRepo($q, $log, AbstractRepo) {

        return {
            accept: accept,
            invite: invite,
            join: join,
            login: login,
            save: save,
            threadInvite: threadInvite,
        };

        /**
         * Create a new account with a new team.
         * @param model:
         * @returns {*}
         */
        function join(model) {
            return AbstractRepo.post('accounts/signup/', model, false)
                .then(genericSuccess, genericError);
        }

        /**
         * Authenticate an account.
         * @param model:
         * @returns {*}
         */
        function login(model) {
            return AbstractRepo.post('accounts/login/', model, false)
                .then(genericSuccess, genericError);
        }

        /**
         * Accept a org member invitation.
         * @param model: token, email, password, password_raw
         * @returns {Promise}
         */
        function accept(model) {
            return AbstractRepo.post('accounts/accept/', model, false)
                .then(genericSuccess, genericError);
        }

        /**
         * Update account information.
         * @param model
         * @returns {Promise}
         */
        function save(model) {
            return AbstractRepo.post('/accounts/update/', model)
                .then(apiGenericSuccess, genericError);
        }

        /**
         * Retrieve account information about the current user.
         * @returns {*}
         */
        function me() {
            return AbstractRepo.get('accounts/me/');
        }

        /**
         * Retrieve an org member invitation by token.
         * @param token
         * @returns {Promise}
         */
        function invite(token) {
            return AbstractRepo.get('accounts/invite/' + token, {}, false)
                .then(genericSuccess, function (response) {
                    if (response.status === 400) {
                        return $q.reject({'used': true});
                    }
                    if (response.status === 404) {
                        return $q.reject(null);
                    }
                    return genericError(response);
                });
        }
        
        function threadInvite(token) {
            return AbstractRepo.get('messages/invite/' + token, {}, false)
                .then(genericSuccess, function (response) {
                    if (response.status === 400) {
                        return $q.reject({'used': true});
                    }
                    if (response.status === 400) {
                        return $q.reject(null);
                    }
                    return genericError(response);
                })
        }

        function genericSuccess(response) {
            return response.data;
        }

        function genericError(response) {
            var reason = "Oops, something went wrong. That's our bad.";
            if (response.status < 500 && response.data.response.message) {
                reason = response.data.response.message;
            }
            return $q.reject(reason);
        }

        function apiGenericSuccess(response) {
            return response.data.data;
        }

    }

})();