/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Base controller for the home module.
 */
Search.$inject = ['$scope', '$http', 'SiteAlert', 'AccountRepo']
angular
    .module('app.guest')
    .controller('searchCtrl', Search)

    function Search ($scope, $http, SiteAlert, AccountRepo) {

        // find replacement for userSession

        $scope.searchModel = {};
        $scope.searchCaregiverResults = {};

        var init = function () {
            AccountRepo.get_caregivers()
                .then(function (response) {
                $scope.searchCaregiverResults = response.data;
                console.log($scope.searchCaregiverResults)

            }, function (response) {
                SiteAlert.danger("Oops. " + response.status + " Error. Please try again.")
            })

            AccountRepo.get_seekers()
                .then(function (response) {
                $scope.searchSeekerResults = response.data;
                console.log($scope.searchSeekerResults)

            }, function (response) {
                SiteAlert.danger("Oops. " + response.status + " Error. Please try again.")
            })

            $scope.auth.viewReady = true;

        };
        init();

        /**
         * Go back to the previous page/view.
         * @return void
         */
        $scope.previous = function () {
            $window.history.back();
        };

        $scope.find = function (model) {
            $http({
                url: '/search_caregivers',
                method: "GET",
                params: {search_string: model.search_string}
            }).then(function (response) {
                $scope.searchCaregiverResults = response.data;
            }, function (response) {
                SiteAlert.danger("Oops. " + response.status + " Error. Please try again.")
            });
        };

    };