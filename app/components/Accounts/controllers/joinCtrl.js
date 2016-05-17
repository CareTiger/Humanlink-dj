/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for the signup view.
 */
angular
    .module('app.account')
    .controller('joinCtrl', ['$scope', '$window', 'apiService',
        function ($scope, $window, apiService) {

            // Reference to the base ctrlHelper.
            var ctrlHelper = $scope.$parent.ctrlHelper;
            ctrlHelper.reset();

            // Possible ng-switch values.
            var viewModes = ['join_form', 'join_success'];

            $scope.viewMode = viewModes[0];
            $scope.signupModel = {};

            $scope.join = function (model) {
                ctrlHelper.reset();
                if (!validate(model, ctrlHelper)) {
                    return;
                }
                ctrlHelper.success = function (data, status, headers, config) {
                    $scope.viewMode = viewModes[1];
                };
                apiService.Accounts.signup(model, ctrlHelper);
            };

            $scope.cancel = function () {
                $scope.$parent.previous();
            };

            var validate = function (model, ctrlHelper) {
                var errors = [];
                if (!model.email || !model.password || !model.first_name || !model.last_name) {
                    errors.push('All fields are required.');
                }
                if (errors.length) {
                    ctrlHelper.isLoading = false;
                    ctrlHelper.isValid = false;
                    ctrlHelper.errors = errors;
                    return false;
                }
                return true;
            };

        }]);