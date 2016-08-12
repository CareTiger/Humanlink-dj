/**
 * Created by timothybaney on 5/16/16.
 */

'use strict';

/**
 * Controller for caregiver profile page
 */
angular
    .module('app.account')
    .controller('caregiverProfileCtrl', ['$scope', 'apiService', 'userSession',
                function ($scope, apiService, userSession) {

        var caregiverHelper = new HL.CtrlHelper(),
            connectionsHelper = new HL.CtrlHelper();

        caregiverHelper.reset();

        // TODO: Get this from API
        $scope.caregiver = {
            rating: 4,
            background_verified: true,
            community_verified: true,
            badges: {
                care_hours: 2100,
                no_shows: 4,
                beacons_answered: 14
            },
            certifications: [
                'CNA (Schmeiding Center)',
                'Bentonville High School'
            ],
            complements: [
                {
                    name: 'Si Robertson',
                    description: 'Ariana is a wonderful...'
                },
                {
                    name: 'Peter B',
                    description: 'Ariana has been a fantastic help to me and my...'
                },
                {
                    name: 'Jackie C',
                    description: 'Ariana is a lovely caregiver and great at her job!'
                }
            ]
        };

        getInfo();
        $scope.owner = false;

        function getInfo () {
            caregiverHelper.success = function (data, status, headers, config) {
                angular.extend($scope.caregiver, data);
                $scope.caregiver.pictureUrl = 'profile_' + data.first +
                    data.last + '.png';
                $scope.caregiver.bannerUrl = 'banner_' + data.first +
                    data.last + '.png';
            };

            connectionsHelper.success = function (data, status, headers,
                                                  config) {
                $scope.caregiver.connections = data.items;
            };

            apiService.Accounts.get(userSession.userdata.account_id,
                                    caregiverHelper);
            apiService.Connections.my({}, connectionsHelper);
        }
    }]);