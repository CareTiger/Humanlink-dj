'use strict';

/**
 * Payments controller
 */
angular
    .module('app.settings')
    .controller('paymentsCtrl', ['$scope', '$http', 'userSession',
        function ($scope, $http, userSession) {

            $scope.paymentModel = {};
            $scope.usr = userSession;
            var account_id = $scope.usr.userdata.account_id;

            var init = function () {
                $http.get('/get_settings_payments?account_id=' + account_id)
                    .success(function (response) {
                        $scope.paymentModel = response;
                    })
                    .error(function () {
                        $scope.siteAlert.type = "danger";
                        $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
                    });
            };
            init();

            $scope.updatePayments = function (model) {
                model = angular.extend(model, {'account_id': account_id});
                $http.post('/post_settings_payments', model)
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