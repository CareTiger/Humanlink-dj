/**
 * API Service that talks to the backend.
 */
angular
    .module('Common')
    .factory('apiService', ['$http', function ($http) {

        // Google Cloud Endpoints URL.
        var getGceBase = function () {
            var host = window.location.host;
            // GCE doesn't work with custom domains.
            if (host.indexOf('humanlink.co') === 0) {
                host = 'care-tiger.appspot.com';
            }
            var protocol = host.indexOf('localhost') === 0 ? 'http://' : 'https://';
            return protocol + host + '/_ah/api/humanlink/v1/';
        };

        var GCE_BASE = getGceBase();

        var Accounts = {
            caregiver: {},
            patients: {}
        };
        var Connections = {};
        var Home = {};

        /**
         * Base method to communicate with the APIs.
         *
         * @param method : 'GET' or 'POST'
         * @param uri : relative path to the base URL or GCE URL
         * @param data : request data
         * @param ctrlHelper : CtrlHelper with callbacks
         * @param useEndpoints : whether this is a GCE API or not.
         */
        var apiRequest = function (method, uri, data, ctrlHelper, useEndpoints) {
            ctrlHelper.isLoading = true;
            ctrlHelper.isValid = true;
            ctrlHelper.errors = [];

            // Use endpoints by default.
            if (!angular.isDefined(useEndpoints)) {
                useEndpoints = true;
            }

            $http({
                method: method,
                url: (useEndpoints ? GCE_BASE : '/') + uri,
                data: data
            })
                .success(function (data, status, headers, config) {
                    ctrlHelper.isLoading = false;
                    if (angular.isFunction(ctrlHelper.success)) {
                        ctrlHelper.success(data, status, headers, config);
                    }
                    if (angular.isFunction(ctrlHelper.always)) {
                        ctrlHelper.always(data, status, headers, config);
                    }
                })
                .error(function (data, status, headers, config) {
                    ctrlHelper.isLoading = false;
                    if (angular.isFunction(ctrlHelper.failure)) {
                        ctrlHelper.failure(data, status, headers, config);
                    }
                    if (angular.isFunction(ctrlHelper.always)) {
                        ctrlHelper.always(data, status, headers, config);
                    }
                });
        };

        Accounts.login = function (data, ctrlHelper) {
            apiRequest('POST', 'login.json', data, ctrlHelper, false);
        };

        Accounts.signup = function (data, ctrlHelper) {
            apiRequest('POST', 'signup.json', data, ctrlHelper, false);
        };

        Accounts.userdata = function (data, ctrlHelper) {
            apiRequest('GET', 'accounts/userdata.json', data, ctrlHelper, false);
        };

        Accounts.get = function (id, ctrlHelper) {
            apiRequest('GET', 'accounts/' + id, {}, ctrlHelper, true);
        };

        Accounts.update = function (data, ctrlHelper) {
            apiRequest('POST', 'accounts/update', data, ctrlHelper, true);
        };

        Accounts.caregiver.get = function (accountId, ctrlHelper) {
            apiRequest('GET', 'accounts/caregiver', {}, ctrlHelper, true);
        };

        Accounts.caregiver.update = function (data, ctrlHelper) {
            apiRequest('POST', 'accounts/caregiver/update', data, ctrlHelper, true);
        };

        Accounts.patients.list = function (ctrlHelper) {
            apiRequest('GET', 'accounts/patients/list', {}, ctrlHelper, true);
        };

        Accounts.patients.update = function (data, ctrlHelper) {
            apiRequest('POST', 'accounts/patients/update', data, ctrlHelper, true);
        };

        Accounts.patients.remove = function (patient_id, ctrlHelper) {
            var data = {patient_id: patient_id};
            apiRequest('POST', 'accounts/patients/remove', data, ctrlHelper, true);
        };

        Home.contact = function (data, ctrlHelper) {
            apiRequest('POST', 'contact.json', data, ctrlHelper, false);
        };

        Connections.my = function (data, ctrlHelper) {
            apiRequest('GET', 'connections/my', data, ctrlHelper, true);
        };

        Home.search = function (data, ctrlHelper) {
            apiRequest('GET', 'home/search', data, ctrlHelper, false);
        };

        // Public methods.
        return {
            Accounts: Accounts,
            Connections: Connections,
            Home: Home
        };

    }]);
