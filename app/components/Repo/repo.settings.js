(function () {
    'use strict';

    SettingsRepo.$inject = ["$q", "$log", "AbstractRepo"];
    angular
        .module('app.repo')
        .factory('SettingsRepo', SettingsRepo);

    /** ngInject */
    function SettingsRepo($q, $log, AbstractRepo) {

        var cache = {
            settings: null
        };

        return {
            addPayment: addPayment,
            changePassword: changePassword,
            closeAccount: closeAccount,
            deletePayment: deletePayment,
            getSettings: getSettings,
            updateNotifications: updateNotifications
        };

        function getSettings(forceRemote) {
            if (!cache.settings || forceRemote) {
                cache.settings = dummyData();
            }
            return $q.when(cache.settings);
        }

        function changePassword(model) {
            console.log(model);
            return AbstractRepo.post('accounts/signup/', model, false)
                .then(genericSuccess, genericError);
        }

        function updateNotifications(model) {
            $log.debug('Fake change notifications.');
            return $q.when({'message': 'ok'});
        }

        function addPayment(paymentMethod) {
            cache.settings.payment = paymentMethod;
            return $q.when(cache.settings);
        }

        function deletePayment() {
            cache.settings.payment = "";
            return $q.when(cache.settings);
        }

        function closeAccount(model) {
            $log.debug('Fake close account.');
            return $q.when({'message': 'ok'});
        }

        function dummyData() {
            var settings = {
                notifications: {
                    "logins_sms": false,
                    "messages_sms": true,
                    "company_updates_email": true,
                    "request_reminders_email": false,
                    "company_promotions_email": true
                },
                payment: {
                    "brand": "Visa",
                    "last4": "4242",
                    "exp_month": "06",
                    "exp_year": "15",
                    "address_zip": "72701"
                }
            };
            return settings;
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