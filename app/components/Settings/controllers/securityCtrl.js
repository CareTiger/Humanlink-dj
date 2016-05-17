/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Security controller
 */
angular
    .module('app.settings')
    .controller('securityCtrl', ['$scope', '$http', 'userSession',
        function ($scope, $http, userSession) {

            $scope.paymentModel = {};
            $scope.usr = userSession;
            var account_email = $scope.usr.userdata.email;

            var validate = function (model) {
                if (!model.password || !model.password_confirm) {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = "All fields are required.";
                }
                if (model.password !== model.password_confirm) {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = "Password does not match the confirmation.";
                }
                return true;
            };

            $scope.updatePassword = function (model) {
                if (!validate(model)) {
                    return false;
                }
                model = angular.extend(model, {'email': account_email});
                $http.post('/post_settings_security', model)
                    .success(function (data, status) {
                        $scope.siteAlert.type = "success";
                        $scope.siteAlert.message = "Your password was updated successfully.";
                    })
                    .error(function () {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = "Oops. There was a problem. Please try again.";
                    });
            };


        }]);