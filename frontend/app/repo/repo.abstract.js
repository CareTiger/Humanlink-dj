(function () {
    'use strict';

    angular
        .module('app.repo')
        .factory('AbstractRepo', AbstractRepo);

    /** ngInject */
    function AbstractRepo($log, $http, $q, Config) {

        return {
            get: get,
            post: post,
            put: put,
            genericSuccess: genericSuccess,
            genericError: genericError
        };

        function get(uri, data, isApi) {
            return httpRequest('GET', uri, data, isApi);
        }

        function post(uri, data, isApi) {
            return httpRequest('POST', uri, data, isApi);
        }

        function put(uri, data, isApi) {
            return httpRequest('PUT', uri, data, isApi);
        }

        function httpRequest(method, uri, data, isApi) {
            isApi = angular.isDefined(isApi) ? isApi : true;

            var deferred = $q.defer();
            var promise = $http({
                method: method,
                url: (isApi ? Config.api_path : '/') + uri,
                data: data || {},
                timeout: deferred.promise
            }).catch(function (response) {
                $log.error(response);
                return $q.reject(response);
            }).finally(function () {
                promise.abort = angular.noop;
                deferred = null;
                promise = null;
            });
            // Abort the underlying request.
            promise.abort = function () {
                deferred.resolve();
            };
            return promise;
        }

        function genericSuccess(response) {
            return response.data;
        }

        function genericError(response) {
            var reason = "Oops, something went wrong. That's our bad.";
            if (response.status < 500 && response.data.message) {
                reason = response.data.message;
            }
            return $q.reject(reason);
        }

    }

})();
