/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Main landing page.
 */
(function () {
    Ctrl.$inject = ["$scope", "$http", "$location", "$anchorScroll"];
    angular
        .module('Home')
        .controller('LandingCtrl', Ctrl);

    /** @ngInject */
    function Ctrl($scope, $http, $location, $anchorScroll) {
        $scope.showInvite = true;
        $scope.invite = invite;
        $scope.gotoInvite = gotoInvite;
        $scope.contact = {
            interest: $location.absUrl().indexOf('/caregiver') >= 0 ? 1 : 2
        };

        function gotoInvite() {
            $location.path('/');
            $location.hash('invite');
            $anchorScroll();
        }

        function invite(contact) {
            if (!contact.name || !contact.email || !contact.zipcode || !contact.interest) {
                return;
            }
            $http.post('/submit_contact', contact)
                .success(function (data, status) {
                    $scope.showInvite = false;
                    gotoInvite();
                })
                .error(function () {
                    // Dang.
                });
        }
    }

})();