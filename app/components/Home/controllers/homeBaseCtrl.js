/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Base controller for the home module.
 */
angular
    .module('Home')
    .controller('homeBaseCtrl', ['$scope', '$window', '$http',
        function ($scope, $window, $http) {
            // bring in userSession if this controller ever gets used.
            $scope.SignUp = function () {
                $window.location.href = '/home/join';
            };

        }]);