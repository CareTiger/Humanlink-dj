/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

angular
    .module('app.account')
    .controller('providerEditCtrl', ['$scope', '$http', 'Constants', 'apiService', 'userSession',
        function ($scope, $http, Constants, apiService, userSession) {

            $scope.aboutMe = {};
            $scope.usr = userSession;
            var account_id = $scope.usr.userdata.account_id;

            var init = function () {
                $http.get('/get_caregiver_profile?account_id=' + account_id)
                    .then(function (response) {
                        $scope.aboutMe = response.data;
                        if (response.data.count === '0') {
                            $scope.siteAlert.type = "success";
                            $scope.siteAlert.message = (response.data.message);
                        }
                    }, function (response) {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                    });
            };
            init();

            $scope.caregiverProfileUpdate = function caregiverProfileUpdate(model) {
                console.log("account_id : " + account_id);
                angular.extend(model, {'account_id': account_id});

                $http.post('/post_caregiver_profile', model)
                    .success(function (data, status) {
                        $scope.siteAlert.type = "success";
                        $scope.siteAlert.message = "Changes have been saved.";
                        $scope.showCaregiverForm = false;
                    })
                    .error(function () {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = "Oops. There was an error. Please try again.";
                    });
            };

        }]);