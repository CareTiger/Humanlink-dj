/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Base controller for the home module.
 */
angular
    .module('Admin')
    .controller('verificationCtrl', ['$scope', '$http', '$window', 'userSession',
        function ($scope, $http, $window, userSession) {

            $scope.verificationModel = {};
            $scope.usr = userSession;
            var account_email = $scope.usr.userdata.email;

            $scope.getVerification = function (model) {
                $http({
                    url: '/get_admin_verification',
                    method: "GET",
                    params: {email: model.email, account_email: account_email}
                }).then(function (response) {
                    $scope.verificationModel = response.data;
                }, function (response) {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                });
            };

            $scope.updateVerification = function (model) {
                console.log(model);
                $http.post('/post_admin_verification', model)
                    .success(function (data, status) {
                        $scope.siteAlert.type = "success";
                        $scope.siteAlert.message = "Your settings were updated successfully.";
                    })
                    .error(function () {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = "Oops. There was a problem. Please try again.";
                    });

            };
        }]);
