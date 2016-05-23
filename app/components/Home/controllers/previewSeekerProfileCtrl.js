/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Press controller
 */
angular
    .module('app.guest')
    .controller('previewSeekerProfileCtrl', ['$scope', '$window', '$stateParams', '$http',
        function ($scope, $window, $stateParams, $http) {
            // bring in alternative to userSession
            var seeker_id = $stateParams.account_id;
            $scope.aboutMe = {};
            // $scope.usr = userSession;

            var init = function () {
                $http.get('/seeker_profile?account_id=' + seeker_id)
                    .then(function (response) {
                        $scope.aboutMe = response.data;
                    });
            };
            init();

            $scope.connect = function () {
                if ($scope.usr.userdata !== null) {
                    var account_id = $scope.usr.userdata.account_id;
                    $http({
                        url: '/post_connection_request',
                        method: "POST",
                        params: {
                            from_id: account_id,
                            to_id: seeker_id,
                            message: "I would like to connect with you."
                        }
                    }).then(function (response) {
                        $scope.siteAlert.type = "success";
                        $scope.siteAlert.message = response.data.message;
                    }, function (response) {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                    });
                }
                else {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = ("Please Sign-In");
                }
            }

        }]);