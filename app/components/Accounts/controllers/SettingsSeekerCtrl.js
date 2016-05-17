/**
 * Settings Seeker Controller
 */

angular
    .module('app.account')
    .controller('settingsSeekerCtrl', ['$scope', '$http', 'Constants', 'apiService', 'userSession',
        function ($scope, $http, Constants, apiService, userSession) {

            $scope.aboutMe = {};
            $scope.usr = userSession;
            var account_id = $scope.usr.userdata.account_id;

            var init = function () {
                $http.get('/seeker_profile?account_id=' + account_id)
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
                $http({
                    url: '/get_connections',
                    method: "GET",
                    params: {account_id: account_id}
                }).then(function (response) {
                    $scope.connections = response.data;
                }, function (response) {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                });

            };
            init();

            $scope.seekerProfileUpdate = function seekerProfileUpdate(model) {
                console.log("account_id : " + account_id);
                angular.extend(model, {'account_id': account_id});

                $http.post('/post_seeker_profile', model)
                    .success(function (data, status) {
                        $scope.siteAlert.type = "success";
                        $scope.siteAlert.message = "Changes have been saved.";
                    })
                    .error(function () {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = "Oops. There was an error. Please try again.";
                    });
            };

        }]);