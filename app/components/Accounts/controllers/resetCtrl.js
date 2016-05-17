/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for the password reset
 */
angular
    .module('app.account')
    .controller('resetCtrl', ['$scope', '$http', function ($scope, $http) {

        var viewModes = ['construction', 'reset_form', 'reset_sent'];
        $scope.viewMode = viewModes[0];

        $scope.resetModel = {
            email: ''
        };

        $scope.reset = function (model) {
            $http.post('/reset', model)
                .success(function (data, status) {
                    $scope.viewMode = viewModes[1];
                })
                .error(function () {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = "Oops. There was a problem. Please try again.";
                });
        };

    }]);