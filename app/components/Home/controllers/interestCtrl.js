/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Interest controller
 */
(function () {
    Ctrl.$inject = ["$scope", "$http", "$location", "$anchorScroll"];
    angular
        .module('Home')
        .controller('interestCtrl', Ctrl);

    /** @ngInject */
    function Ctrl($scope, $http, $location, $anchorScroll) {
        $scope.showInvite = true;
        $scope.invite = invite;

        function invite(contact) {
            if (!contact.name || !contact.email || !contact.zipcode || !contact.interest) {
                return;
            }
            $http.post('/submit_contact', contact)
                .success(function (data, status) {
                    $scope.showInvite = false;
                })
                .error(function () {
                    // Dang.
                });
        }
    }

})();