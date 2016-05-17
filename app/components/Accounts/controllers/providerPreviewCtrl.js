/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Press controller
 */
angular
    .module('app.account')
    .controller('providerPreviewCtrl', ['$scope', 'userSession', '$http',
        function ($scope, userSession, $http) {

            $scope.profile = {};
            $scope.usr = userSession;
            var account_id = $scope.usr.userdata.account_id;
            var email = $scope.usr.userdata.email;

            var init = function () {
                $http({
                    url: '/caregiver_profile',
                    method: "GET",
                    params: {account_id: account_id}
                }).then(function (response) {
                    $scope.profile = response.data;
                }, function (response) {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                });
            };
            init();

        }]);