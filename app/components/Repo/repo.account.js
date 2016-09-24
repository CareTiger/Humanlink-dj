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
            getTeam: getTeam,
            updateTeam: updateTeam,
            getCaregiver: getCaregiver,
            updateCaregiver: updateCaregiver,
            me: me,
            threadInvite: threadInvite,
            search: search,
            caregiver_info: caregiver_info,
            careseeker_info: careseeker_info,
            connect: connect,
            get_caregivers: get_caregivers,
            get_seekers: get_seekers,
            check_availability: check_availability,
            resetPassword: resetPassword,
            resetPasswordEmail: resetPasswordEmail,
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
         * Send a connect invitation to people around you.
         * @param model: email of sender/receiver
         * @returns {Promise}
         */
        function connect(model) {
            return AbstractRepo.post('accounts/connect/?email=' + model, model, false)
                .then(genericSuccess, genericError);
        }

        /**
         * Update account information.
         * @param model
         * @returns {Promise}
         */
        function save(model) {
            return AbstractRepo.post('accounts/update/', model, false)
                .then(apiGenericSuccess, genericError);
        }

        /**
         * Get Team information.
         * @returns {*}
         */
        function getTeam() {
            return AbstractRepo.get('/accounts/getTeam/');
        }

        /**
         * Update Team information.
         * @param model
         * @returns {Promise}
         */
        function updateTeam(model) {
            return AbstractRepo.post('accounts/updateTeam/', model, false)
                .then(apiGenericSuccess, genericError);
        }

        /**
         * Get Caregiver information.
         * @returns {*}
         */
        function getCaregiver() {
            return AbstractRepo.get('/accounts/get_caregiver/');
        }

        /**
         * Update Caregiver information.
         * @param model
         * @returns {Promise}
         */
        function updateCaregiver(model) {
            return AbstractRepo.post('accounts/update_caregiver/', model, false)
                .then(apiGenericSuccess, genericError);
        }

        /**
         * Retrieve account information about the current user.
         * @returns {*}
         */
        function me() {
            return AbstractRepo.get('/accounts/me/');
        }

        /**
         * Get Search results.
         * @returns {*}
         */
        function search() {
            return AbstractRepo.get('/accounts/nearme');
        }

        /**
         * Get caregiver info .
         * @returns {*}
         */
        function caregiver_info(model) {
            return AbstractRepo.get('/accounts/caregiverProfile/?email=' + model.email);
        }

        /**
         * Get careseeker info .
         * @returns {*}
         */
        function careseeker_info(model) {
            return AbstractRepo.get('/accounts/careseekerProfile/?email=' + model.email);
        }

        /**
         * Retrieve caregiver information for all caregivers, or those that match search parameters
         * @returns {*}
         */
        function get_caregivers() {
            return AbstractRepo.get('/accounts/search_caregivers/');
        }

        /**
         * reset password information.
         * @param model
         * @returns {Promise}
         */
        function resetPassword(model) {
            return AbstractRepo.post('accounts/reset_password/', model, false)
                .then(apiGenericSuccess, genericError);
        }

        /**
         * reset password request using email
         * @param model
         * @returns {Promise}
         */
        function resetPasswordEmail(model) {
            return AbstractRepo.post('accounts/reset_password_email/', model, false)
                .then(apiGenericSuccess, genericError);
        }

        /**
         * Retrieve all seekers.
         * @returns {*}
         */
        function get_seekers() {
            return AbstractRepo.get('/accounts/search_seekers/');
        }

        /**
         * Retrieve all seekers.
         * @returns {*}
         */
        function check_availability(account_id) {
            return AbstractRepo.get('accounts/availability/' + account_id);
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