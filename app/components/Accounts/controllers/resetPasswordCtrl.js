/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for the password reset
 */
angular
    .module('app.account')
    .controller('resetPasswordCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.passwordModel = {};
        var viewModes = ['working', 'construction'];
        $scope.viewMode = viewModes[1];

        $scope.resetPassword = function (model) {
            if (!validate(model)) {
                return;
            }

            $http.post('/reset_password', model)
                .success(function (data, status) {
                    $scope.siteAlert.type = "success";
                    $scope.siteAlert.message = "Your password was updated.";
                })
                .error(function () {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = "Oops. There was a problem. Please try again.";
                });
        };

        var validate = function (model) {
            if (!model.password || !model.password_confirm) {
                $scope.siteAlert.type = "danger";
                $scope.siteAlert.message = "All fields are required.";
                return false;
            }
            if (model.password !== model.password_confirm) {
                $scope.siteAlert.type = "danger";
                $scope.siteAlert.message = "Password does not match the confirmation.";
                return false;
            }
            return true;
        };

    }]);