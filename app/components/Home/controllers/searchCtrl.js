/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Base controller for the home module.
 */
Search.$inject = ['$scope', '$http', 'SiteAlert']
angular
    .module('app.guest')
    .controller('searchCtrl', Search)

    function Search ($scope, $http, SiteAlert) {

        // find replacement for userSession

        $scope.searchModel = {};
        $scope.searchCaregiverResults = {};

        var init = function () {
            $http({
                url: '/search_caregivers',
                method: "GET",
                params: {search_string: ''}
            }).then(function (response) {
                $scope.searchCaregiverResults = response.data;

            }, function (response) {
                $scope.siteAlert.type = "danger";
                $scope.siteAlert.message = ("Oops. " + response.status + " Error. Please try again.");
            });

            $http({
                url: '/search_seekers',
                method: "GET",
                params: {search_string: ''}
            }).then(function (response) {
                $scope.searchSeekerResults = response.data;

            }, function (response) {
                SiteAlert.danger("Oops. " + response.status + " Error. Please try again.")
            });

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