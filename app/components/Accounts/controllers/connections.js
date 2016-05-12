/**
 * Press controller
 */
angular
    .module('app.account')
    .controller('connectionsCtrl', ['$scope', '$state', '$http', 'userSession',
        function ($scope, $state, $http, userSession) {

            $scope.connections = {};
            $scope.usr = userSession;
            var account_id = $scope.usr.userdata.account_id;

            var init = function () {
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

            $scope.accept = function (model) {
                $http({
                    url: '/post_connection_accept',
                    method: "POST",
                    params: {to_id: account_id, from_id: model}
                }).then(function (response) {
                    $scope.connections = response.data;
                    $state.reload();
                }, function (response) {
                    $scope.siteAlert.type = "danger";
                    $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                });
            }

        }]);