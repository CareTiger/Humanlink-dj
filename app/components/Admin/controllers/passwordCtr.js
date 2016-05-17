/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Base controller for the home module.
 */
angular
    .module('Admin')
    .controller('passwordCtrl', ['$scope', '$http', 'userSession',
        function ($scope, $http, userSession) {

            $scope.updatePassword = function (model) {
                $http.post('/post_admin_password', model)
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